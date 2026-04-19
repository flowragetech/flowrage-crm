import { prisma } from '@/lib/prisma';

export async function isSystemInitialized() {
  try {
    const [userCount, systemAdminCount] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          isSystemAdmin: true
        }
      })
    ]);

    return userCount > 0 && systemAdminCount > 0;
  } catch {
    return false;
  }
}

export const SYSTEM_PERMISSION_KEYS = [
  'dashboard:access',
  'users:manage',
  'settings:manage',
  'crm:manage',
  'blog:manage',
  'cms:manage',
  'seo:manage',
  'media:manage'
] as const;
