import PageContainer from '@/components/layout/page-container';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { DealsClient } from '@/features/crm/components/deals-client';
import { getDeals } from '@/features/crm/actions/deals';

export const metadata = {
  title: 'Deals | CRM Core'
};

export const dynamic = 'force-dynamic';

export default async function DealsPage() {
  const currentUser = await getCurrentUser();

  if (
    !currentUser ||
    !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(currentUser.role as string)
  ) {
    redirect('/dashboard/overview');
  }

  const deals = await getDeals();

  return (
    <PageContainer scrollable>
      <DealsClient initialData={deals} />
    </PageContainer>
  );
}
