'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { upsertRedirect } from '@/app/actions/seo';
import { useRouter } from 'next/navigation';

const redirectSchema = z.object({
  id: z.string().optional(),
  source: z
    .string()
    .min(1, 'Source path is required')
    .startsWith('/', 'Source path must start with /'),
  destination: z.string().min(1, 'Destination path or URL is required'),
  statusCode: z.string(),
  isActive: z.boolean().default(true)
});

export type RedirectFormValues = z.infer<typeof redirectSchema>;

interface RedirectFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export function RedirectForm({ initialData, onSuccess }: RedirectFormProps) {
  const router = useRouter();

  const form = useForm<RedirectFormValues>({
    resolver: zodResolver(redirectSchema) as any,
    defaultValues: {
      id: initialData?.id || undefined,
      source: initialData?.source || '',
      destination: initialData?.destination || '',
      statusCode: initialData?.statusCode?.toString() || '301',
      isActive: initialData?.isActive ?? true
    }
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: RedirectFormValues) {
    try {
      const result = await upsertRedirect(values);
      if (result.success) {
        toast.success(values.id ? 'Redirect updated!' : 'Redirect created!');
        form.reset();
        router.push('/dashboard/seo/redirects');
        router.refresh();
        if (onSuccess) onSuccess();
      } else {
        toast.error(result.error || 'Failed to save redirect');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='source'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source Path</FormLabel>
              <FormControl>
                <Input placeholder='/old-page-url' {...field} />
              </FormControl>
              <FormDescription>
                The relative path to redirect from (must start with /).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='destination'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destination</FormLabel>
              <FormControl>
                <Input
                  placeholder='/new-page-url or https://example.com'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The path or full URL to redirect to.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='statusCode'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status Code</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select status code' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='301'>301 (Permanent)</SelectItem>
                    <SelectItem value='302'>302 (Temporary)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='isActive'
            render={({ field }) => (
              <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                <div className='space-y-0.5'>
                  <FormLabel>Active</FormLabel>
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
        <div className='flex justify-end gap-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting
              ? 'Saving...'
              : initialData?.id
                ? 'Update Redirect'
                : 'Add Redirect'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
