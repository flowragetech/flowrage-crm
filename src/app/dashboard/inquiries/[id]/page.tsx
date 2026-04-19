import PageContainer from '@/components/layout/page-container';
import { InquiryView } from '@/features/inquiries/components/inquiry-view';
import { getInquiryById } from '@/app/actions/inquiries';
import { getCurrentUser } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';

export const metadata = {
  title: 'View Inquiry | CRM Core'
};

export default async function ViewInquiryPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect('/dashboard/overview');
  }

  const inquiry = await getInquiryById(id);

  if (!inquiry) {
    notFound();
  }

  return (
    <PageContainer scrollable>
      <div className='max-w-4xl space-y-4'>
        <InquiryView inquiry={inquiry as any} />
      </div>
    </PageContainer>
  );
}
