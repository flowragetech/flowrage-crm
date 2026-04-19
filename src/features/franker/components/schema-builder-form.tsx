'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { updateGlobalSeo } from '@/app/actions/seo';
import { MediaPicker } from '@/features/media/components/media-picker';
import { GlobalSeo } from '@prisma/client';
import { Trash2, Plus } from 'lucide-react';
import Image from 'next/image';

const schemaFormSchema = z.object({
  type: z.enum(['Organization', 'Person']),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  url: z.string().url('Must be a valid URL'),
  logo: z.string().optional(),
  sameAs: z.array(
    z.object({
      value: z.string().url('Must be a valid URL')
    })
  )
});

type SchemaFormValues = z.infer<typeof schemaFormSchema>;

interface SchemaBuilderFormProps {
  initialData?: GlobalSeo | null;
}

export function SchemaBuilderForm({ initialData }: SchemaBuilderFormProps) {
  const [isMounting, setIsMounting] = useState(true);

  useEffect(() => {
    setIsMounting(false);
  }, []);

  // Parse existing schema markup
  const parsedSchema = initialData?.schemaMarkup
    ? JSON.parse(initialData.schemaMarkup as string)
    : {};

  const defaultValues: SchemaFormValues = {
    type: parsedSchema['@type'] || 'Organization',
    name: parsedSchema.name || '',
    url: parsedSchema.url || '',
    logo: parsedSchema.logo || '',
    sameAs: Array.isArray(parsedSchema.sameAs)
      ? parsedSchema.sameAs.map((url: string) => ({ value: url }))
      : []
  };

  const form = useForm<SchemaFormValues>({
    resolver: zodResolver(schemaFormSchema),
    defaultValues
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'sameAs'
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: SchemaFormValues) {
    try {
      // Construct JSON-LD
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': values.type,
        name: values.name,
        url: values.url,
        logo: values.logo,
        sameAs: values.sameAs.map((item) => item.value)
      };

      // We need to merge this with existing global SEO data
      const data = {
        defaultMetaTitle: initialData?.defaultMetaTitle,
        defaultMetaDescription: initialData?.defaultMetaDescription,
        ogSiteName: initialData?.ogSiteName,
        ogImage: initialData?.ogImage,
        twitterHandle: initialData?.twitterHandle,
        googleAnalyticsId: initialData?.googleAnalyticsId,
        googleSearchConsoleId: initialData?.googleSearchConsoleId,
        bingWebmasterId: initialData?.bingWebmasterId,
        schemaMarkup: JSON.stringify(jsonLd)
      };

      const result = await updateGlobalSeo(data);

      if (result.success) {
        toast.success('Schema settings updated successfully!');
      } else {
        toast.error(result.error || 'Failed to update settings');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  }

  if (isMounting) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Knowledge Graph Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='Organization'>
                          Organization
                        </SelectItem>
                        <SelectItem value='Person'>Person</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Are you representing an organization or a person?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Your Brand' {...field} />
                    </FormControl>
                    <FormDescription>
                      The name of the person or organization.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='url'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <Input placeholder='https://example.com' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='logo'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo / Avatar URL</FormLabel>
                    <FormControl>
                      <div className='flex items-center gap-4'>
                        <Input
                          placeholder='https://example.com/logo.png'
                          {...field}
                        />
                        <MediaPicker
                          onSelect={(url) => field.onChange(url)}
                          trigger={
                            <Button type='button' variant='secondary'>
                              Select
                            </Button>
                          }
                        />
                      </div>
                    </FormControl>
                    {field.value && (
                      <div className='relative mt-2 h-20 w-20 overflow-hidden rounded-md border'>
                        <Image
                          src={field.value}
                          alt='Logo'
                          fill
                          className='object-cover'
                        />
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <p className='text-sm font-medium'>Social Profiles (SameAs)</p>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => append({ value: '' })}
                >
                  <Plus className='mr-2 h-4 w-4' />
                  Add Profile
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className='flex items-center gap-2'>
                  <FormField
                    control={form.control}
                    name={`sameAs.${index}.value`}
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormControl>
                          <Input
                            placeholder='https://facebook.com/your-page'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    onClick={() => remove(index)}
                  >
                    <Trash2 className='text-destructive h-4 w-4' />
                  </Button>
                </div>
              ))}
              <p className='text-muted-foreground text-[0.8rem]'>
                Add links to your social media profiles (Facebook, Twitter,
                LinkedIn, etc.).
              </p>
            </div>

            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Settings'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
