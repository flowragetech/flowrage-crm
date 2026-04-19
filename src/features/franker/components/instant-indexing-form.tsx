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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { updateIndexingConfig } from '@/app/actions/franker';

const indexingFormSchema = z.object({
  googleIndexingEnabled: z.boolean(),
  googleJson: z.string().optional(),
  indexNowEnabled: z.boolean(),
  bingApiKey: z.string().optional()
});

type IndexingFormValues = z.infer<typeof indexingFormSchema>;

interface InstantIndexingFormProps {
  initialConfig?: any;
}

export function InstantIndexingForm({
  initialConfig
}: InstantIndexingFormProps) {
  const [isMounting, setIsMounting] = useState(true);

  useEffect(() => {
    setIsMounting(false);
  }, []);

  const defaultValues: IndexingFormValues = {
    googleIndexingEnabled: initialConfig?.googleIndexingEnabled ?? false,
    googleJson: initialConfig?.googleJson || '',
    indexNowEnabled: initialConfig?.indexNowEnabled ?? false,
    bingApiKey: initialConfig?.bingApiKey || ''
  };

  const form = useForm<IndexingFormValues>({
    resolver: zodResolver(indexingFormSchema),
    defaultValues
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: IndexingFormValues) {
    try {
      const result = await updateIndexingConfig(values);

      if (result.success) {
        toast.success('Indexing configuration updated successfully!');
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
        <CardTitle>Instant Indexing Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='space-y-4 rounded-lg border p-4'>
              <FormField
                control={form.control}
                name='googleIndexingEnabled'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>
                        Google Indexing API
                      </FormLabel>
                      <FormDescription>
                        Use Google's Indexing API to notify Google when you
                        update content.
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

              {form.watch('googleIndexingEnabled') && (
                <FormField
                  control={form.control}
                  name='googleJson'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Google JSON Key</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Paste the contents of your Google Service Account JSON key here...'
                          className='min-h-[150px] font-mono text-xs'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Create a Service Account in Google Cloud Console, enable
                        Indexing API, and download the JSON key.
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
                name='indexNowEnabled'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>
                        IndexNow (Bing & Yandex)
                      </FormLabel>
                      <FormDescription>
                        Automatically notify Bing and Yandex about new content
                        using IndexNow.
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

              {form.watch('indexNowEnabled') && (
                <FormField
                  control={form.control}
                  name='bingApiKey'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IndexNow API Key</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='e.g., 4738473847384738'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        You can generate this key in Bing Webmaster Tools.
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
