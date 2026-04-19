'use client';

import * as React from 'react';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import {
  StaticPagesTable,
  StaticPageWithSeo
} from '@/features/cms/components/static-pages-table';
import { deleteStaticPage } from '@/app/actions/static-pages';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
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

interface StaticPagesClientProps {
  initialData: StaticPageWithSeo[];
}

export function StaticPagesClient({ initialData }: StaticPagesClientProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [pageToDelete, setPageToDelete] =
    React.useState<StaticPageWithSeo | null>(null);

  const onAdd = () => {
    router.push('/dashboard/cms/pages/new');
  };

  const onEdit = (page: StaticPageWithSeo) => {
    router.push(`/dashboard/cms/pages/${page.id}`);
  };

  const onDelete = (page: StaticPageWithSeo) => {
    setPageToDelete(page);
    setIsDeleting(true);
  };

  const confirmDelete = async () => {
    if (!pageToDelete) return;

    try {
      const result = await deleteStaticPage(
        pageToDelete.id,
        pageToDelete.seoMetadata.id
      );
      if (result.success) {
        toast.success('Page deleted successfully');
      } else {
        toast.error(result.error || 'Failed to delete page');
      }
    } catch (error) {
      toast.error('An error occurred while deleting');
    } finally {
      setIsDeleting(false);
      setPageToDelete(null);
    }
  };

  return (
    <>
      <div className='flex items-start justify-between'>
        <Heading
          title={`Static Pages (${initialData.length})`}
          description='Manage your website static pages, about, contact, and SEO optimization.'
        />
      </div>
      <Separator />

      <StaticPagesTable
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
              This will permanently delete the page{' '}
              <span className='text-foreground font-bold'>
                "{pageToDelete?.title}"
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
