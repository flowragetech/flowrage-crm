import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export default async function Page() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect('/auth/sign-in');
  }

  redirect('/dashboard/overview');
}
