import PageContainer from '@/components/layout/page-container';
import { StaticPageForm } from '@/features/cms/components/static-page-form';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { getStaticPages } from '@/app/actions/static-pages';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Add New Static Page | CRM Core'
};

export default async function NewStaticPage() {
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
      <div className='flex-1 space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Create New Page'
            description='Add a new static page to your agency website.'
          />
        </div>
        <Separator />
        <StaticPageForm allPages={pages as any} />
      </div>
    </PageContainer>
  );
}
