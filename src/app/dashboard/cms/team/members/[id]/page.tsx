import PageContainer from '@/components/layout/page-container';
import { getTeamMemberById } from '@/app/actions/cms';
import { TeamMemberForm } from '@/features/cms/components/team-member-form';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export const metadata = {
  title: 'Edit Team Member | CRM Core'
};

export default async function EditTeamMemberPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const currentUser = await getCurrentUser();

  if (
    !currentUser ||
    !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(currentUser.role as string)
  ) {
    redirect('/dashboard/overview');
  }

  const member = await getTeamMemberById(id);

  if (!member) {
    notFound();
  }

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Edit Team Member'
            description='Update team member details.'
          />
        </div>
        <Separator />
        <TeamMemberForm initialData={member} />
      </div>
    </PageContainer>
  );
}
