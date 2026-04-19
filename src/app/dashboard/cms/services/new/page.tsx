import PageContainer from '@/components/layout/page-container';
import { ServiceForm } from '@/features/cms/components/service-form';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { getCurrentUser } from '@/lib/auth';
import { getServiceCategories } from '@/app/actions/services';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Add New Service | CRM Core'
};

export default async function NewServicePage() {
  const currentUser = await getCurrentUser();

  if (
    !currentUser ||
    !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(currentUser.role as string)
  ) {
    redirect('/dashboard/overview');
  }

  const categories = await getServiceCategories();

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Create New Service'
            description='Add a new service offering to your agency website.'
          />
        </div>
        <Separator />
        <ServiceForm categories={categories} />
      </div>
    </PageContainer>
  );
}
