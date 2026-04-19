import PageContainer from '@/components/layout/page-container';
import { getInquiries } from '@/app/actions/inquiries';
import { InquiriesClient } from '@/features/inquiries/components/inquiries-client';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Inquiries Management | CRM Core'
};

export const dynamic = 'force-dynamic';

export default async function InquiriesPage() {
  const currentUser = await getCurrentUser();

  if (
    !currentUser ||
    !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(currentUser.role as string)
  ) {
    redirect('/dashboard/overview');
  }

  const inquiries = await getInquiries();

  return (
    <PageContainer scrollable>
      <div className='space-y-4'>
        <InquiriesClient initialData={inquiries as any} />
      </div>
    </PageContainer>
  );
}
