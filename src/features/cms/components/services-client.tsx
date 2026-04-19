'use client';

import * as React from 'react';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import {
  ServicesTable,
  ServiceWithSeo
} from '@/features/cms/components/services-table';
import { deleteService } from '@/app/actions/services';
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

interface ServicesClientProps {
  initialData: ServiceWithSeo[];
}

export function ServicesClient({ initialData }: ServicesClientProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [serviceToDelete, setServiceToDelete] =
    React.useState<ServiceWithSeo | null>(null);

  const onAdd = () => {
    router.push('/dashboard/cms/services/new');
  };

  const onEdit = (service: ServiceWithSeo) => {
    router.push(`/dashboard/cms/services/${service.id}`);
  };

  const onDelete = (service: ServiceWithSeo) => {
    setServiceToDelete(service);
    setIsDeleting(true);
  };

  const confirmDelete = async () => {
    if (!serviceToDelete) return;

    try {
      const result = await deleteService(
        serviceToDelete.id,
        serviceToDelete.seoMetadata.id
      );
      if (result.success) {
        toast.success('Service deleted successfully');
      } else {
        toast.error(result.error || 'Failed to delete service');
      }
    } catch (error) {
      toast.error('An error occurred while deleting');
    } finally {
      setIsDeleting(false);
      setServiceToDelete(null);
    }
  };

  return (
    <>
      <div className='flex items-start justify-between'>
        <Heading
          title={`Services (${initialData.length})`}
          description='Manage your agency services, content, and SEO optimization.'
        />
      </div>
      <Separator />

      <ServicesTable
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
              This will permanently delete the service{' '}
              <span className='text-foreground font-bold'>
                "{serviceToDelete?.name}"
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
