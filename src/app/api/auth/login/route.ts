import { prisma } from '@/lib/prisma';
import { SESSION_COOKIE_NAME, createSession, verifyPassword } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
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
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return applyCors(
        request,
        NextResponse.json(
          {
            error: 'Invalid credentials'
          },
          { status: 400 }
        )
      );
    }

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (!user || !user.isActive) {
      return applyCors(
        request,
        NextResponse.json(
          {
            error: 'Invalid email or password'
          },
          { status: 401 }
        )
      );
    }

    const passwordValid = await verifyPassword(password, user.passwordHash);

    if (!passwordValid) {
      return applyCors(
        request,
        NextResponse.json(
          {
            error: 'Invalid email or password'
          },
          { status: 401 }
        )
      );
    }

    if (user.role === 'CUSTOMER') {
      return applyCors(
        request,
        NextResponse.json(
          { error: 'Customer accounts cannot sign in to admin' },
          { status: 403 }
        )
      );
    }

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
  } catch (error) {
    console.error('Login failed:', error);
    return NextResponse.json(
      {
        error: 'Unable to sign in'
      },
      { status: 500 }
    );
  }
}
