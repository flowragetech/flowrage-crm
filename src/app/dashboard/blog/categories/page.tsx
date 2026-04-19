import PageContainer from '@/components/layout/page-container';
import { getCategories } from '@/app/actions/blog';
import { CategoriesClient } from '@/features/blog/components/categories-client';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Blog Categories Management | CRM Core'
};

export const dynamic = 'force-dynamic';

export default async function CategoriesManagement() {
  const currentUser = await getCurrentUser();

  if (
    !currentUser ||
    !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(currentUser.role as string)
  ) {
    redirect('/dashboard/overview');
  }

  const categories = await getCategories();

  return (
    <PageContainer scrollable>
      <div className='space-y-4'>
        <CategoriesClient initialData={categories} />
      </div>
    </PageContainer>
  );
}
