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
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { updateSitemapConfig } from '@/app/actions/franker';
import { Trash2, Plus } from 'lucide-react';

const sitemapFormSchema = z.object({
  enabled: z.boolean(),
  includeImages: z.boolean(),
  exclude: z.array(z.object({ value: z.string() })),
  additionalUrls: z.array(z.object({ value: z.string().url() }))
});

type SitemapFormValues = z.infer<typeof sitemapFormSchema>;

interface SitemapConfigFormProps {
  initialConfig?: any;
}

export function SitemapConfigForm({ initialConfig }: SitemapConfigFormProps) {
  const [isMounting, setIsMounting] = useState(true);

  useEffect(() => {
    setIsMounting(false);
  }, []);

  const defaultValues: SitemapFormValues = {
    enabled: initialConfig?.enabled ?? true,
    includeImages: initialConfig?.includeImages ?? true,
    exclude: Array.isArray(initialConfig?.exclude)
      ? initialConfig.exclude.map((url: string) => ({ value: url }))
      : [],
    additionalUrls: Array.isArray(initialConfig?.additionalUrls)
      ? initialConfig.additionalUrls.map((url: string) => ({ value: url }))
      : []
  };

  const form = useForm<SitemapFormValues>({
    resolver: zodResolver(sitemapFormSchema),
    defaultValues
  });

  const {
    fields: excludeFields,
    append: appendExclude,
    remove: removeExclude
  } = useFieldArray({
    control: form.control,
    name: 'exclude'
  });

  const {
    fields: additionalFields,
    append: appendAdditional,
    remove: removeAdditional
  } = useFieldArray({
    control: form.control,
    name: 'additionalUrls'
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: SitemapFormValues) {
    try {
      const data = {
        enabled: values.enabled,
        includeImages: values.includeImages,
        exclude: values.exclude.map((item) => item.value),
        additionalUrls: values.additionalUrls.map((item) => item.value)
      };

      const result = await updateSitemapConfig(data);

      if (result.success) {
        toast.success('Sitemap configuration updated successfully!');
      } else {
        toast.error(result.error || 'Failed to update configuration');
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
        <CardTitle>XML Sitemap Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='flex flex-row items-center justify-between rounded-lg border p-4'>
              <FormField
                control={form.control}
                name='enabled'
                render={({ field }) => (
                  <FormItem className='flex w-full flex-row items-center justify-between'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>
                        Enable Sitemap
                      </FormLabel>
                      <FormDescription>
                        Generate XML sitemap for search engines.
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
            </div>

            <div className='flex flex-row items-center justify-between rounded-lg border p-4'>
              <FormField
                control={form.control}
                name='includeImages'
                render={({ field }) => (
                  <FormItem className='flex w-full flex-row items-center justify-between'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>
                        Include Images
                      </FormLabel>
                      <FormDescription>
                        Include image entries in the sitemap.
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
            </div>

            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <p className='text-sm font-medium'>Exclude URLs (contains)</p>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => appendExclude({ value: '' })}
                >
                  <Plus className='mr-2 h-4 w-4' />
                  Add Rule
                </Button>
              </div>
              {excludeFields.map((field, index) => (
                <div key={field.id} className='flex items-center gap-2'>
                  <FormField
                    control={form.control}
                    name={`exclude.${index}.value`}
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormControl>
                          <Input placeholder='/private-page' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    onClick={() => removeExclude(index)}
                  >
                    <Trash2 className='text-destructive h-4 w-4' />
                  </Button>
                </div>
              ))}
            </div>

            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <p className='text-sm font-medium'>Additional URLs</p>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => appendAdditional({ value: '' })}
                >
                  <Plus className='mr-2 h-4 w-4' />
                  Add URL
                </Button>
              </div>
              {additionalFields.map((field, index) => (
                <div key={field.id} className='flex items-center gap-2'>
                  <FormField
                    control={form.control}
                    name={`additionalUrls.${index}.value`}
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormControl>
                          <Input
                            placeholder='https://example.com/special-page'
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
                    onClick={() => removeAdditional(index)}
                  >
                    <Trash2 className='text-destructive h-4 w-4' />
                  </Button>
                </div>
              ))}
            </div>

            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Configuration'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
