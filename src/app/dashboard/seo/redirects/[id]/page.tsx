import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { RedirectForm } from '@/features/seo/components/redirect-form';
import { getRedirectById } from '@/app/actions/seo';
import { getCurrentUser } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';

export const metadata = {
  title: 'Edit Redirect | CRM Core'
};

export default async function EditRedirectPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const currentUser = await getCurrentUser();

  if (
    !currentUser ||
    !['SUPER_ADMIN', 'ADMIN'].includes(currentUser.role as string)
  ) {
    redirect('/dashboard/overview');
  }

  const redirectData = await getRedirectById(id);

  if (!redirectData) {
    notFound();
  }

  return (
    <PageContainer scrollable>
      <div className='max-w-2xl space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Edit Redirect'
            description='Update the redirect details.'
          />
        </div>
        <Separator />
        <div className='rounded-md border p-6'>
          <RedirectForm initialData={redirectData} />
        </div>
      </div>
    </PageContainer>
  );
}
