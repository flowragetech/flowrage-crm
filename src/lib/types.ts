export const UserRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  EDITOR: 'EDITOR',
  AUTHOR: 'AUTHOR',
  VIEWER: 'VIEWER',
  CUSTOMER: 'CUSTOMER',
  SEO_SPECIALIST: 'SEO_SPECIALIST'
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
