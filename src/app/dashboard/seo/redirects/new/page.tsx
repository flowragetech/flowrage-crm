import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { RedirectForm } from '@/features/seo/components/redirect-form';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Add New Redirect | CRM Core'
};

export default async function NewRedirectPage() {
  const currentUser = await getCurrentUser();

  if (
    !currentUser ||
    !['SUPER_ADMIN', 'ADMIN'].includes(currentUser.role as string)
  ) {
    redirect('/dashboard/overview');
  }

  return (
    <PageContainer scrollable>
      <div className='max-w-2xl space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Add New Redirect'
            description='Create a new 301 or 302 redirect.'
          />
        </div>
        <Separator />
        <div className='rounded-md border p-6'>
          <RedirectForm />
        </div>
      </div>
    </PageContainer>
  );
}
