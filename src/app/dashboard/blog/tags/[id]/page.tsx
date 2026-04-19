import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { TagForm } from '@/features/blog/components/tag-form';
import { getTagById } from '@/app/actions/blog';
import { getCurrentUser } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';

export const metadata = {
  title: 'Edit Tag | CRM Core'
};

export default async function EditTagPage({
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

  const tag = await getTagById(id);

  if (!tag) {
    notFound();
  }

  return (
    <PageContainer scrollable>
      <div className='max-w-4xl space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading title='Edit Tag' description='Update the tag details.' />
        </div>
        <Separator />
        <TagForm initialData={tag as any} />
      </div>
    </PageContainer>
  );
}
