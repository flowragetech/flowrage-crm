import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { TagForm } from '@/features/blog/components/tag-form';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Add New Tag | CRM Core'
};

export default async function NewTagPage() {
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
            title='Add New Tag'
            description='Create a new tag for your blog posts.'
          />
        </div>
        <Separator />
        <TagForm />
      </div>
    </PageContainer>
  );
}
