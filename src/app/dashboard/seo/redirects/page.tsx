import PageContainer from '@/components/layout/page-container';
import { RedirectsClient } from '@/features/seo/components/redirects-client';
import { getRedirects } from '@/app/actions/seo';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function RedirectsManagement() {
  const currentUser = await getCurrentUser();

  if (
    !currentUser ||
    !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(currentUser.role as string)
  ) {
    redirect('/dashboard/overview');
  }

  const redirects = await getRedirects();

  return (
    <PageContainer scrollable>
      <RedirectsClient initialData={redirects} />
    </PageContainer>
  );
}
