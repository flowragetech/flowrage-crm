import PageContainer from '@/components/layout/page-container';
import { PortfolioForm } from '@/features/cms/components/portfolio-form';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Add New Portfolio Project | CRM Core'
};

export default async function NewPortfolioPage() {
  const currentUser = await getCurrentUser();

  if (
    !currentUser ||
    !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(currentUser.role as string)
  ) {
    redirect('/dashboard/overview');
  }

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Create New Project'
            description='Add a new portfolio project to your agency website.'
          />
        </div>
        <Separator />
        <PortfolioForm />
      </div>
    </PageContainer>
  );
}
