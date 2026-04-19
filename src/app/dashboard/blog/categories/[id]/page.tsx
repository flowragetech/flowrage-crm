import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { CategoryForm } from '@/features/blog/components/category-form';
import { getCategoryById } from '@/app/actions/blog';
import { getCurrentUser } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';

export const metadata = {
  title: 'Edit Category | CRM Core'
};

export default async function EditCategoryPage({
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

  const category = await getCategoryById(id);

  if (!category) {
    notFound();
  }

  return (
    <PageContainer scrollable>
      <div className='max-w-4xl space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Edit Category'
            description='Update the category details.'
          />
        </div>
        <Separator />
        <CategoryForm initialData={category as any} />
      </div>
    </PageContainer>
  );
}
