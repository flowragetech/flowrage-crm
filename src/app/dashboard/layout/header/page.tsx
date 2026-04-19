'use client';

import { useState, useEffect } from 'react';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash, Plus, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageContainer from '@/components/layout/page-container';
import { Label } from '@/components/ui/label';

interface MenuItem {
  label: string;
  href: string;
  children?: MenuItem[];
}

export default function HeaderLayoutPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/v1/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.headerData?.menu) {
          setMenuItems(data.headerData.menu);
        } else {
          // Default initial state
          setMenuItems([
            { label: 'Home', href: '/' },
            { label: 'Services', href: '/services' },
            { label: 'Portfolio', href: '/portfolio' },
            { label: 'Team', href: '/team' },
            { label: 'Blog', href: '/blog' }
          ]);
        }
      }
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/v1/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headerData: { menu: menuItems }
        })
      });

      if (res.ok) {
        toast.success('Header layout saved');
      } else {
        toast.error('Failed to save header layout');
      }
    } catch (error) {
      toast.error('An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  const addMenuItem = () => {
    setMenuItems([...menuItems, { label: 'New Item', href: '#' }]);
  };

  const removeMenuItem = (index: number) => {
    const newItems = [...menuItems];
    newItems.splice(index, 1);
    setMenuItems(newItems);
  };

  const updateMenuItem = (
    index: number,
    field: keyof MenuItem,
    value: string
  ) => {
    const newItems = [...menuItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setMenuItems(newItems);
  };

  // Simple nested item handler (supports 1 level of nesting for now for simplicity in UI)
  const addSubItem = (parentIndex: number) => {
    const newItems = [...menuItems];
    const parent = { ...newItems[parentIndex] };
    const children = parent.children ? [...parent.children] : [];

    children.push({ label: 'Sub Item', href: '#' });
    parent.children = children;
    newItems[parentIndex] = parent;

    setMenuItems(newItems);
  };

  const removeSubItem = (parentIndex: number, subIndex: number) => {
    const newItems = [...menuItems];
    const parent = { ...newItems[parentIndex] };

    if (parent.children) {
      const children = [...parent.children];
      children.splice(subIndex, 1);
      parent.children = children;
      newItems[parentIndex] = parent;
      setMenuItems(newItems);
    }
  };

  const updateSubItem = (
    parentIndex: number,
    subIndex: number,
    field: keyof MenuItem,
    value: string
  ) => {
    const newItems = [...menuItems];
    const parent = { ...newItems[parentIndex] };

    if (parent.children) {
      const children = [...parent.children];
      children[subIndex] = { ...children[subIndex], [field]: value };
      parent.children = children;
      newItems[parentIndex] = parent;
      setMenuItems(newItems);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className='p-8'>Loading...</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer scrollable>
      <div className='space-y-4 p-4 pt-6 md:p-8'>
        <div className='flex items-center justify-between'>
          <Heading
            title='Header Layout'
            description='Manage your website header navigation menu.'
          />
          <Button onClick={handleSave} disabled={saving}>
            <Save className='mr-2 h-4 w-4' />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Navigation Menu</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {menuItems.map((item, index) => (
              <div key={index} className='space-y-4 rounded-md border p-4'>
                <div className='flex items-center gap-4'>
                  <div className='grid flex-1 gap-2'>
                    <Label>Label</Label>
                    <Input
                      value={item.label || ''}
                      onChange={(e) =>
                        updateMenuItem(index, 'label', e.target.value)
                      }
                      placeholder='Menu Label'
                    />
                  </div>
                  <div className='grid flex-1 gap-2'>
                    <Label>URL</Label>
                    <Input
                      value={item.href || ''}
                      onChange={(e) =>
                        updateMenuItem(index, 'href', e.target.value)
                      }
                      placeholder='/path'
                    />
                  </div>
                  <div className='flex h-[60px] items-end gap-2 pb-1'>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => addSubItem(index)}
                      title='Add Sub-item'
                    >
                      <Plus className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='destructive'
                      size='icon'
                      onClick={() => removeMenuItem(index)}
                    >
                      <Trash className='h-4 w-4' />
                    </Button>
                  </div>
                </div>

                {/* Sub Items */}
                {item.children && item.children.length > 0 && (
                  <div className='border-muted ml-4 space-y-3 border-l-2 pl-8'>
                    {item.children.map((subItem, subIndex) => (
                      <div key={subIndex} className='flex items-center gap-4'>
                        <div className='grid flex-1 gap-1'>
                          <Input
                            value={subItem.label}
                            onChange={(e) =>
                              updateSubItem(
                                index,
                                subIndex,
                                'label',
                                e.target.value
                              )
                            }
                            placeholder='Sub Item Label'
                            className='h-8 text-sm'
                          />
                        </div>
                        <div className='grid flex-1 gap-1'>
                          <Input
                            value={subItem.href}
                            onChange={(e) =>
                              updateSubItem(
                                index,
                                subIndex,
                                'href',
                                e.target.value
                              )
                            }
                            placeholder='Sub Item URL'
                            className='h-8 text-sm'
                          />
                        </div>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='text-destructive h-8 w-8'
                          onClick={() => removeSubItem(index, subIndex)}
                        >
                          <Trash className='h-3 w-3' />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Button variant='outline' onClick={addMenuItem} className='w-full'>
              <Plus className='mr-2 h-4 w-4' /> Add Menu Item
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
