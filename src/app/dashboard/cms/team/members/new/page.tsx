import PageContainer from '@/components/layout/page-container';
import { TeamMemberForm } from '@/features/cms/components/team-member-form';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Add New Team Member | CRM Core'
};

export default async function NewTeamMemberPage() {
  const currentUser = await getCurrentUser();

  if (
    !currentUser ||
    !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(currentUser.role as string)
  ) {
    redirect('/dashboard/overview');
  }

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Add New Team Member'
            description='Add a new member to your team.'
          />
        </div>
        <Separator />
        <TeamMemberForm />
      </div>
    </PageContainer>
  );
}
