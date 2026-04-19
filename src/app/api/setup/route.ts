import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, createSession, hashPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isSystemInitialized, SYSTEM_PERMISSION_KEYS } from '@/lib/system-init';
import { Role } from '@prisma/client';
import * as z from 'zod';

const setupSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  password: z.string().min(8)
});

export async function GET() {
  const initialized = await isSystemInitialized();

  return NextResponse.json({ initialized });
}

export async function POST(request: NextRequest) {
  const initialized = await isSystemInitialized();

  if (initialized) {
    return NextResponse.json(
      { error: 'System is already initialized.' },
      { status: 409 }
    );
  }

  const body = await request.json().catch(() => null);
  const result = setupSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Invalid setup data.',
        details: result.error.flatten()
      },
      { status: 400 }
    );
  }

  const { name, email, password } = result.data;

  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    return NextResponse.json(
      { error: 'Email is already in use.' },
      { status: 400 }
    );
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.$transaction(async (tx) => {
    const tenant = await tx.tenant.upsert({
      where: { slug: 'default' },
      update: {
        isDefault: true
      },
      create: {
        name: 'Default Tenant',
        slug: 'default',
        isDefault: true
      }
    });

    await tx.permission.createMany({
      data: SYSTEM_PERMISSION_KEYS.map((key) => ({
        key,
        label: key
      })),
      skipDuplicates: true
    });

    const permissions = await tx.permission.findMany({
      where: {
        key: {
          in: [...SYSTEM_PERMISSION_KEYS]
        }
      },
      select: {
        id: true
      }
    });

    const appRole = await tx.appRole.upsert({
      where: { key: 'super_admin' },
      update: {
        name: 'Super Admin',
        isSystem: true,
        permissions: {
          set: permissions.map((permission) => ({ id: permission.id }))
        }
      },
      create: {
        key: 'super_admin',
        name: 'Super Admin',
        isSystem: true,
        permissions: {
          connect: permissions.map((permission) => ({ id: permission.id }))
        }
      }
    });

    return tx.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: Role.SUPER_ADMIN,
        isSystemAdmin: true,
        tenantId: tenant.id,
        appRoleId: appRole.id
      }
    });
  });

  const { sessionToken, expires } = await createSession(user.id);
  const response = NextResponse.json({ success: true });

  response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires
  });

  return response;
}
