'use client';

import * as React from 'react';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { CategoriesTable } from '@/features/blog/components/categories-table';
import { CategoryForm } from '@/features/blog/components/category-form';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
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

interface CategoriesClientProps {
  initialData: Category[];
}

export function CategoriesClient({ initialData }: CategoriesClientProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] =
    React.useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [categoryToDelete, setCategoryToDelete] =
    React.useState<Category | null>(null);

  const onAdd = () => {
    setSelectedCategory(null);
    setIsOpen(true);
  };

  const onEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsOpen(true);
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

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className='sm:max-w-[400px]'>
          <SheetHeader>
            <SheetTitle>
              {selectedCategory ? 'Edit Category' : 'Add New Category'}
            </SheetTitle>
            <SheetDescription>
              {selectedCategory
                ? 'Update the category name and slug.'
                : 'Create a new category for your blog posts.'}
            </SheetDescription>
          </SheetHeader>
          <div className='px-4 py-6'>
            <CategoryForm
              initialData={selectedCategory}
              onSuccess={() => setIsOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>

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
