import PageContainer from '@/components/layout/page-container';
import { getServices } from '@/app/actions/services';
import { ServicesClient } from '@/features/cms/components/services-client';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Services Management | CRM Core'
};

export const dynamic = 'force-dynamic';

export default async function ServicesManagement() {
  const currentUser = await getCurrentUser();

  if (
    !currentUser ||
    !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(currentUser.role as string)
  ) {
    redirect('/dashboard/overview');
  }

  const services = await getServices();

  return (
    <PageContainer scrollable>
      <div className='space-y-4'>
        <ServicesClient initialData={services as any} />
      </div>
    </PageContainer>
  );
}
