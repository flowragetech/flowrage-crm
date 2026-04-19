import { NavItem } from '@/types';

export type CoreModuleKey = 'blog' | 'cms' | 'crm' | 'seo' | 'media';

export type ModuleToggles = Record<CoreModuleKey, boolean>;

export const moduleToggles: ModuleToggles = {
  blog: true,
  cms: true,
  crm: true,
  seo: true,
  media: true
};

type ModuleDefinition = {
  key: CoreModuleKey;
  title: string;
  icon: NavItem['icon'];
  rootUrl: string;
  isActive?: boolean;
  items?: NavItem[];
};

const moduleRegistry: ModuleDefinition[] = [
  {
    key: 'cms',
    title: 'CMS',
    icon: 'page',
    rootUrl: '/dashboard/cms/pages',
    isActive: true,
    items: [
      {
        title: 'Pages',
        url: '/dashboard/cms/pages',
        icon: 'page',
        access: { roles: ['ADMIN', 'EDITOR'] }
      },
      {
        title: 'Homepage',
        url: '/dashboard/cms/homepage',
        icon: 'dashboard',
        access: { roles: ['ADMIN', 'EDITOR'] }
      }
    ]
  },
  {
    key: 'blog',
    title: 'Blog',
    icon: 'post',
    rootUrl: '/dashboard/blog/posts',
    isActive: true,
    items: [
      {
        title: 'Posts',
        url: '/dashboard/blog/posts',
        icon: 'post',
        access: { roles: ['ADMIN', 'EDITOR', 'AUTHOR'] }
      },
      {
        title: 'Categories',
        url: '/dashboard/blog/categories',
        icon: 'workspace',
        access: { roles: ['ADMIN', 'EDITOR'] }
      },
      {
        title: 'Tags',
        url: '/dashboard/blog/tags',
        icon: 'check',
        access: { roles: ['ADMIN', 'EDITOR'] }
      }
    ]
  },
  {
    key: 'crm',
    title: 'CRM',
    icon: 'teams',
    rootUrl: '/dashboard/crm/deals',
    isActive: true,
    items: [
      {
        title: 'Deals',
        url: '/dashboard/crm/deals',
        icon: 'billing',
        access: { roles: ['ADMIN', 'EDITOR'] }
      },
      {
        title: 'Inquiries',
        url: '/dashboard/inquiries',
        icon: 'mail',
        access: { roles: ['ADMIN', 'EDITOR'] }
      }
    ]
  },
  {
    key: 'seo',
    title: 'SEO',
    icon: 'search',
    rootUrl: '/dashboard/franker',
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
      },
      {
        title: 'Redirects',
        url: '/dashboard/franker/redirects',
        icon: 'arrowRight',
        access: { roles: ['ADMIN', 'EDITOR'] }
      },
      {
        title: '404 Monitor',
        url: '/dashboard/franker/404-monitor',
        icon: 'warning',
        access: { roles: ['ADMIN', 'EDITOR'] }
      }
    ]
  },
  {
    key: 'media',
    title: 'Media',
    icon: 'media',
    rootUrl: '/dashboard/media',
    items: [
      {
        title: 'Library',
        url: '/dashboard/media',
        icon: 'media',
        access: { roles: ['ADMIN', 'EDITOR', 'AUTHOR'] }
      }
    ]
  }
];

export function getEnabledModules(toggles: Partial<ModuleToggles> = {}) {
  const mergedToggles = { ...moduleToggles, ...toggles };

  return moduleRegistry.filter((module) => mergedToggles[module.key]);
}

export function buildNavItems(toggles: Partial<ModuleToggles> = {}): NavItem[] {
  const moduleItems = getEnabledModules(toggles).map((module) => ({
    title: module.title,
    url: module.items?.length ? '#' : module.rootUrl,
    icon: module.icon,
    isActive: module.isActive,
    items: module.items ?? []
  }));

  return [
    {
      title: 'Dashboard',
      url: '/dashboard/overview',
      icon: 'dashboard',
      isActive: false,
      shortcut: ['d', 'd'],
      items: []
    },
    ...moduleItems,
    {
      title: 'Users',
      url: '/dashboard/users',
      icon: 'user',
      isActive: false,
      items: [],
      access: { roles: ['ADMIN'] }
    },
    {
      title: 'Settings',
      url: '#',
      icon: 'settings',
      isActive: false,
      items: [
        {
          title: 'General',
          url: '/dashboard/settings',
          icon: 'settings',
          access: { roles: ['ADMIN'] }
        },
        {
          title: 'Updates',
          url: '/dashboard/settings/updates',
          icon: 'arrowRight',
          access: { roles: ['ADMIN'] }
        }
      ],
      access: { roles: ['ADMIN'] }
    },
    {
      title: 'Account',
      url: '#',
      icon: 'account',
      isActive: true,
      items: [
        {
          title: 'Profile',
          url: '/dashboard/profile',
          icon: 'user'
        }
      ]
    }
  ];
}
