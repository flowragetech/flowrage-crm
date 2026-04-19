import PageContainer from '@/components/layout/page-container';
import { getBlogPostById, getCategories, getTags } from '@/app/actions/blog';
import { BlogPostForm } from '@/features/blog/components/blog-post-form';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export const metadata = {
  title: 'Edit Blog Post | CRM Core'
};

export default async function EditBlogPostPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const currentUser = await getCurrentUser();

  if (
    !currentUser ||
    !['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'AUTHOR'].includes(
      currentUser.role as string
    )
  ) {
    redirect('/dashboard/overview');
  }

  const post = await getBlogPostById(id);
  const categories = await getCategories();
  const tags = await getTags();

  if (!post) {
    notFound();
  }

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Edit Post'
            description='Update your blog post content and settings.'
          />
        </div>
        <Separator />
        <BlogPostForm initialData={post} categories={categories} tags={tags} />
      </div>
    </PageContainer>
  );
}
