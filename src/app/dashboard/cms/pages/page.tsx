import PageContainer from '@/components/layout/page-container';
import { getStaticPages } from '@/app/actions/static-pages';
import { StaticPagesClient } from '@/features/cms/components/static-pages-client';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Static Pages Management | CRM Core'
};

export const dynamic = 'force-dynamic';

export default async function StaticPagesManagement() {
  const currentUser = await getCurrentUser();

  if (
    !currentUser ||
    !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(currentUser.role as string)
  ) {
    redirect('/dashboard/overview');
  }

  const pages = await getStaticPages();

  return (
    <PageContainer scrollable>
      <div className='space-y-4'>
        <StaticPagesClient initialData={pages as any} />
      </div>
    </PageContainer>
  );
}
