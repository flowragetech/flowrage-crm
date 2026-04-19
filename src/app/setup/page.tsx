import { redirect } from 'next/navigation';
import { isSystemInitialized } from '@/lib/system-init';
import { SetupForm } from '@/features/setup/components/setup-form';

export const metadata = {
  title: 'Setup'
};

export default async function SetupPage() {
  const initialized = await isSystemInitialized();

  if (initialized) {
    redirect('/dashboard');
  }

  return (
    <main className='bg-muted/30 flex min-h-screen items-center justify-center p-6'>
      <div className='w-full max-w-md'>
        <SetupForm />
      </div>
    </main>
  );
}
