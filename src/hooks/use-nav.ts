'use client';

/**
 * Client-side hook for filtering navigation items based on RBAC
 *
 * This hook filters navigation items based on the user's roles and permissions.
 *
 * Note: For actual security (API routes, server actions), always use server-side checks.
 * This is only for UI visibility.
 */

import { useMemo } from 'react';
import type { NavItem } from '@/types';

/**
 * Hook to filter navigation items based on RBAC (fully client-side)
 *
 * @param items - Array of navigation items to filter
 * @returns Filtered items
 */
export function useFilteredNavItems(items: NavItem[]) {
  // TODO: Integrate with custom auth context if needed.
  // For now, we assume all items are visible or handle RBAC differently.

  // Memoize context and permissions
  const accessContext = useMemo(() => {
    return {
      organization: { id: 'root' }, // Placeholder
      user: { id: 'user' }, // Placeholder
      permissions: [],
      role: 'admin', // Placeholder
      hasOrg: true
    };
  }, []);

  // Filter items synchronously (all client-side)
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // No access restrictions
        if (!item.access) {
          return true;
        }

        // Check requireOrg
        if (item.access.requireOrg && !accessContext.hasOrg) {
          return false;
        }

        // Check permission (Skipping for now as permissions are empty)
        if (item.access.permission) {
          // if (!accessContext.hasOrg) {
          //   return false;
          // }
          // if (!accessContext.permissions.includes(item.access.permission)) {
          //   return false;
          // }
        }

        // Check roles (Skipping for now)
        if (item.access.roles && item.access.roles.length > 0) {
          // if (!accessContext.hasOrg) {
          //   return false;
          // }
          // if (!item.access.roles.includes(accessContext.role)) {
          //   return false;
          // }
        }

        return true;
      })
      .map((item) => {
        // Recursively filter child items
        if (item.items && item.items.length > 0) {
          const filteredChildren = item.items.filter((childItem) => {
            // No access restrictions
            if (!childItem.access) {
              return true;
            }

            // Check requireOrg
            if (childItem.access.requireOrg && !accessContext.hasOrg) {
              return false;
            }

            return true;
          });

          if (filteredChildren.length !== item.items.length) {
            return {
              ...item,
              items: filteredChildren
            };
          }
        }

        return item;
      });
  }, [items, accessContext]);

  return filteredItems;
}
