'use client';

import { useEffect } from 'react';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Mail, ArrowLeft } from 'lucide-react';
import { updateInquiryStatus } from '@/app/actions/inquiries';
import { useRouter } from 'next/navigation';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: string;
  createdAt: Date;
}

interface InquiryViewProps {
  inquiry: Inquiry;
}

export function InquiryView({ inquiry }: InquiryViewProps) {
  const router = useRouter();

  useEffect(() => {
    if (inquiry.status === 'unread') {
      updateInquiryStatus(inquiry.id, 'read');
    }
  }, [inquiry.id, inquiry.status]);

  const getParsedFields = (inquiry: Inquiry) => {
    if (!inquiry.subject) {
      return {
        budget: 'Not provided',
        mobile: 'Not provided',
        cleanSubject: 'Website Inquiry'
      };
    }

    const parts = inquiry.subject.split('|').map((part) => part.trim());
    let budget = 'Not provided';
    let mobile = 'Not provided';
    const remaining: string[] = [];

    parts.forEach((part) => {
      const lower = part.toLowerCase();
      if (lower.startsWith('budget')) {
        const value = part.split(':')[1];
        budget = value ? value.trim() : 'Not provided';
      } else if (lower.startsWith('mobile')) {
        const value = part.split(':')[1];
        mobile = value ? value.trim() : 'Not provided';
      } else {
        remaining.push(part);
      }
    });

    return {
      budget,
      mobile,
      cleanSubject: remaining.join(' | ').trim() || inquiry.subject
    };
  };

  const { budget, mobile, cleanSubject } = getParsedFields(inquiry);

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => router.push('/dashboard/inquiries')}
          >
            <ArrowLeft className='h-4 w-4' />
          </Button>
          <Heading
            title='Inquiry Details'
            description={`Received from ${inquiry.name}`}
          />
        </div>
        <Badge
          variant={
            inquiry.status === 'unread'
              ? 'destructive'
              : inquiry.status === 'read'
                ? 'secondary'
                : 'outline'
          }
          className='text-sm'
        >
          {inquiry.status}
        </Badge>
      </div>
      <Separator />

      <div className='bg-card rounded-lg border p-6 shadow-sm'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
          <div className='space-y-1.5'>
            <div className='text-muted-foreground text-xs font-bold tracking-wider uppercase'>
              From
            </div>
            <p className='text-base font-semibold'>{inquiry.name}</p>
            <p className='text-muted-foreground text-sm'>{inquiry.email}</p>
          </div>
          <div className='space-y-1.5'>
            <div className='text-muted-foreground text-xs font-bold tracking-wider uppercase'>
              Budget
            </div>
            <p className='text-sm font-medium'>{budget}</p>
          </div>
          <div className='space-y-1.5'>
            <div className='text-muted-foreground text-xs font-bold tracking-wider uppercase'>
              Mobile
            </div>
            <p className='text-sm font-medium'>{mobile}</p>
          </div>
        </div>

        <Separator className='my-8' />

        <div className='space-y-6'>
          <div className='space-y-1.5'>
            <div className='text-muted-foreground text-xs font-bold tracking-wider uppercase'>
              Subject
            </div>
            <p className='text-lg font-medium'>{cleanSubject}</p>
          </div>

          <div className='space-y-1.5'>
            <div className='text-muted-foreground text-xs font-bold tracking-wider uppercase'>
              Message
            </div>
            <div className='bg-muted/30 rounded-lg p-6 text-sm leading-relaxed whitespace-pre-wrap'>
              {inquiry.message}
            </div>
          </div>

          <div className='text-muted-foreground pt-4 text-xs italic'>
            Received on {format(new Date(inquiry.createdAt), 'PPPP p')}
          </div>
        </div>

        <div className='mt-10 flex justify-end gap-4'>
          <Button
            variant='outline'
            onClick={() => router.push('/dashboard/inquiries')}
          >
            Back to Inquiries
          </Button>
          <Button asChild className='gap-2'>
            <a
              href={`mailto:${inquiry.email}?subject=Re: ${inquiry.subject || 'Inquiry'}`}
            >
              <Mail className='h-4 w-4' /> Reply via Email
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
