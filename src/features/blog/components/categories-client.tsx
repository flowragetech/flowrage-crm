'use client';

import * as React from 'react';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { CategoriesTable } from '@/features/blog/components/categories-table';
import { CategoryForm } from '@/features/blog/components/category-form';
import { deleteCategory } from '@/app/actions/blog';
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

interface CategoriesClientProps {
  initialData: Category[];
}

export function CategoriesClient({ initialData }: CategoriesClientProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [categoryToDelete, setCategoryToDelete] =
    React.useState<Category | null>(null);

  const onAdd = () => {
    router.push('/dashboard/blog/categories/new');
  };

  const onEdit = (category: Category) => {
    router.push(`/dashboard/blog/categories/${category.id}`);
  };

  const onDelete = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleting(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      const result = await deleteCategory(categoryToDelete.id);
      if (result.success) {
        toast.success('Category deleted successfully');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to delete category');
      }
    } catch (error) {
      toast.error('An error occurred while deleting');
    } finally {
      setIsDeleting(false);
      setCategoryToDelete(null);
    }
  };

  return (
    <>
      <div className='flex items-start justify-between'>
        <Heading
          title={`Categories (${initialData.length})`}
          description='Manage your blog post categories.'
        />
      </div>
      <Separator />

      <CategoriesTable
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
              This will permanently delete the category{' '}
              <span className='text-foreground font-bold'>
                "{categoryToDelete?.name}"
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
