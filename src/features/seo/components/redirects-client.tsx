'use client';

import { useState } from 'react';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Edit } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { RedirectForm } from './redirect-form';
import { deleteRedirect } from '@/app/actions/seo';
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
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';

interface Redirect {
  id: string;
  source: string;
  destination: string;
  statusCode: number;
  isActive: boolean;
  createdAt: Date;
}

interface RedirectsClientProps {
  initialData: Redirect[];
}

export function RedirectsClient({ initialData }: RedirectsClientProps) {
  const router = useRouter();

  const onDelete = async (id: string) => {
    try {
      const result = await deleteRedirect(id);
      if (result.success) {
        toast.success('Redirect deleted');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to delete redirect');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-start justify-between'>
        <Heading
          title={`SEO Redirects (${initialData.length})`}
          description='Manage 301 and 302 redirects for your site.'
        />
        <Button
          size='sm'
          onClick={() => router.push('/dashboard/seo/redirects/new')}
        >
          <Plus className='mr-2 h-4 w-4' /> Add Redirect
        </Button>
      </div>
      <Separator />

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className='h-24 text-center'>
                  No redirects found.
                </TableCell>
              </TableRow>
            ) : (
              initialData.map((redirect) => (
                <TableRow key={redirect.id}>
                  <TableCell className='font-mono text-sm'>
                    {redirect.source}
                  </TableCell>
                  <TableCell className='font-mono text-sm'>
                    {redirect.destination}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        redirect.statusCode === 301 ? 'default' : 'secondary'
                      }
                    >
                      {redirect.statusCode}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={redirect.isActive ? 'default' : 'outline'}>
                      {redirect.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex justify-end gap-2'>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() =>
                          router.push(`/dashboard/seo/redirects/${redirect.id}`)
                        }
                      >
                        <Edit className='h-4 w-4' />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant='ghost' size='icon'>
                            <Trash2 className='text-destructive h-4 w-4' />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the redirect.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(redirect.id)}
                              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
