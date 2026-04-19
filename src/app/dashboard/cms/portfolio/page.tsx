import PageContainer from '@/components/layout/page-container';
import { getPortfolios } from '@/app/actions/portfolio';
import { PortfolioClient } from '@/features/cms/components/portfolio-client';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Portfolio Management | CRM Core'
};

export const dynamic = 'force-dynamic';

export default async function PortfolioManagement() {
  const currentUser = await getCurrentUser();

  if (
    !currentUser ||
    !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(currentUser.role as string)
  ) {
    redirect('/dashboard/overview');
  }

  const portfolios = await getPortfolios();

  return (
    <PageContainer scrollable>
      <div className='space-y-4'>
        <PortfolioClient initialData={portfolios as any} />
      </div>
    </PageContainer>
  );
}
