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

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export default function FooterLayoutPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [columns, setColumns] = useState<FooterColumn[]>([]);
  const [bottomLinks, setBottomLinks] = useState<FooterLink[]>([]);
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    address: ''
  });
  const [copyrightText, setCopyrightText] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/v1/settings');
      if (res.ok) {
        const data = await res.json();

        let footerData = data.footerData;
        let contactData = data.contactInfo;

        if (typeof footerData === 'string') {
          try {
            footerData = JSON.parse(footerData);
          } catch (e) {
            footerData = {};
          }
        }

        if (typeof contactData === 'string') {
          try {
            contactData = JSON.parse(contactData);
          } catch (e) {
            contactData = {};
          }
        }

        if (contactData) {
          setContactInfo({
            email: contactData.email || '',
            phone: contactData.phone || '',
            address: contactData.address || ''
          });
        }

        if (footerData) {
          if (footerData.columns) setColumns(footerData.columns);

          if (footerData.bottomLinks && footerData.bottomLinks.length > 0) {
            setBottomLinks(footerData.bottomLinks);
          } else {
            setBottomLinks([
              { label: 'About Us', href: '/about' },
              { label: 'Contact Us', href: '/contact' },
              { label: 'Privacy Policy', href: '/privacy-policy' },
              { label: 'Terms of Service', href: '/terms-of-service' },
              { label: 'Return & Refund Policy', href: '/refund-policy' }
            ]);
          }

          if (footerData.copyrightText)
            setCopyrightText(footerData.copyrightText);
          if (footerData.description) setDescription(footerData.description);
        } else {
          // Default initial state
          setColumns([
            {
              title: 'Services',
              links: [
                { label: 'Web Development', href: '/services/web-development' },
                { label: 'SEO', href: '/services/seo' }
              ]
            },
            {
              title: 'Company',
              links: [
                { label: 'About Us', href: '/about' },
                { label: 'Contact', href: '/contact' }
              ]
            }
          ]);
          setBottomLinks([
            { label: 'About Us', href: '/about' },
            { label: 'Contact Us', href: '/contact' },
            { label: 'Privacy Policy', href: '/privacy-policy' },
            { label: 'Terms of Service', href: '/terms-of-service' },
            { label: 'Return & Refund Policy', href: '/refund-policy' }
          ]);
          setCopyrightText('© 2026 Your Brand. All rights reserved.');
          setDescription(
            'Describe your business, differentiators, and the value you deliver to customers.'
          );
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
          contactInfo,
          footerData: {
            columns,
            bottomLinks,
            copyrightText,
            description
          }
        })
      });

      if (res.ok) {
        toast.success('Footer layout saved');
      } else {
        toast.error('Failed to save footer layout');
      }
    } catch (error) {
      toast.error('An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  const addColumn = () => {
    setColumns([...columns, { title: 'New Column', links: [] }]);
  };

  const removeColumn = (index: number) => {
    const newColumns = [...columns];
    newColumns.splice(index, 1);
    setColumns(newColumns);
  };

  const updateColumnTitle = (index: number, title: string) => {
    const newColumns = [...columns];
    newColumns[index].title = title;
    setColumns(newColumns);
  };

  const addLink = (colIndex: number) => {
    const newColumns = [...columns];
    newColumns[colIndex].links.push({ label: 'New Link', href: '#' });
    setColumns(newColumns);
  };

  const removeLink = (colIndex: number, linkIndex: number) => {
    const newColumns = [...columns];
    newColumns[colIndex].links.splice(linkIndex, 1);
    setColumns(newColumns);
  };

  const updateLink = (
    colIndex: number,
    linkIndex: number,
    field: keyof FooterLink,
    value: string
  ) => {
    const newColumns = [...columns];
    const column = { ...newColumns[colIndex] };
    const links = [...column.links];
    links[linkIndex] = { ...links[linkIndex], [field]: value };
    column.links = links;
    newColumns[colIndex] = column;
    setColumns(newColumns);
  };

  const addBottomLink = () => {
    setBottomLinks([...bottomLinks, { label: 'New Link', href: '#' }]);
  };

  const removeBottomLink = (index: number) => {
    const newLinks = [...bottomLinks];
    newLinks.splice(index, 1);
    setBottomLinks(newLinks);
  };

  const updateBottomLink = (
    index: number,
    field: keyof FooterLink,
    value: string
  ) => {
    const newLinks = [...bottomLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setBottomLinks(newLinks);
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
            title='Footer Layout'
            description='Manage your website footer columns and copyright.'
          />
          <Button onClick={handleSave} disabled={saving}>
            <Save className='mr-2 h-4 w-4' />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
        <Separator />

        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Footer Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid gap-2'>
                <Label>Description</Label>
                <textarea
                  className='border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder='Enter footer description text...'
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid gap-4'>
                <div className='grid gap-2'>
                  <Label>Email</Label>
                  <Input
                    value={contactInfo.email}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, email: e.target.value })
                    }
                    placeholder='info@example.com'
                  />
                </div>
                <div className='grid gap-2'>
                  <Label>Phone</Label>
                  <Input
                    value={contactInfo.phone}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, phone: e.target.value })
                    }
                    placeholder='+1 234 567 890'
                  />
                </div>
                <div className='grid gap-2'>
                  <Label>Address</Label>
                  <Input
                    value={contactInfo.address}
                    onChange={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        address: e.target.value
                      })
                    }
                    placeholder='123 Street, City, Country'
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Copyright Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid gap-2'>
                <Label>Copyright Text</Label>
                <Input
                  value={copyrightText}
                  onChange={(e) => setCopyrightText(e.target.value)}
                  placeholder='© 2026 Your Brand. All rights reserved.'
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Footer Columns</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              {columns.map((column, colIndex) => (
                <div key={colIndex} className='space-y-4 rounded-md border p-4'>
                  <div className='flex items-center gap-4'>
                    <div className='grid flex-1 gap-2'>
                      <Label>Column Title</Label>
                      <Input
                        value={column.title}
                        onChange={(e) =>
                          updateColumnTitle(colIndex, e.target.value)
                        }
                        placeholder='Column Title'
                      />
                    </div>
                    <div className='flex h-[60px] items-end gap-2 pb-1'>
                      <Button
                        variant='outline'
                        size='icon'
                        onClick={() => addLink(colIndex)}
                        title='Add Link'
                      >
                        <Plus className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='destructive'
                        size='icon'
                        onClick={() => removeColumn(colIndex)}
                      >
                        <Trash className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>

                  {/* Links */}
                  {column.links.length > 0 && (
                    <div className='border-muted ml-2 space-y-3 border-l-2 pl-4'>
                      {column.links.map((link, linkIndex) => (
                        <div
                          key={linkIndex}
                          className='flex items-center gap-4'
                        >
                          <div className='grid flex-1 gap-1'>
                            <Input
                              value={link.label || ''}
                              onChange={(e) =>
                                updateLink(
                                  colIndex,
                                  linkIndex,
                                  'label',
                                  e.target.value
                                )
                              }
                              placeholder='Link Label'
                              className='h-8 text-sm'
                            />
                          </div>
                          <div className='grid flex-1 gap-1'>
                            <Input
                              value={link.href || ''}
                              onChange={(e) =>
                                updateLink(
                                  colIndex,
                                  linkIndex,
                                  'href',
                                  e.target.value
                                )
                              }
                              placeholder='Link URL'
                              className='h-8 text-sm'
                            />
                          </div>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='text-destructive h-8 w-8'
                            onClick={() => removeLink(colIndex, linkIndex)}
                          >
                            <Trash className='h-3 w-3' />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  {column.links.length === 0 && (
                    <div className='text-muted-foreground text-sm italic'>
                      No links in this column.
                    </div>
                  )}
                </div>
              ))}

              <Button variant='outline' onClick={addColumn} className='w-full'>
                <Plus className='mr-2 h-4 w-4' /> Add Column
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bottom Bar Links</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {bottomLinks.map((link, index) => (
                <div key={index} className='flex items-center gap-4'>
                  <div className='grid flex-1 gap-1'>
                    <Input
                      value={link.label || ''}
                      onChange={(e) =>
                        updateBottomLink(index, 'label', e.target.value)
                      }
                      placeholder='Link Label'
                    />
                  </div>
                  <div className='grid flex-1 gap-1'>
                    <Input
                      value={link.href || ''}
                      onChange={(e) =>
                        updateBottomLink(index, 'href', e.target.value)
                      }
                      placeholder='Link URL'
                    />
                  </div>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='text-destructive h-8 w-8'
                    onClick={() => removeBottomLink(index)}
                  >
                    <Trash className='h-4 w-4' />
                  </Button>
                </div>
              ))}
              <Button
                variant='outline'
                onClick={addBottomLink}
                className='w-full'
              >
                <Plus className='mr-2 h-4 w-4' /> Add Bottom Link
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
