'use client';

import * as React from 'react';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import {
  PortfolioTable,
  PortfolioWithSeo
} from '@/features/cms/components/portfolio-table';
import { deletePortfolio } from '@/app/actions/portfolio';
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

import { useRouter } from 'next/navigation';

interface PortfolioClientProps {
  initialData: PortfolioWithSeo[];
}

export function PortfolioClient({ initialData }: PortfolioClientProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [portfolioToDelete, setPortfolioToDelete] =
    React.useState<PortfolioWithSeo | null>(null);

  const onAdd = () => {
    router.push('/dashboard/cms/portfolio/new');
  };

  const onEdit = (portfolio: PortfolioWithSeo) => {
    router.push(`/dashboard/cms/portfolio/${portfolio.id}`);
  };

  const onDelete = (portfolio: PortfolioWithSeo) => {
    setPortfolioToDelete(portfolio);
    setIsDeleting(true);
  };

  const confirmDelete = async () => {
    if (!portfolioToDelete) return;

    try {
      const result = await deletePortfolio(
        portfolioToDelete.id,
        portfolioToDelete.seoMetadata.id
      );
      if (result.success) {
        toast.success('Project deleted successfully');
      } else {
        toast.error(result.error || 'Failed to delete project');
      }
    } catch (error) {
      toast.error('An error occurred while deleting');
    } finally {
      setIsDeleting(false);
      setPortfolioToDelete(null);
    }
  };

  return (
    <>
      <div className='flex items-start justify-between'>
        <Heading
          title={`Portfolio (${initialData.length})`}
          description='Manage your agency portfolio, case studies, and SEO optimization.'
        />
      </div>
      <Separator />

      <PortfolioTable
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
              This will permanently delete the project{' '}
              <span className='text-foreground font-bold'>
                "{portfolioToDelete?.title}"
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
