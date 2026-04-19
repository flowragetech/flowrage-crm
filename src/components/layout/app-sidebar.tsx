'use client';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail
} from '@/components/ui/sidebar';
import { navItems } from '@/config/nav-config';
import { NavItem } from '@/types';
import {
  IconBell,
  IconChevronRight,
  IconChevronsDown,
  IconCreditCard,
  IconLogout,
  IconUserCircle
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { Icons } from '../icons';

export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'EDITOR'
  | 'AUTHOR'
  | 'CUSTOMER'
  | 'VIEWER'
  | 'SEO_SPECIALIST';

export default function AppSidebar({
  role,
  items: customItems,
  siteName = 'CRM Core'
}: {
  role: string;
  items?: NavItem[];
  siteName?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const items = customItems || navItems;
  const [hasBilling] = React.useState(false);

  const filteredItems = React.useMemo(() => {
    const hasRole = role !== null;

    const canAccess = (item: NavItem) => {
      if (!hasRole) {
        return true;
      }
      if (role === 'SUPER_ADMIN') {
        return true;
      }

      const access = item.access;
      if (!access) {
        return true;
      }

      // Check roles if defined
      if (access.roles && access.roles.length > 0) {
        return access.roles.includes(role);
      }

      return true;
    };

    return items
      .map((item) => {
        // Handle items with children
        if (item.items && item.items.length > 0) {
          // Filter children based on access
          const children = item.items.filter((child) => canAccess(child));

          // If parent is a section header (url='#') and no children are accessible, hide it
          if (item.url === '#' && children.length === 0) {
            return null;
          }

          // If parent is a link (url!='#') and not accessible, but has accessible children
          if (item.url !== '#' && !canAccess(item)) {
            if (children.length === 0) {
              return null;
            }
            // If parent is not accessible but has children, we might want to keep it as a folder?
            // For now, let's assume if the parent link is forbidden, we still show the group if children exist.
          }

          return {
            ...item,
            items: children
          };
        }

        // Handle leaf items
        if (!canAccess(item)) {
          return null;
        }

        return item;
      })
      .filter((item): item is (typeof items)[number] => item !== null);
  }, [items, role]);

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <SidebarGroupLabel>{siteName}</SidebarGroupLabel>
      </SidebarHeader>
      <SidebarContent className='overflow-x-hidden'>
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarMenu>
            {filteredItems.map((item) => {
              const Icon = item.icon ? Icons[item.icon] : Icons.logo;
              return item?.items && item?.items?.length > 0 ? (
                <Collapsible
                  key={item.title}
                  id={`sidebar-item-${item.title}`}
                  asChild
                  defaultOpen={
                    item.isActive ||
                    item.items?.some((subItem) => subItem.url === pathname)
                  }
                  className='group/collapsible'
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={pathname === item.url}
                      >
                        {item.icon && <Icon />}
                        <span>{item.title}</span>
                        <IconChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === subItem.url}
                            >
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      <Icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size='lg'
                  className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                >
                  <IconUserCircle className='mr-2 h-4 w-4' />
                  <IconChevronsDown className='ml-auto size-4' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
                side='bottom'
                align='end'
                sideOffset={4}
              >
                <DropdownMenuLabel className='p-0 font-normal'>
                  <div className='px-1 py-1.5'>
                    <span className='text-sm font-medium'>Account</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => router.push('/dashboard/profile')}
                  >
                    <IconUserCircle className='mr-2 h-4 w-4' />
                    Profile
                  </DropdownMenuItem>
                  {hasBilling && (
                    <DropdownMenuItem
                      onClick={() => router.push('/dashboard/billing')}
                    >
                      <IconCreditCard className='mr-2 h-4 w-4' />
                      Billing
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <IconBell className='mr-2 h-4 w-4' />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    try {
                      await fetch('/api/auth/logout', {
                        method: 'POST'
                      });
                    } finally {
                      router.push('/auth/sign-in');
                    }
                  }}
                >
                  <IconLogout className='mr-2 h-4 w-4' />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
