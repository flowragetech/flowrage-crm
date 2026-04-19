'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
import { updateImageSeoConfig } from '@/app/actions/franker';
import { Badge } from '@/components/ui/badge';

const imageSeoFormSchema = z.object({
  autoAlt: z.boolean(),
  altTemplate: z.string().optional(),
  autoTitle: z.boolean(),
  titleTemplate: z.string().optional()
});

type ImageSeoFormValues = z.infer<typeof imageSeoFormSchema>;

interface ImageSeoFormProps {
  initialConfig?: any;
}

export function ImageSeoForm({ initialConfig }: ImageSeoFormProps) {
  const [isMounting, setIsMounting] = useState(true);

  useEffect(() => {
    setIsMounting(false);
  }, []);

  const defaultValues: ImageSeoFormValues = {
    autoAlt: initialConfig?.autoAlt ?? true,
    altTemplate: initialConfig?.altTemplate || '%title% %filename%',
    autoTitle: initialConfig?.autoTitle ?? true,
    titleTemplate: initialConfig?.titleTemplate || '%title%'
  };

  const form = useForm<ImageSeoFormValues>({
    resolver: zodResolver(imageSeoFormSchema),
    defaultValues
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: ImageSeoFormValues) {
    try {
      const result = await updateImageSeoConfig(values);

      if (result.success) {
        toast.success('Image SEO configuration updated successfully!');
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
        <CardTitle>Image SEO Automation</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='space-y-4 rounded-lg border p-4'>
              <FormField
                control={form.control}
                name='autoAlt'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>
                        Auto Add Alt Attributes
                      </FormLabel>
                      <FormDescription>
                        Automatically add alt attributes to images if missing.
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

              {form.watch('autoAlt') && (
                <FormField
                  control={form.control}
                  name='altTemplate'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alt Text Template</FormLabel>
                      <FormControl>
                        <Input placeholder='%title% %filename%' {...field} />
                      </FormControl>
                      <FormDescription>
                        Available variables:{' '}
                        <Badge variant='outline'>%title%</Badge>{' '}
                        <Badge variant='outline'>%filename%</Badge>{' '}
                        <Badge variant='outline'>%sitename%</Badge>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className='space-y-4 rounded-lg border p-4'>
              <FormField
                control={form.control}
                name='autoTitle'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>
                        Auto Add Title Attributes
                      </FormLabel>
                      <FormDescription>
                        Automatically add title attributes to images if missing.
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

              {form.watch('autoTitle') && (
                <FormField
                  control={form.control}
                  name='titleTemplate'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title Text Template</FormLabel>
                      <FormControl>
                        <Input placeholder='%title%' {...field} />
                      </FormControl>
                      <FormDescription>
                        Available variables:{' '}
                        <Badge variant='outline'>%title%</Badge>{' '}
                        <Badge variant='outline'>%filename%</Badge>{' '}
                        <Badge variant='outline'>%sitename%</Badge>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
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
