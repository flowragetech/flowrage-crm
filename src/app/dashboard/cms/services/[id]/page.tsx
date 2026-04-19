import PageContainer from '@/components/layout/page-container';
import { getServiceById, getServiceCategories } from '@/app/actions/services';
import { ServiceForm } from '@/features/cms/components/service-form';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export const metadata = {
  title: 'Edit Service | CRM Core'
};

export default async function EditServicePage({
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

  const [service, categories] = await Promise.all([
    getServiceById(id),
    getServiceCategories()
  ]);

  if (!service) {
    notFound();
  }

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Edit Service'
            description='Update your service details and settings.'
          />
        </div>
        <Separator />
        <ServiceForm initialData={service as any} categories={categories} />
      </div>
    </PageContainer>
  );
}
