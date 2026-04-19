'use client';

import * as React from 'react';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { TagsTable } from '@/features/blog/components/tags-table';
import { TagForm } from '@/features/blog/components/tag-form';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer';
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

interface TagsClientProps {
  initialData: Tag[];
}

export function TagsClient({ initialData }: TagsClientProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedTag, setSelectedTag] = React.useState<Tag | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [tagToDelete, setTagToDelete] = React.useState<Tag | null>(null);

  const onAdd = () => {
    setSelectedTag(null);
    setIsOpen(true);
  };

  const onEdit = (tag: Tag) => {
    setSelectedTag(tag);
    setIsOpen(true);
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

      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent>
          <div className='mx-auto w-full max-w-lg'>
            <DrawerHeader>
              <DrawerTitle>
                {selectedTag ? 'Edit Tag' : 'Add New Tag'}
              </DrawerTitle>
              <DrawerDescription>
                {selectedTag
                  ? 'Update the tag name and slug.'
                  : 'Create a new tag for your blog posts.'}
              </DrawerDescription>
            </DrawerHeader>
            <div className='p-4 pb-0'>
              <TagForm
                initialData={selectedTag}
                onSuccess={() => setIsOpen(false)}
              />
            </div>
          </div>
        </DrawerContent>
      </Drawer>

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
