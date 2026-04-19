import PageContainer from '@/components/layout/page-container';
import { getPortfolioById } from '@/app/actions/portfolio';
import { PortfolioForm } from '@/features/cms/components/portfolio-form';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export const metadata = {
  title: 'Edit Portfolio Project | CRM Core'
};

export default async function EditPortfolioPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const currentUser = await getCurrentUser();

  if (
    !currentUser ||
    !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(currentUser.role as string)
  ) {
    redirect('/dashboard/overview');
  }

  const portfolio = await getPortfolioById(id);

  if (!portfolio) {
    notFound();
  }

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Edit Project'
            description='Update your portfolio project details and settings.'
          />
        </div>
        <Separator />
        <PortfolioForm initialData={portfolio as any} />
      </div>
    </PageContainer>
  );
}
