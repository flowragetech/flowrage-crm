import PageContainer from '@/components/layout/page-container';
import { getTags } from '@/app/actions/blog';
import { TagsClient } from '@/features/blog/components/tags-client';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Blog Tags Management | CRM Core'
};

export const dynamic = 'force-dynamic';

export default async function TagsManagement() {
  const currentUser = await getCurrentUser();

  if (
    !currentUser ||
    !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(currentUser.role as string)
  ) {
    redirect('/dashboard/overview');
  }

  const tags = await getTags();

  return (
    <PageContainer scrollable>
      <div className='space-y-4'>
        <TagsClient initialData={tags} />
      </div>
    </PageContainer>
  );
}
