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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { FrankerSeoPanel } from '@/features/franker/components/franker-seo-panel';
import { useRouter } from 'next/navigation';
import { createTag, updateTag } from '@/app/actions/blog';
import { IconLoader2 } from '@tabler/icons-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const tagSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.'
  }),
  slug: z.string().min(2, {
    message: 'Slug must be at least 2 characters.'
  }),
  seoMetadata: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      keywords: z.string().optional(),
      ogImage: z.string().optional(),
      canonical: z.string().url().optional().or(z.literal('')),
      schemaMarkup: z.string().optional()
    })
    .optional()
});

type TagFormValues = z.infer<typeof tagSchema>;

interface TagWithSeo {
  id: string;
  name: string;
  slug: string;
  seoMetadata?: any;
}

interface TagFormProps {
  initialData?: TagWithSeo | null;
  onSuccess?: () => void;
}

export function TagForm({ initialData, onSuccess }: TagFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
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

  async function onSubmit(values: TagFormValues) {
    try {
      const formattedValues = {
        ...values,
        seoMetadata: values.seoMetadata
          ? {
              ...values.seoMetadata,
              schemaMarkup: values.seoMetadata.schemaMarkup
                ? JSON.parse(values.seoMetadata.schemaMarkup)
                : undefined
            }
          : undefined
      };

      let result;
      if (isEditing) {
        result = await updateTag(initialData.id, formattedValues);
      } else {
        result = await createTag(formattedValues);
      }

      if (result.success) {
        toast.success(
          isEditing ? 'Tag updated successfully!' : 'Tag created successfully!'
        );
        router.refresh();
        onSuccess?.();
      } else {
        toast.error(result.error || 'Something went wrong');
      }
    } catch (error) {
      toast.error('Failed to save tag.');
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue('name', name);
    if (!isEditing) {
      const slug = name
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
                <CardTitle>Tag Details</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tag Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='e.g. SEO'
                          {...field}
                          onChange={handleNameChange}
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
                        <Input placeholder='seo' {...field} />
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
        <div className='flex justify-end gap-4 pt-4'>
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
              'Update Tag'
            ) : (
              'Create Tag'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
