import PageContainer from '@/components/layout/page-container';
import { getCategories, getTags } from '@/app/actions/blog';
import { BlogPostForm } from '@/features/blog/components/blog-post-form';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Add New Blog Post | CRM Core'
};

export const dynamic = 'force-dynamic';

export default async function NewBlogPostPage() {
  const currentUser = await getCurrentUser();

  if (
    !currentUser ||
    !['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'AUTHOR'].includes(
      currentUser.role as string
    )
  ) {
    redirect('/dashboard/overview');
  }

  const categories = await getCategories();
  const tags = await getTags();

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Create New Post'
            description='Add a new blog post to your website.'
          />
        </div>
        <Separator />
        <BlogPostForm categories={categories} tags={tags} />
      </div>
    </PageContainer>
  );
}
