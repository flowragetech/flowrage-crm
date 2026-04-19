'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
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
import { updateHomepage } from '@/app/actions/cms';
import { useRouter } from 'next/navigation';
import { MediaPicker } from '@/features/media/components/media-picker';
import { FrankerSeoPanel } from '@/features/franker/components/franker-seo-panel';
import Image from 'next/image';
import { IconPhoto } from '@tabler/icons-react';

import { IconPicker } from './icon-picker';

const homepageSchema = z.object({
  heroTitle: z.string().min(2, {
    message: 'Hero title must be at least 2 characters.'
  }),
  heroSubtitle: z.string().min(2, {
    message: 'Hero subtitle must be at least 2 characters.'
  }),
  heroImage: z.string().optional(),
  features: z
    .array(
      z.object({
        title: z.string().min(1, { message: 'Title is required' }),
        description: z.string(),
        icon: z.string().optional()
      })
    )
    .optional(),
  testimonials: z
    .array(
      z.object({
        name: z.string().min(1, { message: 'Name is required' }),
        role: z.string().optional(),
        content: z.string(),
        avatar: z.string().optional()
      })
    )
    .optional(),
  stats: z
    .array(
      z.object({
        label: z.string().min(1, { message: 'Label is required' }),
        value: z.string().min(1, { message: 'Value is required' }),
        icon: z.string().optional()
      })
    )
    .optional(),
  faq: z
    .array(
      z.object({
        question: z.string().min(1, { message: 'Question is required' }),
        answer: z.string()
      })
    )
    .optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
  ogImage: z.string().optional(),
  canonical: z.string().url().optional().or(z.literal('')),
  schemaMarkup: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || !val.trim()) return true;
        const trimmed = val
          .trim()
          .replace(/^<script[^>]*type=["']application\/ld\+json["'][^>]*>/i, '')
          .replace(/<\/script>\s*$/i, '');
        if (trimmed.length > 500_000) return false;
        try {
          JSON.parse(trimmed);
          return true;
        } catch {
          return false;
        }
      },
      {
        message:
          'Invalid JSON-LD. Please paste valid JSON (without script tags).'
      }
    )
});

interface HomepageSeoData {
  metaTitle?: string | null;
  metaDescription?: string | null;
  keywords?: string | null;
  ogImage?: string | null;
  canonical?: string | null;
  schemaMarkup?: any;
}

interface HomepageData {
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  heroImage?: string | null;
  features?: any;
  testimonials?: any;
  stats?: any;
  faq?: any;
  seoMetadata?: HomepageSeoData | null;
}

interface HomepageFormProps {
  initialData?: HomepageData | null;
}

export function HomepageForm({ initialData }: HomepageFormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof homepageSchema>>({
    resolver: zodResolver(homepageSchema),
    defaultValues: {
      heroTitle: initialData?.heroTitle || '',
      heroSubtitle: initialData?.heroSubtitle || '',
      heroImage: initialData?.heroImage || '',
      features: (initialData?.features as any[]) || [
        { title: '', description: '', icon: '' }
      ],
      testimonials: (initialData?.testimonials as any[]) || [
        { name: '', role: '', content: '', avatar: '' }
      ],
      stats: (initialData?.stats as any[]) || [
        { label: '', value: '', icon: '' }
      ],
      faq: (initialData?.faq as any[]) || [{ question: '', answer: '' }],
      metaTitle: initialData?.seoMetadata?.metaTitle || '',
      metaDescription: initialData?.seoMetadata?.metaDescription || '',
      keywords: initialData?.seoMetadata?.keywords || '',
      ogImage: initialData?.seoMetadata?.ogImage || '',
      canonical: initialData?.seoMetadata?.canonical || '',
      schemaMarkup: initialData?.seoMetadata?.schemaMarkup
        ? JSON.stringify(initialData.seoMetadata.schemaMarkup, null, 2)
        : ''
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'features'
  });

  const {
    fields: testimonialFields,
    append: appendTestimonial,
    remove: removeTestimonial
  } = useFieldArray({
    control: form.control,
    name: 'testimonials'
  });

  const {
    fields: statFields,
    append: appendStat,
    remove: removeStat
  } = useFieldArray({
    control: form.control,
    name: 'stats'
  });

  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq
  } = useFieldArray({
    control: form.control,
    name: 'faq'
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof homepageSchema>) {
    try {
      const result = await updateHomepage(values);
      if (result.success) {
        toast.success('Homepage content updated successfully!');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to update homepage');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  }

  return (
    <div className='space-y-6'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <FormField
                  control={form.control}
                  name='heroTitle'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hero Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Welcome to your digital platform'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This is the main title displayed on the homepage.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='heroSubtitle'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hero Subtitle</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Your growth partner in Nepal...'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A brief description or tagline for the hero section.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='heroImage'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hero Image</FormLabel>
                      <FormControl>
                        <div className='flex flex-col gap-4'>
                          {field.value &&
                            (field.value.startsWith('/') ||
                              field.value.startsWith('http')) && (
                              <div className='relative aspect-video w-full max-w-md overflow-hidden rounded-none border'>
                                <Image
                                  src={field.value}
                                  alt='Hero'
                                  fill
                                  className='object-cover'
                                />
                                <Button
                                  type='button'
                                  variant='destructive'
                                  size='icon'
                                  className='absolute top-2 right-2 h-8 w-8'
                                  onClick={() => field.onChange('')}
                                >
                                  <Trash2 className='h-4 w-4' />
                                </Button>
                              </div>
                            )}
                          <MediaPicker
                            onSelect={(url) => field.onChange(url)}
                            title='Select Hero Image'
                            trigger={
                              <Button
                                variant='outline'
                                type='button'
                                className='w-fit gap-2'
                              >
                                <IconPhoto size={18} />
                                {field.value ? 'Change Image' : 'Select Image'}
                              </Button>
                            }
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        The main background image for the hero section.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between'>
                <CardTitle>Features Section</CardTitle>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() =>
                    append({ title: '', description: '', icon: '' })
                  }
                >
                  <Plus className='mr-2 h-4 w-4' />
                  Add Feature
                </Button>
              </CardHeader>
              <CardContent className='space-y-6'>
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className='relative space-y-4 rounded-lg border p-4'
                  >
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='text-destructive absolute top-2 right-2'
                      onClick={() => remove(index)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                      <FormField
                        control={form.control}
                        name={`features.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder='SEO Audits' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`features.${index}.icon`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Icon (Lucide name)</FormLabel>
                            <FormControl>
                              <IconPicker
                                value={field.value || ''}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name={`features.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder='Comprehensive SEO audits for your website...'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between'>
                <CardTitle>Stats Section</CardTitle>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => appendStat({ label: '', value: '', icon: '' })}
                >
                  <Plus className='mr-2 h-4 w-4' />
                  Add Stat
                </Button>
              </CardHeader>
              <CardContent className='space-y-6'>
                {statFields.map((field, index) => (
                  <div
                    key={field.id}
                    className='relative space-y-4 rounded-lg border p-4'
                  >
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='text-destructive absolute top-2 right-2'
                      onClick={() => removeStat(index)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                    <div className='grid grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name={`stats.${index}.label`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Label</FormLabel>
                            <FormControl>
                              <Input placeholder='Clients' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`stats.${index}.value`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Value</FormLabel>
                            <FormControl>
                              <Input placeholder='100+' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name={`stats.${index}.icon`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Icon</FormLabel>
                          <FormControl>
                            <IconPicker
                              value={field.value || ''}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between'>
                <CardTitle>FAQ Section</CardTitle>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => appendFaq({ question: '', answer: '' })}
                >
                  <Plus className='mr-2 h-4 w-4' />
                  Add FAQ
                </Button>
              </CardHeader>
              <CardContent className='space-y-6'>
                {faqFields.map((field, index) => (
                  <div
                    key={field.id}
                    className='relative space-y-4 rounded-lg border p-4'
                  >
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='text-destructive absolute top-2 right-2'
                      onClick={() => removeFaq(index)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                    <FormField
                      control={form.control}
                      name={`faq.${index}.question`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Question</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='What services do you offer?'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`faq.${index}.answer`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Answer</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder='We offer a range of SEO and content services...'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between'>
              <CardTitle>Testimonials Section</CardTitle>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() =>
                  appendTestimonial({
                    name: '',
                    role: '',
                    content: '',
                    avatar: ''
                  })
                }
              >
                <Plus className='mr-2 h-4 w-4' />
                Add Testimonial
              </Button>
            </CardHeader>
            <CardContent className='space-y-6'>
              {testimonialFields.map((field, index) => (
                <div
                  key={field.id}
                  className='relative space-y-4 rounded-lg border p-4'
                >
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='text-destructive absolute top-2 right-2'
                    onClick={() => removeTestimonial(index)}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name={`testimonials.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Name</FormLabel>
                          <FormControl>
                            <Input placeholder='John Doe' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`testimonials.${index}.role`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role/Company</FormLabel>
                          <FormControl>
                            <Input placeholder='CEO at Example' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name={`testimonials.${index}.content`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Testimonial Content</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='They did an amazing job with our SEO...'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`testimonials.${index}.avatar`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Avatar (Optional)</FormLabel>
                        <FormControl>
                          <div className='flex items-center gap-4'>
                            {field.value &&
                              (field.value.startsWith('/') ||
                                field.value.startsWith('http')) && (
                                <div className='relative h-12 w-12 overflow-hidden rounded-none border'>
                                  <Image
                                    src={field.value}
                                    alt='Avatar'
                                    fill
                                    className='object-cover'
                                  />
                                </div>
                              )}
                            <MediaPicker
                              onSelect={(url) => field.onChange(url)}
                              title='Select Avatar'
                              trigger={
                                <Button
                                  variant='outline'
                                  type='button'
                                  size='sm'
                                  className='gap-2'
                                >
                                  <IconPhoto size={16} />
                                  {field.value ? 'Change' : 'Select'}
                                </Button>
                              }
                            />
                            {field.value && (
                              <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                onClick={() => field.onChange('')}
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <FrankerSeoPanel control={form.control} namePrefix='' />

          <div className='flex justify-end'>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Homepage Content'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
