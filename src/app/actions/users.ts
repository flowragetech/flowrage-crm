'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { withTimeout } from '@/lib/utils';
import { hashPassword, getCurrentUser } from '@/lib/auth';
import { Role } from '@prisma/client';

export async function getUsers() {
  try {
    const currentUser = await getCurrentUser();

    if (
      !currentUser ||
      (currentUser.role !== Role.ADMIN && currentUser.role !== Role.SUPER_ADMIN)
    ) {
      return [];
    }

    return await withTimeout(
      prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      10000
    );
  } catch {
    return [];
  }
}

export async function getUsersPage(params: {
  page?: number;
  limit?: number;
  q?: string;
  role?: Role | 'ALL';
}) {
  try {
    const currentUser = await getCurrentUser();

    if (
      !currentUser ||
      (currentUser.role !== Role.ADMIN && currentUser.role !== Role.SUPER_ADMIN)
    ) {
      return { items: [], total: 0, page: 1, limit: 10 };
    }

    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(50, Math.max(1, params.limit ?? 10));
    const skip = (page - 1) * limit;
    const q = (params.q ?? '').trim();

    const where: any = {};
    if (q) {
      where.OR = [
        { email: { contains: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } }
      ];
    }
    if (params.role && params.role !== 'ALL') {
      where.role = params.role;
    }

    const [total, items] = await Promise.all([
      withTimeout(prisma.user.count({ where }), 10000),
      withTimeout(
        prisma.user.findMany({
          where,
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isActive: true,
            createdAt: true,
            updatedAt: true
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit
        }),
        10000
      )
    ]);

    return { items, total, page, limit };
  } catch {
    return { items: [], total: 0, page: 1, limit: 10 };
  }
}

export async function getUserById(id: string) {
  try {
    const currentUser = await getCurrentUser();

    if (
      !currentUser ||
      (currentUser.role !== Role.ADMIN && currentUser.role !== Role.SUPER_ADMIN)
    ) {
      return null;
    }

    return await withTimeout(
      prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      10000
    );
  } catch {
    return null;
  }
}

export async function createUser(data: {
  email: string;
  name?: string;
  password: string;
  role?: Role;
  isActive?: boolean;
}) {
  try {
    const currentUser = await getCurrentUser();

    if (
      !currentUser ||
      (currentUser.role !== Role.ADMIN && currentUser.role !== Role.SUPER_ADMIN)
    ) {
      return { success: false, error: 'Unauthorized' };
    }

    const existingByEmail = await prisma.user.findUnique({
      where: {
        email: data.email
      }
    });

    if (existingByEmail) {
      return {
        success: false,
        error: 'Email is already in use'
      };
    }

    if (data.role === Role.SUPER_ADMIN) {
      const existingSuperAdmin = await prisma.user.findFirst({
        where: {
          role: Role.SUPER_ADMIN
        }
      });

      if (existingSuperAdmin) {
        return {
          success: false,
          error: 'A super admin already exists'
        };
      }
    }

    const passwordHash = await hashPassword(data.password);

    const user = await withTimeout(
      prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          passwordHash,
          role: data.role ?? Role.CUSTOMER,
          isActive: data.isActive ?? true
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      10000
    );

    revalidatePath('/dashboard/users');
    return { success: true, user };
  } catch {
    return { success: false, error: 'Failed to create user' };
  }
}

export async function updateUser(
  id: string,
  data: {
    email?: string;
    name?: string;
    password?: string;
    role?: Role;
    isActive?: boolean;
  }
) {
  try {
    const currentUser = await getCurrentUser();

    if (
      !currentUser ||
      (currentUser.role !== Role.ADMIN && currentUser.role !== Role.SUPER_ADMIN)
    ) {
      return { success: false, error: 'Unauthorized' };
    }

    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return { success: false, error: 'User not found' };
    }

    if (
      existingUser.role === Role.SUPER_ADMIN &&
      ((data.role && data.role !== Role.SUPER_ADMIN) || data.isActive === false)
    ) {
      return {
        success: false,
        error: 'Super admin cannot be demoted or deactivated'
      };
    }

    if (data.role === Role.SUPER_ADMIN) {
      const existingSuperAdmin = await prisma.user.findFirst({
        where: {
          role: Role.SUPER_ADMIN,
          id: {
            not: id
          }
        }
      });

      if (existingSuperAdmin) {
        return {
          success: false,
          error: 'A super admin already exists'
        };
      }
    }

    let passwordHash: string | undefined;

    if (data.password) {
      passwordHash = await hashPassword(data.password);
    }

    const user = await withTimeout(
      prisma.user.update({
        where: { id },
        data: {
          email: data.email,
          name: data.name,
          role: data.role,
          isActive: data.isActive,
          passwordHash: passwordHash
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      10000
    );

    revalidatePath('/dashboard/users');
    return { success: true, user };
  } catch {
    return { success: false, error: 'Failed to update user' };
  }
}

export async function deleteUser(id: string) {
  try {
    const currentUser = await getCurrentUser();

    if (
      !currentUser ||
      (currentUser.role !== Role.ADMIN && currentUser.role !== Role.SUPER_ADMIN)
    ) {
      return { success: false, error: 'Unauthorized' };
    }

    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (user.role === Role.SUPER_ADMIN) {
      return {
        success: false,
        error: 'Super admin user cannot be deleted'
      };
    }

    await withTimeout(
      prisma.session.deleteMany({
        where: { userId: id }
      }),
      10000
    );

    await withTimeout(
      prisma.user.delete({
        where: { id }
      }),
      10000
    );

    revalidatePath('/dashboard/users');
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to delete user' };
  }
}
