'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { updateSiteSettings, sendSmtpTest } from '@/app/actions/settings';
import { useRouter } from 'next/navigation';
import { MediaPicker } from '@/features/media/components/media-picker';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';

const siteSettingsSchema = z.object({
  siteName: z.string().min(2, {
    message: 'Site name must be at least 2 characters.'
  }),
  siteDescription: z.string().optional(),
  logo: z.string().optional(),
  favicon: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal('')),
  contactPhone: z.string().optional(),
  contactAddress: z.string().optional(),
  contactWhatsapp: z.string().optional(),
  facebook: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
  instagram: z.string().url().optional().or(z.literal('')),
  youtube: z.string().url().optional().or(z.literal('')),
  currencyCode: z.string().optional(),
  currencySymbol: z.string().optional(),
  smtpHost: z.string().optional(),
  smtpPort: z.string().optional(),
  smtpUser: z.string().optional(),
  smtpPassword: z.string().optional(),
  smtpFromName: z.string().optional(),
  smtpFromEmail: z.string().email().optional().or(z.literal(''))
});

export type SiteSettingsFormValues = z.infer<typeof siteSettingsSchema>;

interface SiteSettingsFormProps {
  initialData?: Record<string, any> | null;
}

export function SiteSettingsForm({ initialData }: SiteSettingsFormProps) {
  const router = useRouter();
  const [testEmail, setTestEmail] = useState('');
  const [sendingTest, setSendingTest] = useState(false);

  const parseJson = (data: any) => {
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch (e) {
        return {};
      }
    }
    return data || {};
  };

  const contactInfo = parseJson(initialData?.contactInfo);
  const socialLinks = parseJson(initialData?.socialLinks);
  const smtpSettings = parseJson((initialData as any)?.smtpSettings);

  const form = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      siteName: initialData?.siteName || 'CRM Core',
      siteDescription: (initialData as any)?.siteDescription || '',
      logo: initialData?.logo || '',
      favicon: initialData?.favicon || '',
      primaryColor: (initialData as any)?.primaryColor || '#111827',
      secondaryColor: (initialData as any)?.secondaryColor || '#f59e0b',
      contactEmail: contactInfo?.email || '',
      contactPhone: contactInfo?.phone || '',
      contactAddress: contactInfo?.address || '',
      contactWhatsapp: contactInfo?.whatsapp || '',
      facebook: socialLinks?.facebook || '',
      twitter: socialLinks?.twitter || '',
      linkedin: socialLinks?.linkedin || '',
      instagram: socialLinks?.instagram || '',
      youtube: socialLinks?.youtube || '',
      currencyCode: (initialData as any)?.currencyCode || 'INR',
      currencySymbol: (initialData as any)?.currencySymbol || 'Rs',
      smtpHost: smtpSettings?.host || '',
      smtpPort: smtpSettings?.port ? String(smtpSettings.port) : '',
      smtpUser: smtpSettings?.user || '',
      smtpPassword: '',
      smtpFromName: smtpSettings?.fromName || '',
      smtpFromEmail: smtpSettings?.fromEmail || ''
    }
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: SiteSettingsFormValues) {
    try {
      const result = await updateSiteSettings(values);
      if (result.success) {
        toast.success('Site settings updated successfully!');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to update settings');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  }

  async function onSendTest() {
    if (!testEmail || !/\S+@\S+\.\S+/.test(testEmail)) {
      toast.error('Enter a valid test email address');
      return;
    }
    try {
      setSendingTest(true);
      const res = await sendSmtpTest(testEmail);
      if (res.success) {
        toast.success('Test email sent');
      } else {
        toast.error(res.error || 'Failed to send test email');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSendingTest(false);
    }
  }

  return (
    <div className='space-y-6'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <div className='mt-4 space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Brand & Identity</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <FormField
                  control={form.control}
                  name='siteName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Name</FormLabel>
                      <FormControl>
                        <Input placeholder='CRM Core' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='grid gap-4 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='primaryColor'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Color</FormLabel>
                        <FormControl>
                          <Input placeholder='#111827' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='secondaryColor'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secondary Color</FormLabel>
                        <FormControl>
                          <Input placeholder='#f59e0b' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name='logo'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo</FormLabel>
                      <FormControl>
                        <div className='flex flex-col gap-4'>
                          {field.value &&
                            (field.value.startsWith('/') ||
                              field.value.startsWith('http')) && (
                              <div className='bg-muted relative aspect-video w-full max-w-[200px] overflow-hidden rounded-lg border'>
                                <Image
                                  src={field.value}
                                  alt='Logo'
                                  fill
                                  className='object-contain'
                                />
                                <Button
                                  type='button'
                                  variant='destructive'
                                  size='icon'
                                  className='absolute top-2 right-2 h-6 w-6'
                                  onClick={() => field.onChange('')}
                                >
                                  <Trash2 className='h-3 w-3' />
                                </Button>
                              </div>
                            )}
                          <MediaPicker
                            onSelect={(url) => field.onChange(url)}
                            title='Select Logo'
                            category='logo'
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='favicon'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Favicon</FormLabel>
                      <FormControl>
                        <div className='flex flex-col gap-4'>
                          {field.value &&
                            (field.value.startsWith('/') ||
                              field.value.startsWith('http')) && (
                              <div className='bg-muted relative h-16 w-16 overflow-hidden rounded-lg border'>
                                <Image
                                  src={field.value}
                                  alt='Favicon'
                                  fill
                                  className='object-contain'
                                />
                                <Button
                                  type='button'
                                  variant='destructive'
                                  size='icon'
                                  className='absolute top-1 right-1 h-5 w-5'
                                  onClick={() => field.onChange('')}
                                >
                                  <Trash2 className='h-3 w-3' />
                                </Button>
                              </div>
                            )}
                          <MediaPicker
                            onSelect={(url) => field.onChange(url)}
                            title='Select Favicon'
                            category='favicon'
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='siteDescription'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Description</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Short description for search engines and cards'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <FormField
                  control={form.control}
                  name='contactEmail'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder='contact@flowrage.com' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='contactPhone'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder='+1 (555) 000-0000' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='contactAddress'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='123 Main St, City, Country'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='contactWhatsapp'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp</FormLabel>
                      <FormControl>
                        <Input placeholder='+977 9800000000' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
              </CardHeader>
              <CardContent className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='facebook'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='https://facebook.com/...'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='twitter'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='https://twitter.com/...'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='linkedin'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='https://linkedin.com/in/...'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='instagram'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='https://instagram.com/...'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='youtube'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>YouTube</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='https://youtube.com/...'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Currency Settings</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <FormField
                  control={form.control}
                  name='currencyCode'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Currency Code</FormLabel>
                      <FormControl>
                        <Input placeholder='USD' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='currencySymbol'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Currency Symbol</FormLabel>
                      <FormControl>
                        <Input placeholder='$' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SMTP Settings</CardTitle>
              </CardHeader>
              <CardContent className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='smtpHost'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMTP Host</FormLabel>
                      <FormControl>
                        <Input placeholder='smtp.yourprovider.com' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='smtpPort'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMTP Port</FormLabel>
                      <FormControl>
                        <Input placeholder='587' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='smtpUser'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder='SMTP username' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='smtpPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder='Leave blank to keep existing'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='smtpFromName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From Name</FormLabel>
                      <FormControl>
                        <Input placeholder='CRM Core' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='smtpFromEmail'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From Email</FormLabel>
                      <FormControl>
                        <Input placeholder='no-reply@example.com' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='grid grid-cols-1 items-end gap-3 sm:grid-cols-[1fr_auto] md:col-span-2'>
                  <div>
                    <label className='text-sm font-medium'>
                      Send Test Email
                    </label>
                    <Input
                      placeholder='you@example.com'
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                    />
                  </div>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={onSendTest}
                    disabled={sendingTest}
                  >
                    {sendingTest ? 'Sending...' : 'Send Test'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Advanced</CardTitle>
              </CardHeader>
              <CardContent className='text-muted-foreground text-sm'>
                No advanced settings yet.
              </CardContent>
            </Card>
          </div>
          <div className='flex justify-end'>
            <Button
              type='submit'
              disabled={isSubmitting}
              className='w-full sm:w-auto'
            >
              {isSubmitting ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
