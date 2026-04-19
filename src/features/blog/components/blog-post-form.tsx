'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
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
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { createBlogPost, updateBlogPost } from '@/app/actions/blog';
import { MediaPicker } from '@/features/media/components/media-picker';
import { FrankerSeoPanel } from '@/features/franker/components/franker-seo-panel';
import Image from 'next/image';
import { IconPhoto, IconLoader2 } from '@tabler/icons-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';

type BlogCategory = {
  id: string;
  name: string;
  slug: string;
};

const blogPostSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.'
  }),
  slug: z.string().min(2, {
    message: 'Slug must be at least 2 characters.'
  }),
  content: z.string().min(10, {
    message: 'Content must be at least 10 characters.'
  }),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  published: z.boolean(),
  categoryIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
  faq: z
    .array(
      z.object({
        question: z.string().min(1, { message: 'Question is required' }),
        answer: z.string()
      })
    )
    .optional(),
  seoMetadata: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.string().optional(),
    ogImage: z.string().optional(),
    canonical: z.string().url().optional().or(z.literal('')),
    schemaMarkup: z.string().optional()
  })
});

type BlogPostFormValues = z.infer<typeof blogPostSchema>;

interface BlogPostFormProps {
  initialData?: any | null;
  categories: BlogCategory[];
  tags: any[];
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

export function BlogPostForm({
  initialData,
  categories,
  tags,
  onSuccess
}: BlogPostFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      content: initialData?.content || '',
      excerpt: initialData?.excerpt || '',
      featuredImage: initialData?.featuredImage || '',
      published: initialData?.published || false,
      categoryIds: initialData?.categories?.map((c: any) => c.id) || [],
      tagIds: initialData?.tags?.map((t: any) => t.id) || [],
      faq: initialData?.faq
        ? JSON.parse(initialData.faq)
        : [{ question: '', answer: '' }],
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

  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq
  } = useFieldArray({
    control: form.control,
    name: 'faq'
  });

  const onInvalid = (errors: any) => {
    toast.error('Please fix the errors in the form before saving.');
    if (errors.title || errors.slug || errors.content) {
      const tabsTrigger = document.querySelector('[value="general"]');
      if (tabsTrigger instanceof HTMLElement) {
        tabsTrigger.click();
      }
    }
  };

  async function onSubmit(values: BlogPostFormValues) {
    try {
      let result;
      const formattedValues = {
        ...values,
        faq: values.faq ? JSON.stringify(values.faq) : null,
        seoMetadata: {
          ...values.seoMetadata,
          schemaMarkup: values.seoMetadata.schemaMarkup
            ? JSON.parse(values.seoMetadata.schemaMarkup)
            : undefined
        }
      };

      if (isEditing) {
        result = await updateBlogPost(initialData.id, {
          ...formattedValues,
          seoMetadata: {
            ...formattedValues.seoMetadata,
            id: initialData.seoMetadata.id
          }
        } as any);
      } else {
        result = await createBlogPost(formattedValues as any);
      }

      if (result.success) {
        toast.success(
          isEditing
            ? 'Post updated successfully!'
            : 'Post created successfully!'
        );
        router.push('/dashboard/blog/posts');
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
    <div className='mx-auto max-w-5xl'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className='space-y-8'
        >
          <Tabs defaultValue='general' className='w-full'>
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='general'>General Information</TabsTrigger>
              <TabsTrigger value='faq'>FAQs</TabsTrigger>
              <TabsTrigger value='seo'>SEO & Metadata</TabsTrigger>
            </TabsList>

            <TabsContent value='general' className='space-y-4 pt-4'>
              <Card>
                <CardHeader>
                  <CardTitle>Post Details</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='title'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Post Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='e.g. 10 Tips for Better SEO'
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
                            <Input
                              placeholder='10-tips-for-better-seo'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='categoryIds'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categories</FormLabel>
                          <FormControl>
                            {categories.length === 0 ? (
                              <div className='flex flex-wrap items-center justify-between gap-2'>
                                <span className='text-muted-foreground text-sm'>
                                  No categories yet.
                                </span>
                                <Button
                                  type='button'
                                  variant='outline'
                                  size='sm'
                                  onClick={() =>
                                    router.push('/dashboard/blog/categories')
                                  }
                                >
                                  Create category
                                </Button>
                              </div>
                            ) : (
                              <div className='flex flex-wrap gap-2'>
                                {categories.map((category) => (
                                  <Button
                                    key={category.id}
                                    type='button'
                                    variant={
                                      field.value?.includes(category.id)
                                        ? 'default'
                                        : 'outline'
                                    }
                                    size='sm'
                                    onClick={() => {
                                      const current = field.value || [];
                                      if (current.includes(category.id)) {
                                        field.onChange(
                                          current.filter(
                                            (id) => id !== category.id
                                          )
                                        );
                                      } else {
                                        field.onChange([
                                          ...current,
                                          category.id
                                        ]);
                                      }
                                    }}
                                  >
                                    {category.name}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='tagIds'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tags</FormLabel>
                          <FormControl>
                            {tags.length === 0 ? (
                              <div className='flex flex-wrap items-center justify-between gap-2'>
                                <span className='text-muted-foreground text-sm'>
                                  No tags yet.
                                </span>
                                <Button
                                  type='button'
                                  variant='outline'
                                  size='sm'
                                  onClick={() =>
                                    router.push('/dashboard/blog/tags')
                                  }
                                >
                                  Create tag
                                </Button>
                              </div>
                            ) : (
                              <div className='flex flex-wrap gap-2'>
                                {tags.map((tag) => (
                                  <Button
                                    key={tag.id}
                                    type='button'
                                    variant={
                                      field.value?.includes(tag.id)
                                        ? 'secondary'
                                        : 'outline'
                                    }
                                    size='sm'
                                    onClick={() => {
                                      const current = field.value || [];
                                      if (current.includes(tag.id)) {
                                        field.onChange(
                                          current.filter((id) => id !== tag.id)
                                        );
                                      } else {
                                        field.onChange([...current, tag.id]);
                                      }
                                    }}
                                  >
                                    #{tag.name}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name='published'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                        <div className='space-y-0.5'>
                          <FormLabel>Published</FormLabel>
                          <FormDescription>
                            Make this post visible on the website.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='excerpt'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Excerpt (Short summary)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='Briefly summarize the post...'
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
                    name='featuredImage'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Featured Image</FormLabel>
                        <FormControl>
                          <div className='flex flex-col gap-4'>
                            {field.value &&
                              (field.value.startsWith('/') ||
                                field.value.startsWith('http')) && (
                                <div className='relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border'>
                                  <Image
                                    src={field.value}
                                    alt='Featured'
                                    fill
                                    className='object-cover'
                                  />
                                </div>
                              )}
                            <MediaPicker
                              onSelect={(url) => field.onChange(url)}
                              title='Select Featured Image'
                              trigger={
                                <Button
                                  variant='outline'
                                  type='button'
                                  className='w-fit gap-2'
                                >
                                  <IconPhoto size={18} />
                                  {field.value
                                    ? 'Change Image'
                                    : 'Select Image'}
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
                        <FormLabel>Post Content</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            value={field.value}
                            onChange={field.onChange}
                            placeholder='Write your post content here...'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='faq' className='space-y-4 pt-4'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => appendFaq({ question: '', answer: '' })}
                  >
                    <Plus className='mr-2 h-4 w-4' />
                    Add Question
                  </Button>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {faqFields.map((field, index) => (
                    <div
                      key={field.id}
                      className='relative grid gap-4 rounded-lg border p-4 md:grid-cols-[1fr,auto]'
                    >
                      <div className='grid gap-4'>
                        <FormField
                          control={form.control}
                          name={`faq.${index}.question`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Question</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='e.g. How does this work?'
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
                                  placeholder='Enter the answer...'
                                  className='h-20'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='text-destructive hover:bg-destructive/10'
                        onClick={() => removeFaq(index)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  ))}
                  {faqFields.length === 0 && (
                    <div className='text-muted-foreground flex h-24 items-center justify-center rounded-lg border border-dashed text-sm'>
                      No FAQs added yet. Click "Add Question" to start.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='seo' className='space-y-4 pt-4'>
              <FrankerSeoPanel control={form.control} />
            </TabsContent>
          </Tabs>

          <div className='flex justify-end gap-4'>
            <Button
              variant='outline'
              type='button'
              onClick={() => router.push('/dashboard/blog/posts')}
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
                'Update Post'
              ) : (
                'Create Post'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
