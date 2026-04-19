'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GlobalSeo } from '@prisma/client';
import { updateGlobalSeo } from '@/app/actions/seo';
import { useRouter } from 'next/navigation';
import { MediaPicker } from '@/features/media/components/media-picker';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';

const globalSeoSchema = z.object({
  defaultMetaTitle: z.string().min(2, {
    message: 'Default meta title must be at least 2 characters.'
  }),
  defaultMetaDescription: z.string().optional(),
  ogSiteName: z.string().optional(),
  ogImage: z.string().optional(),
  twitterHandle: z.string().optional(),
  googleAnalyticsId: z.string().optional(),
  googleSearchConsoleId: z.string().optional(),
  bingWebmasterId: z.string().optional(),
  schemaMarkup: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        try {
          JSON.parse(val);
          return true;
        } catch (e) {
          return false;
        }
      },
      {
        message: 'Invalid JSON format for schema markup.'
      }
    )
});

export type GlobalSeoFormValues = z.infer<typeof globalSeoSchema>;

interface GlobalSeoFormProps {
  initialData?: GlobalSeo | null;
}

export function GlobalSeoForm({ initialData }: GlobalSeoFormProps) {
  const router = useRouter();

  const form = useForm<GlobalSeoFormValues>({
    resolver: zodResolver(globalSeoSchema),
    defaultValues: {
      defaultMetaTitle: initialData?.defaultMetaTitle || '',
      defaultMetaDescription: initialData?.defaultMetaDescription || '',
      ogSiteName: initialData?.ogSiteName || '',
      ogImage: initialData?.ogImage || '',
      twitterHandle: initialData?.twitterHandle || '',
      googleAnalyticsId: initialData?.googleAnalyticsId || '',
      googleSearchConsoleId: initialData?.googleSearchConsoleId || '',
      bingWebmasterId: initialData?.bingWebmasterId || '',
      schemaMarkup: initialData?.schemaMarkup
        ? JSON.stringify(initialData.schemaMarkup, null, 2)
        : ''
    }
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: GlobalSeoFormValues) {
    try {
      const data = {
        ...values,
        schemaMarkup: values.schemaMarkup ? JSON.parse(values.schemaMarkup) : {}
      };

      const result = await updateGlobalSeo(data);
      if (result.success) {
        toast.success('Global SEO settings updated successfully!');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to update settings');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  }

  return (
    <div className='space-y-6'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            <div className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Default Metadata</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='defaultMetaTitle'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Meta Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Your Brand - SEO and Growth Platform'
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This will be used when a page doesn't have a specific
                          title.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='defaultMetaDescription'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Meta Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='We provide high-quality SEO and content marketing services...'
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Default description for social sharing and search
                          results.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Social Media (Open Graph)</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='ogSiteName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OG Site Name</FormLabel>
                        <FormControl>
                          <Input placeholder='Your Brand' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='twitterHandle'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter Handle</FormLabel>
                        <FormControl>
                          <Input placeholder='@flowrage' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='ogImage'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Share Image</FormLabel>
                        <FormControl>
                          <div className='space-y-4'>
                            {field.value &&
                            (field.value.startsWith('/') ||
                              field.value.startsWith('http')) ? (
                              <div className='relative aspect-video w-full overflow-hidden rounded-lg border'>
                                <Image
                                  src={field.value}
                                  alt='OG Image'
                                  fill
                                  className='object-cover'
                                />
                                <Button
                                  type='button'
                                  variant='destructive'
                                  size='icon'
                                  className='absolute top-2 right-2'
                                  onClick={() => field.onChange('')}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            ) : (
                              <MediaPicker
                                onSelect={(url) => field.onChange(url)}
                              />
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>
                          Recommended size: 1200x630 pixels.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            <div className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Search Console & Analytics</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='googleAnalyticsId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Google Analytics ID (G-XXXXXXX)</FormLabel>
                        <FormControl>
                          <Input placeholder='G-XXXXXXXXXX' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='googleSearchConsoleId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Google Search Console ID</FormLabel>
                        <FormControl>
                          <Input placeholder='Verification code' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='bingWebmasterId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bing Webmaster ID</FormLabel>
                        <FormControl>
                          <Input placeholder='Verification code' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Global Schema Markup</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='schemaMarkup'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Schema (JSON-LD)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='{ "@context": "https://schema.org", "@type": "Organization", ... }'
                            className='font-mono'
                            rows={10}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Global schema markup for your business.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className='flex justify-end'>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
