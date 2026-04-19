'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/forms/form-input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

type SetupValues = z.infer<typeof formSchema>;

export function SetupForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<SetupValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  });

  async function onSubmit(values: SetupValues) {
    try {
      setIsSubmitting(true);

      const response = await fetch('/api/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        toast.error(data?.error || 'Setup could not be completed.');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      toast.error('Setup could not be completed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Initialize System</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormInput
              control={form.control}
              name='name'
              label='Name'
              placeholder='Administrator'
              disabled={isSubmitting}
              required
            />
            <FormInput
              control={form.control}
              name='email'
              type='email'
              label='Email'
              placeholder='admin@example.com'
              disabled={isSubmitting}
              required
            />
            <FormInput
              control={form.control}
              name='password'
              type='password'
              label='Password'
              placeholder='Create a strong password'
              disabled={isSubmitting}
              required
            />
            <Button type='submit' className='w-full' disabled={isSubmitting}>
              {isSubmitting ? 'Initializing...' : 'Complete Setup'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
