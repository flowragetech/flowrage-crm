'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { ServiceWithSeo } from './services-table/columns';
import { createService, updateService } from '@/app/actions/services';
import {
  IconLoader2,
  IconTrash,
  IconPlus,
  IconPhoto
} from '@tabler/icons-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FrankerSeoPanel } from '@/features/franker/components/franker-seo-panel';

import { IconPicker } from './icon-picker';
import { MediaPicker } from '@/features/media/components/media-picker';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ServiceCategory } from '@prisma/client';

const serviceSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.'
  }),
  slug: z.string().min(2, {
    message: 'Slug must be at least 2 characters.'
  }),
  description: z.string(),
  categoryId: z.string().optional(),
  order: z.coerce.number().default(0),
  icon: z.string().optional(),
  image: z.string().optional(),
  content: z.string().optional(),
  features: z
    .array(
      z.object({
        title: z.string().min(1, 'Title is required'),
        icon: z.string().min(1, 'Icon is required')
      })
    )
    .default([]),
  seoMetadata: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.string().optional(),
    ogImage: z.string().optional(),
    canonical: z.string().url().optional().or(z.literal('')),
    schemaMarkup: z.string().optional()
  })
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  initialData?: ServiceWithSeo | null;
  categories?: ServiceCategory[];
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

export function ServiceForm({
  initialData,
  categories,
  onSuccess
}: ServiceFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const form = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      description: initialData?.description || '',
      categoryId: initialData?.categoryId || undefined,
      order: initialData?.order || 0,
      icon: initialData?.icon || '',
      image: (initialData as any)?.image || '',
      content: initialData?.content || '',
      features: (initialData as any)?.features
        ? JSON.parse((initialData as any).features)
        : [],
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

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'features'
  });

  async function onSubmit(values: ServiceFormValues) {
    try {
      let result;
      const formattedValues = {
        ...values,
        features:
          values.features && values.features.length > 0
            ? JSON.stringify(values.features)
            : undefined,
        seoMetadata: {
          ...values.seoMetadata,
          schemaMarkup: values.seoMetadata.schemaMarkup
            ? JSON.parse(values.seoMetadata.schemaMarkup)
            : undefined
        }
      };

      if (isEditing) {
        result = await updateService(initialData.id, {
          ...formattedValues,
          seoMetadata: {
            ...formattedValues.seoMetadata,
            id: initialData.seoMetadata.id
          }
        } as any);
      } else {
        result = await createService(formattedValues as any);
      }

      if (result.success) {
        toast.success(
          isEditing
            ? 'Service updated successfully!'
            : 'Service created successfully!'
        );
        router.push('/dashboard/cms/services');
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

  // Auto-generate slug from name if not editing
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
                <CardTitle>Service Details</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='e.g. SEO Audit'
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
                          <Input placeholder='seo-audit' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='categoryId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select a category' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories?.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='order'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            {...field}
                            value={field.value as number}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Briefly describe this service...'
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
                      <FormLabel>Service Image</FormLabel>
                      <FormControl>
                        <div className='flex flex-col gap-4'>
                          {field.value &&
                            (field.value.startsWith('/') ||
                              field.value.startsWith('http')) && (
                              <div className='relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border'>
                                <Image
                                  src={field.value}
                                  alt='Service Image'
                                  fill
                                  className='object-cover'
                                />
                                <Button
                                  type='button'
                                  variant='ghost'
                                  size='icon'
                                  className='absolute top-2 right-2 h-8 w-8 bg-black/50 text-white hover:bg-black/70'
                                  onClick={() => field.onChange('')}
                                >
                                  <IconTrash className='h-4 w-4' />
                                </Button>
                              </div>
                            )}
                          <MediaPicker
                            onSelect={(url) => field.onChange(url)}
                            title='Select Service Image'
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
                      <FormLabel>Service Content</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          value={field.value || ''}
                          onChange={field.onChange}
                          placeholder='Write detailed service content here...'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between'>
                <CardTitle>Features</CardTitle>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => append({ title: '', icon: '' })}
                >
                  <IconPlus className='mr-2 h-4 w-4' />
                  Add Feature
                </Button>
              </CardHeader>
              <CardContent className='space-y-4'>
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className='flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0'
                  >
                    <div className='grid flex-1 gap-4 md:grid-cols-2'>
                      <FormField
                        control={form.control}
                        name={`features.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder='Feature Title' {...field} />
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
                            <FormLabel>Icon</FormLabel>
                            <FormControl>
                              <IconPicker
                                value={field.value as string}
                                onChange={field.onChange}
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
                      className='text-destructive mt-8'
                      onClick={() => remove(index)}
                    >
                      <IconTrash className='h-4 w-4' />
                    </Button>
                  </div>
                ))}
                {fields.length === 0 && (
                  <p className='text-muted-foreground py-4 text-center text-sm'>
                    No features added yet. Click "Add Feature" to start.
                  </p>
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
              'Update Service'
            ) : (
              'Create Service'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
