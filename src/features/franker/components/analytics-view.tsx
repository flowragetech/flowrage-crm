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
import { updateAnalyticsConfig } from '@/app/actions/franker';

const analyticsFormSchema = z.object({
  embedUrl: z.string().optional(),
  showInDashboard: z.boolean()
});

type AnalyticsFormValues = z.infer<typeof analyticsFormSchema>;

interface AnalyticsViewProps {
  initialConfig?: any;
}

export function AnalyticsView({ initialConfig }: AnalyticsViewProps) {
  const [isMounting, setIsMounting] = useState(true);

  useEffect(() => {
    setIsMounting(false);
  }, []);

  const defaultValues: AnalyticsFormValues = {
    embedUrl: initialConfig?.embedUrl || '',
    showInDashboard: initialConfig?.showInDashboard ?? false
  };

  const form = useForm<AnalyticsFormValues>({
    resolver: zodResolver(analyticsFormSchema),
    defaultValues
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: AnalyticsFormValues) {
    try {
      const result = await updateAnalyticsConfig(values);

      if (result.success) {
        toast.success('Analytics settings updated successfully!');
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

  const embedUrl = form.watch('embedUrl');

  return (
    <div className='space-y-4'>
      <Card>
        <CardHeader>
          <CardTitle>Analytics Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='showInDashboard'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>
                        Enable Dashboard Embed
                      </FormLabel>
                      <FormDescription>
                        Show the embedded report below.
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
                name='embedUrl'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Looker Studio / Data Studio Embed URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='https://lookerstudio.google.com/embed/...'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Paste the embed URL from your Google Looker Studio report.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Settings'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {defaultValues.showInDashboard && embedUrl && (
        <Card className='h-[800px]'>
          <CardHeader>
            <CardTitle>Analytics Report</CardTitle>
          </CardHeader>
          <CardContent className='h-full p-0'>
            <iframe
              src={embedUrl}
              className='h-full w-full border-0'
              allowFullScreen
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
