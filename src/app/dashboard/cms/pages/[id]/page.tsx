import PageContainer from '@/components/layout/page-container';
import { getStaticPageById, getStaticPages } from '@/app/actions/static-pages';
import { StaticPageForm } from '@/features/cms/components/static-page-form';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export const metadata = {
  title: 'Edit Static Page | CRM Core'
};

export default async function EditStaticPage({
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

  const [page, pages] = await Promise.all([
    getStaticPageById(id),
    getStaticPages()
  ]);

  if (!page) {
    notFound();
  }

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Edit Page'
            description='Update your static page details and settings.'
          />
        </div>
        <Separator />
        <StaticPageForm initialData={page as any} allPages={pages as any} />
      </div>
    </PageContainer>
  );
}
