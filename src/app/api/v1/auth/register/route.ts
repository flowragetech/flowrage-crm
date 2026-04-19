import { prisma } from '@/lib/prisma';
import { SESSION_COOKIE_NAME, createSession, hashPassword } from '@/lib/auth';
import { isSystemInitialized } from '@/lib/system-init';
import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(120).optional()
});

function applyCors(request: NextRequest, response: NextResponse) {
  const origin = request.headers.get('origin') || '*';
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );
  return response;
}

export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );
  const origin = request.headers.get('origin') || '*';
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
}

export async function POST(request: NextRequest) {
  try {
    const initialized = await isSystemInitialized();

    if (!initialized) {
      return applyCors(
        request,
        NextResponse.json(
          { error: 'Run system setup before registering users.' },
          { status: 403 }
        )
      );
    }

    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return applyCors(
        request,
        NextResponse.json(
          {
            error: 'Invalid data',
            details: result.error.flatten()
          },
          { status: 400 }
        )
      );
    }

    const { email, password, name } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (existingUser) {
      return applyCors(
        request,
        NextResponse.json(
          {
            error: 'Email is already in use'
          },
          { status: 400 }
        )
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash: hashedPassword,
        role: 'CUSTOMER'
      }
    });

    const { sessionToken, expires } = await createSession(user.id);

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

    response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires
    });

    return applyCors(request, response);
  } catch {
    return NextResponse.json(
      {
        error: 'Unable to register user'
      },
      { status: 500 }
    );
  }
}
