'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { updateRoleManagerConfig } from '@/app/actions/franker';

const roles = ['ADMIN', 'EDITOR', 'AUTHOR', 'VIEWER'];
const modules = [
  { id: 'schema', label: 'Schema' },
  { id: 'sitemap', label: 'Sitemap' },
  { id: 'image-seo', label: 'Image SEO' },
  { id: 'content-ai', label: 'Content AI' },
  { id: 'instant-indexing', label: 'Instant Indexing' },
  { id: 'link-counter', label: 'Link Counter' },
  { id: 'local-seo', label: 'Local SEO' },
  { id: 'analytics', label: 'Analytics' }
];

interface RoleManagerFormProps {
  initialConfig?: any;
}

export function RoleManagerForm({ initialConfig }: RoleManagerFormProps) {
  const [isMounting, setIsMounting] = useState(true);
  const [permissions, setPermissions] = useState<Record<string, string[]>>({});

  useEffect(() => {
    setIsMounting(false);
    if (initialConfig) {
      setPermissions(initialConfig);
    } else {
      // Default: Admin has all, others have none
      setPermissions({
        ADMIN: modules.map((m) => m.id),
        EDITOR: [],
        AUTHOR: [],
        VIEWER: []
      });
    }
  }, [initialConfig]);

  const handleToggle = (role: string, moduleId: string) => {
    setPermissions((prev) => {
      const rolePerms = prev[role] || [];
      const hasPerm = rolePerms.includes(moduleId);
      const newRolePerms = hasPerm
        ? rolePerms.filter((id) => id !== moduleId)
        : [...rolePerms, moduleId];

      return { ...prev, [role]: newRolePerms };
    });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit() {
    setIsSubmitting(true);
    try {
      const result = await updateRoleManagerConfig(permissions);

      if (result.success) {
        toast.success('Permissions updated successfully!');
      } else {
        toast.error(result.error || 'Failed to update permissions');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isMounting) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Module Permissions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          <div className='overflow-x-auto'>
            <table className='w-full text-left text-sm'>
              <thead className='bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400'>
                <tr>
                  <th scope='col' className='px-6 py-3'>
                    Module
                  </th>
                  {roles.map((role) => (
                    <th
                      key={role}
                      scope='col'
                      className='px-6 py-3 text-center'
                    >
                      {role}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {modules.map((module) => (
                  <tr
                    key={module.id}
                    className='border-b bg-white dark:border-gray-700 dark:bg-gray-800'
                  >
                    <th
                      scope='row'
                      className='px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white'
                    >
                      {module.label}
                    </th>
                    {roles.map((role) => (
                      <td key={role} className='px-6 py-4 text-center'>
                        <Checkbox
                          checked={(permissions[role] || []).includes(
                            module.id
                          )}
                          onCheckedChange={() => handleToggle(role, module.id)}
                          disabled={role === 'ADMIN'} // Admin always has access
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Permissions'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
