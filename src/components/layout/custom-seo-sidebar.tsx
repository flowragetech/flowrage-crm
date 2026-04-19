'use client';

import AppSidebar from '@/components/layout/app-sidebar';
import { NavItem } from '@/types';

// Custom SEO specific navigation items
// This can be used when we want a focused SEO workspace
const seoNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    items: []
  },
  {
    title: 'Franker SEO',
    url: '#',
    icon: 'settings',
    isActive: true,
    items: [
      {
        title: 'Dashboard',
        url: '/dashboard/franker',
        icon: 'dashboard',
        access: { roles: ['ADMIN', 'EDITOR'] }
      },
      {
        title: 'Content Audit',
        url: '/dashboard/franker/content-seo',
        icon: 'page',
        access: { roles: ['ADMIN', 'EDITOR'] }
      },
      {
        title: 'Global Settings',
        url: '/dashboard/franker/global',
        icon: 'settings',
        access: { roles: ['ADMIN', 'EDITOR'] }
      }
    ]
  },
  {
    title: 'Custom SEO Tools',
    url: '#',
    icon: 'search',
    isActive: true,
    items: [
      {
        title: 'Keyword Research',
        url: '/dashboard/seo/keywords',
        icon: 'search',
        access: { roles: ['ADMIN', 'SEO_SPECIALIST'] }
      },
      {
        title: 'Competitor Analysis',
        url: '/dashboard/seo/competitors',
        icon: 'users',
        access: { roles: ['ADMIN', 'SEO_SPECIALIST'] }
      },
      {
        title: 'SERP Preview',
        url: '/dashboard/seo/serp-preview',
        icon: 'laptop',
        access: { roles: ['ADMIN', 'EDITOR', 'SEO_SPECIALIST'] }
      }
    ]
  }
];

export function CustomSeoSidebar({ role }: { role: string }) {
  return <AppSidebar role={role} items={seoNavItems} />;
}
