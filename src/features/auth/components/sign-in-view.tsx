'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/forms/form-input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { InteractiveGridPattern } from './interactive-grid';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

type SignInValues = z.infer<typeof formSchema>;

export default function SignInViewPage() {
  const router = useRouter();
  const [loading, startTransition] = useTransition();

  const form = useForm<SignInValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = (values: SignInValues) => {
    startTransition(async () => {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        });

        if (!response.ok) {
          const data = await response.json().catch(() => null);
          const message =
            data?.error || 'Unable to sign in. Please check your credentials.';
          toast.error(message);
          return;
        }

        toast.success('Signed in successfully');
        const searchParams = new URLSearchParams(window.location.search);
        const redirectUrl =
          searchParams.get('redirect_url') || '/dashboard/overview';
        router.push(redirectUrl);
      } catch {
        toast.error('Unexpected error while signing in');
      }
    });
  };

  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r'>
        <div className='absolute inset-0 bg-zinc-900' />
        <div className='relative z-20 flex items-center text-lg font-medium'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='mr-2 h-6 w-6'
          >
            <path d='M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3' />
          </svg>
          CRM Core
        </div>
        <InteractiveGridPattern
          className={cn(
            'mask-[radial-gradient(400px_circle_at_center,white,transparent)]',
            'inset-x-0 inset-y-[0%] h-full skew-y-12'
          )}
        />
        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-2'>
            <p className='text-lg'>
              &ldquo;This admin panel provides the best SEO management tools for
              our agency.&rdquo;
            </p>
            <footer className='text-sm'>Product Team</footer>
          </blockquote>
        </div>
      </div>
      <div className='flex h-full items-center justify-center p-4 lg:p-8'>
        <div className='flex w-full max-w-md flex-col items-center justify-center space-y-6'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='w-full space-y-4'
            >
              <FormInput
                control={form.control}
                name='email'
                type='email'
                label='Email'
                placeholder='Enter your email'
                disabled={loading}
                required
              />
              <FormInput
                control={form.control}
                name='password'
                type='password'
                label='Password'
                placeholder='Enter your password'
                disabled={loading}
                required
              />
              <Button
                disabled={loading}
                className='mt-2 ml-auto w-full'
                type='submit'
              >
                Sign In
              </Button>
            </form>
          </Form>

          <p className='text-muted-foreground px-8 text-center text-sm'>
            By clicking continue, you agree to our{' '}
            <Link
              href='/terms'
              className='hover:text-primary underline underline-offset-4'
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href='/privacy'
              className='hover:text-primary underline underline-offset-4'
            >
              Privacy Policy
            </Link>
            .
          </p>
          <p className='text-muted-foreground px-8 text-center text-sm'>
            Do not have an account?{' '}
            <Link
              href='/auth/sign-up'
              className='hover:text-primary underline underline-offset-4'
            >
              Sign up
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
