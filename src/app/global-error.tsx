'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang='en'>
      <body className='bg-background text-foreground'>
        <main className='flex min-h-screen items-center justify-center px-6'>
          <div className='w-full max-w-xl space-y-4 text-center'>
            <p className='text-muted-foreground text-sm tracking-[0.2em] uppercase'>
              System Error
            </p>
            <h1 className='text-3xl font-semibold'>Something went wrong.</h1>
            <p className='text-muted-foreground text-sm'>
              {error.digest
                ? `Reference: ${error.digest}`
                : 'An unexpected error occurred while rendering this page.'}
            </p>
            <div className='flex items-center justify-center gap-3'>
              <button
                className='bg-primary text-primary-foreground inline-flex h-10 items-center justify-center rounded-none px-4 text-sm font-medium'
                onClick={() => reset()}
                type='button'
              >
                Try again
              </button>
              <a
                className='border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-10 items-center justify-center rounded-none border px-4 text-sm font-medium'
                href='/dashboard'
              >
                Go to dashboard
              </a>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
