import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { CategoryForm } from '@/features/blog/components/category-form';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Add New Category | CRM Core'
};

export default async function NewCategoryPage() {
  const currentUser = await getCurrentUser();

  if (
    !currentUser ||
    !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(currentUser.role as string)
  ) {
    redirect('/dashboard/overview');
  }

  return (
    <PageContainer scrollable>
      <div className='max-w-4xl space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Add New Category'
            description='Create a new category for your blog posts.'
          />
        </div>
        <Separator />
        <CategoryForm />
      </div>
    </PageContainer>
  );
}
