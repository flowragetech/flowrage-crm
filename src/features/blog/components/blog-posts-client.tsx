'use client';

import * as React from 'react';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import {
  BlogPostsTable,
  BlogPostWithCategoryAndSeo
} from '@/features/blog/components/blog-posts-table';
import { deleteBlogPost, updateBlogPostPublished } from '@/app/actions/blog';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Category } from '@prisma/client';

import { useRouter } from 'next/navigation';

interface BlogPostsClientProps {
  initialData: BlogPostWithCategoryAndSeo[];
  categories: Category[];
  tags: any[];
}

export function BlogPostsClient({
  initialData,
  categories,
  tags
}: BlogPostsClientProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [postToDelete, setPostToDelete] =
    React.useState<BlogPostWithCategoryAndSeo | null>(null);

  const onAdd = () => {
    router.push('/dashboard/blog/posts/new');
  };

  const onEdit = (post: BlogPostWithCategoryAndSeo) => {
    router.push(`/dashboard/blog/posts/${post.id}`);
  };

  const onDelete = (post: BlogPostWithCategoryAndSeo) => {
    setPostToDelete(post);
    setIsDeleting(true);
  };

  const onTogglePublished = async (post: BlogPostWithCategoryAndSeo) => {
    try {
      const result = await updateBlogPostPublished(post.id, !post.published);
      if (result.success) {
        toast.success(
          !post.published ? 'Post published successfully' : 'Post set to draft'
        );
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to update publish status');
      }
    } catch {
      toast.error('An error occurred while updating publish status');
    }
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;

    try {
      const result = await deleteBlogPost(
        postToDelete.id,
        postToDelete.seoMetadata.id
      );
      if (result.success) {
        toast.success('Post deleted successfully');
      } else {
        toast.error(result.error || 'Failed to delete post');
      }
    } catch (error) {
      toast.error('An error occurred while deleting');
    } finally {
      setIsDeleting(false);
      setPostToDelete(null);
    }
  };

  return (
    <>
      <div className='flex items-start justify-between'>
        <Heading
          title={`Blog Posts (${initialData.length})`}
          description={`Manage blog posts, ${categories.length} categories, and ${tags.length} tags.`}
        />
      </div>
      <Separator />

      <BlogPostsTable
        data={initialData}
        onAdd={onAdd}
        onEdit={onEdit}
        onDelete={onDelete}
        onTogglePublished={onTogglePublished}
      />

      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the post{' '}
              <span className='text-foreground font-bold'>
                "{postToDelete?.title}"
              </span>{' '}
              and its associated SEO metadata. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
