'use client';

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
import { Textarea } from '@/components/ui/textarea';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { PortfolioWithSeo } from './portfolio-table/columns';
import { createPortfolio, updatePortfolio } from '@/app/actions/portfolio';
import { MediaPicker } from '@/features/media/components/media-picker';
import Image from 'next/image';
import { IconPhoto, IconLoader2 } from '@tabler/icons-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FrankerSeoPanel } from '@/features/franker/components/franker-seo-panel';

const portfolioSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.'
  }),
  slug: z.string().min(2, {
    message: 'Slug must be at least 2 characters.'
  }),
  client: z.string().optional(),
  description: z.string(),
  image: z.string().optional(),
  content: z.string().optional(),
  seoMetadata: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.string().optional(),
    ogImage: z.string().optional(),
    canonical: z.string().url().optional().or(z.literal('')),
    schemaMarkup: z.string().optional()
  })
});

type PortfolioFormValues = z.infer<typeof portfolioSchema>;

interface PortfolioFormProps {
  initialData?: PortfolioWithSeo | null;
  onSuccess?: () => void;
}

const RichTextEditor = dynamic(
  () =>
    import('@/components/ui/rich-text-editor').then(
      (mod) => mod.RichTextEditor as any
    ),
  {
    ssr: false,
    loading: () => (
      <div className='text-muted-foreground flex h-[300px] items-center justify-center rounded-md border text-sm'>
        Loading editor...
      </div>
    )
  }
) as any;

export function PortfolioForm({ initialData, onSuccess }: PortfolioFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      client: initialData?.client || '',
      description: initialData?.description || '',
      image: initialData?.image || '',
      content: initialData?.content || '',
      seoMetadata: {
        metaTitle: initialData?.seoMetadata?.metaTitle || '',
        metaDescription: initialData?.seoMetadata?.metaDescription || '',
        keywords: initialData?.seoMetadata?.keywords || '',
        ogImage: initialData?.seoMetadata?.ogImage || '',
        canonical: initialData?.seoMetadata?.canonical || '',
        schemaMarkup: initialData?.seoMetadata?.schemaMarkup
          ? JSON.stringify(initialData.seoMetadata.schemaMarkup, null, 2)
          : ''
      }
    }
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: PortfolioFormValues) {
    try {
      let result;
      const formattedValues = {
        ...values,
        seoMetadata: {
          ...values.seoMetadata,
          schemaMarkup: values.seoMetadata.schemaMarkup
            ? JSON.parse(values.seoMetadata.schemaMarkup)
            : undefined
        }
      };

      if (isEditing) {
        result = await updatePortfolio(initialData.id, {
          ...formattedValues,
          seoMetadata: {
            ...formattedValues.seoMetadata,
            id: initialData.seoMetadata.id
          }
        } as any);
      } else {
        result = await createPortfolio(formattedValues as any);
      }

      if (result.success) {
        toast.success(
          isEditing
            ? 'Project updated successfully!'
            : 'Project created successfully!'
        );
        router.push('/dashboard/cms/portfolio');
        router.refresh();
        onSuccess?.();
      } else {
        toast.error(result.error || 'Something went wrong');
      }
    } catch (error) {
      toast.error(
        'Failed to parse schema markup. Please ensure it is valid JSON.'
      );
    }
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue('title', title);
    if (!isEditing) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-z0-9 ]/g, '')
        .replace(/\s+/g, '-');
      form.setValue('slug', slug);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <Tabs defaultValue='general' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='general'>General Information</TabsTrigger>
            <TabsTrigger value='seo'>SEO & Metadata</TabsTrigger>
          </TabsList>

          <TabsContent value='general' className='space-y-4 pt-4'>
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='title'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='e.g. E-commerce Redesign'
                            {...field}
                            onChange={handleTitleChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='slug'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder='ecommerce-redesign' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='client'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Name</FormLabel>
                      <FormControl>
                        <Input placeholder='e.g. Acme Corp' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Briefly describe this project...'
                          className='h-20'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='image'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Project Image</FormLabel>
                      <FormControl>
                        <div className='flex flex-col gap-4'>
                          {field.value &&
                            (field.value.startsWith('/') ||
                              field.value.startsWith('http')) && (
                              <div className='relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border'>
                                <Image
                                  src={field.value}
                                  alt='Project'
                                  fill
                                  className='object-cover'
                                />
                              </div>
                            )}
                          <MediaPicker
                            onSelect={(url) => field.onChange(url)}
                            title='Select Project Image'
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='content'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Case Study Content</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder='Detailed project description, process, and results...'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='seo' className='space-y-4 pt-4'>
            <FrankerSeoPanel control={form.control} />
          </TabsContent>
        </Tabs>

        <div className='flex justify-end gap-4'>
          <Button
            type='submit'
            disabled={isSubmitting}
            className='min-w-[120px]'
          >
            {isSubmitting ? (
              <>
                <IconLoader2 className='mr-2 animate-spin' size={18} />
                Saving...
              </>
            ) : isEditing ? (
              'Update Project'
            ) : (
              'Create Project'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
