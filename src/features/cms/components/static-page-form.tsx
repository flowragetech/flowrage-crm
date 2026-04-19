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
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { StaticPageWithSeo } from './static-pages-table/columns';
import { createStaticPage, updateStaticPage } from '@/app/actions/static-pages';
import { IconLoader2 } from '@tabler/icons-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormSelect, type FormOption } from '@/components/forms/form-select';
import { FrankerSeoPanel } from '@/features/franker/components/franker-seo-panel';

const staticPageSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.'
  }),
  slug: z.string().min(2, {
    message: 'Slug must be at least 2 characters.'
  }),
  parentId: z.string().optional().nullable(),
  content: z.string(),
  seoMetadata: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.string().optional(),
    ogImage: z.string().optional(),
    canonical: z.string().url().optional().or(z.literal('')),
    schemaMarkup: z.string().optional()
  })
});

type StaticPageFormValues = z.infer<typeof staticPageSchema>;

interface StaticPageFormProps {
  initialData?: StaticPageWithSeo | null;
  allPages?: StaticPageWithSeo[];
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

export function StaticPageForm({
  initialData,
  allPages,
  onSuccess
}: StaticPageFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;
  const pages = allPages || [];

  const initialSlug = initialData?.slug || '';
  let initialParentId: string | undefined;
  let initialChildSlug = initialSlug;

  if (initialData && initialSlug.includes('/') && pages.length > 0) {
    const segments = initialSlug.split('/').filter(Boolean);
    if (segments.length > 1) {
      const parentSlug = segments.slice(0, -1).join('/');
      const parentPage = pages.find(
        (page) => page.id !== initialData.id && page.slug === parentSlug
      );
      if (parentPage) {
        initialParentId = parentPage.id;
        initialChildSlug = segments[segments.length - 1];
      }
    }
  }

  const parentOptions: FormOption[] = [
    { label: 'No parent', value: 'root' },
    ...pages
      .filter((page) => !initialData || page.id !== initialData.id)
      .map((page) => ({
        label: page.title,
        value: page.id
      }))
  ];

  const form = useForm<StaticPageFormValues>({
    resolver: zodResolver(staticPageSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialChildSlug,
      parentId: initialParentId || 'root',
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

  async function onSubmit(values: StaticPageFormValues) {
    try {
      let result;

      const selectedParent =
        values.parentId && values.parentId !== 'root'
          ? pages.find((page) => page.id === values.parentId)
          : null;

      const childSlug = values.slug.trim().replace(/^\/+|\/+$/g, '');

      const finalSlug = selectedParent
        ? `${selectedParent.slug.replace(/^\/+|\/+$/g, '')}/${childSlug}`
        : childSlug;

      const formattedValues = {
        ...values,
        slug: finalSlug,
        seoMetadata: {
          ...values.seoMetadata,
          schemaMarkup: values.seoMetadata.schemaMarkup
            ? JSON.parse(values.seoMetadata.schemaMarkup)
            : undefined
        }
      };

      if (isEditing) {
        result = await updateStaticPage(initialData.id, {
          ...formattedValues,
          seoMetadata: {
            ...formattedValues.seoMetadata,
            id: initialData.seoMetadata.id
          }
        } as any);
      } else {
        result = await createStaticPage(formattedValues as any);
      }

      if (result.success) {
        toast.success(
          isEditing
            ? 'Page updated successfully!'
            : 'Page created successfully!'
        );
        router.push('/dashboard/cms/pages');
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
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
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
                <CardTitle>Page Details</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                  <FormField
                    control={form.control}
                    name='title'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Page Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='e.g. About Us'
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
                          <Input placeholder='about-us' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormSelect
                    control={form.control as any}
                    name={'parentId' as any}
                    label='Parent Page'
                    options={parentOptions}
                    placeholder='No parent'
                    className='w-full'
                  />
                </div>

                <FormField
                  control={form.control}
                  name='content'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Page Content</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          value={field.value || ''}
                          onChange={field.onChange}
                          placeholder='Write your page content here...'
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
            type='button'
            variant='outline'
            onClick={() => router.push('/dashboard/cms/pages')}
          >
            Cancel
          </Button>
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
              'Update Page'
            ) : (
              'Create Page'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
