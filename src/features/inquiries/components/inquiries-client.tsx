'use client';

import { useState } from 'react';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Mail, Trash2, Eye, Archive } from 'lucide-react';
import { updateInquiryStatus, deleteInquiry } from '@/app/actions/inquiries';
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

interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: string;
  createdAt: Date;
}

interface InquiriesClientProps {
  initialData: Inquiry[];
}

export function InquiriesClient({ initialData }: InquiriesClientProps) {
  const router = useRouter();
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const getParsedFields = (inquiry: Inquiry | null) => {
    if (!inquiry || !inquiry.subject) {
      return {
        budget: '',
        mobile: '',
        cleanSubject: ''
      };
    }

    const parts = inquiry.subject.split('|').map((part) => part.trim());
    let budget = '';
    let mobile = '';
    const remaining: string[] = [];

    parts.forEach((part) => {
      const lower = part.toLowerCase();
      if (lower.startsWith('budget')) {
        const value = part.split(':')[1];
        budget = value ? value.trim() : '';
      } else if (lower.startsWith('mobile')) {
        const value = part.split(':')[1];
        mobile = value ? value.trim() : '';
      } else {
        remaining.push(part);
      }
    });

    return {
      budget,
      mobile,
      cleanSubject: remaining.join(' | ').trim()
    };
  };

  const onStatusUpdate = async (id: string, status: string) => {
    try {
      const result = await updateInquiryStatus(id, status);
      if (result.success) {
        toast.success(`Inquiry marked as ${status}`);
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to update status');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const onDelete = async (id: string) => {
    try {
      const result = await deleteInquiry(id);
      if (result.success) {
        toast.success('Inquiry deleted');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to delete inquiry');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleView = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setIsViewOpen(true);
    if (inquiry.status === 'unread') {
      onStatusUpdate(inquiry.id, 'read');
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-start justify-between'>
        <Heading
          title={`Inquiries (${initialData.length})`}
          description='Manage customer messages and leads from the website.'
        />
      </div>
      <Separator />

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className='h-24 text-center'>
                  No inquiries found.
                </TableCell>
              </TableRow>
            ) : (
              initialData.map((inquiry) => (
                <TableRow
                  key={inquiry.id}
                  className={
                    inquiry.status === 'unread' ? 'bg-muted/30 font-medium' : ''
                  }
                >
                  <TableCell className='text-xs'>
                    {format(new Date(inquiry.createdAt), 'MMM d, yyyy HH:mm')}
                  </TableCell>
                  <TableCell>
                    <div className='flex flex-col'>
                      <span>{inquiry.name}</span>
                      <span className='text-muted-foreground text-xs'>
                        {inquiry.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getParsedFields(inquiry).cleanSubject ||
                      inquiry.subject ||
                      'No Subject'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        inquiry.status === 'unread'
                          ? 'destructive'
                          : inquiry.status === 'read'
                            ? 'secondary'
                            : 'outline'
                      }
                    >
                      {inquiry.status}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex justify-end gap-2'>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => handleView(inquiry)}
                      >
                        <Eye className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => onStatusUpdate(inquiry.id, 'archived')}
                        title='Archive'
                      >
                        <Archive className='h-4 w-4' />
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
                              permanently delete the inquiry.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(inquiry.id)}
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

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className='max-w-3xl'>
          <DialogHeader>
            <div className='flex items-center justify-between'>
              <DialogTitle>Inquiry Details</DialogTitle>
              <Badge
                variant={
                  selectedInquiry?.status === 'unread'
                    ? 'destructive'
                    : selectedInquiry?.status === 'read'
                      ? 'secondary'
                      : 'outline'
                }
              >
                {selectedInquiry?.status}
              </Badge>
            </div>
            <DialogDescription>
              Received on{' '}
              {selectedInquiry &&
                format(new Date(selectedInquiry.createdAt), 'PPPP p')}
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-6 py-4'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
              <div className='space-y-1'>
                <div className='text-muted-foreground text-xs font-semibold uppercase'>
                  From
                </div>
                <p className='text-sm font-semibold'>{selectedInquiry?.name}</p>
                <p className='text-muted-foreground text-sm'>
                  {selectedInquiry?.email}
                </p>
              </div>
              <div className='space-y-1'>
                <div className='text-muted-foreground text-xs font-semibold uppercase'>
                  Budget
                </div>
                <p className='text-sm'>
                  {getParsedFields(selectedInquiry).budget || 'Not provided'}
                </p>
              </div>
              <div className='space-y-1'>
                <div className='text-muted-foreground text-xs font-semibold uppercase'>
                  Mobile
                </div>
                <p className='text-sm'>
                  {getParsedFields(selectedInquiry).mobile || 'Not provided'}
                </p>
              </div>
            </div>
            <Separator />
            <div className='space-y-2'>
              <div className='text-muted-foreground text-xs font-semibold uppercase'>
                Subject
              </div>
              <p className='text-sm font-medium'>
                {getParsedFields(selectedInquiry).cleanSubject ||
                  selectedInquiry?.subject ||
                  'Website Inquiry'}
              </p>
            </div>
            <div className='space-y-2'>
              <div className='text-muted-foreground text-xs font-semibold uppercase'>
                Message
              </div>
              <div className='bg-muted/50 rounded-md p-4 text-sm whitespace-pre-wrap'>
                {selectedInquiry?.message}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsViewOpen(false)}>
              Close
            </Button>
            <Button asChild>
              <a
                href={`mailto:${selectedInquiry?.email}?subject=Re: ${selectedInquiry?.subject || 'Inquiry'}`}
              >
                <Mail className='mr-2 h-4 w-4' /> Reply
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
