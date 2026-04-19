import PageContainer from '@/components/layout/page-container';
import { getBlogPosts, getCategories, getTags } from '@/app/actions/blog';
import { BlogPostsClient } from '@/features/blog/components/blog-posts-client';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Blog Posts Management | CRM Core'
};

export const dynamic = 'force-dynamic';

export default async function BlogPostsManagement() {
  const currentUser = await getCurrentUser();

  if (
    !currentUser ||
    !['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'AUTHOR'].includes(
      currentUser.role as string
    )
  ) {
    redirect('/dashboard/overview');
  }

  const posts = await getBlogPosts();
  const categories = await getCategories();
  const tags = await getTags();

  return (
    <PageContainer scrollable>
      <div className='space-y-4'>
        <BlogPostsClient
          initialData={posts as any}
          categories={categories}
          tags={tags}
        />
      </div>
    </PageContainer>
  );
}
