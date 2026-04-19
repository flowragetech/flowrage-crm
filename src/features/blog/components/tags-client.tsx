'use client';

import * as React from 'react';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { TagsTable } from '@/features/blog/components/tags-table';
import { TagForm } from '@/features/blog/components/tag-form';
import { deleteTag } from '@/app/actions/blog';
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
import { Tag } from '@prisma/client';
import { useRouter } from 'next/navigation';

interface TagsClientProps {
  initialData: Tag[];
}

export function TagsClient({ initialData }: TagsClientProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [tagToDelete, setTagToDelete] = React.useState<Tag | null>(null);

  const onAdd = () => {
    router.push('/dashboard/blog/tags/new');
  };

  const onEdit = (tag: Tag) => {
    router.push(`/dashboard/blog/tags/${tag.id}`);
  };

  const onDelete = (tag: Tag) => {
    setTagToDelete(tag);
    setIsDeleting(true);
  };

  const confirmDelete = async () => {
    if (!tagToDelete) return;

    try {
      const result = await deleteTag(tagToDelete.id);
      if (result.success) {
        toast.success('Tag deleted successfully');
      } else {
        toast.error(result.error || 'Failed to delete tag');
      }
    } catch (error) {
      toast.error('An error occurred while deleting');
    } finally {
      setIsDeleting(false);
      setTagToDelete(null);
    }
  };

  return (
    <>
      <div className='flex items-start justify-between'>
        <Heading
          title={`Tags (${initialData.length})`}
          description='Manage your blog post tags.'
        />
      </div>
      <Separator />

      <TagsTable
        data={initialData}
        onAdd={onAdd}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the tag{' '}
              <span className='text-foreground font-bold'>
                "{tagToDelete?.name}"
              </span>{' '}
              and remove it from any associated posts. This action cannot be
              undone.
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
