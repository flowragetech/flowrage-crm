import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';

export const SESSION_COOKIE_NAME = 'fr_admin_session';

const SESSION_TTL_DAYS = 7;

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string) {
  const sessionToken = randomUUID();

  const expires = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: {
      sessionToken,
      userId,
      expires
    }
  });

  return { sessionToken, expires };
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: {
      sessionToken: token
    },
    include: {
      user: true
    }
  });

  if (!session) {
    return null;
  }

  if (session.expires < new Date()) {
    await prisma.session.delete({
      where: {
        id: session.id
      }
    });
    return null;
  }

  if (!session.user.isActive) {
    return null;
  }

  const { id, email, name, role } = session.user;

  return {
    id,
    email,
    name,
    role
  };
}
