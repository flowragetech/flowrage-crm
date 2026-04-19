import PageContainer from '@/components/layout/page-container';
import { prisma } from '@/lib/prisma';
import { TeamPageForm } from '@/features/cms/components/team-page-form';
import { TeamMembersClient } from '@/features/cms/components/team-members-client';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Team Management | CRM Core'
};

export const dynamic = 'force-dynamic';

export default async function TeamManagementPage() {
  const currentUser = await getCurrentUser();

  if (
    !currentUser ||
    !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(currentUser.role as string)
  ) {
    redirect('/dashboard/overview');
  }

  const [teamPage, members] = await Promise.all([
    prisma.teamPage.findFirst({
      include: { seoMetadata: true }
    }),
    prisma.teamMember.findMany({
      orderBy: [
        { isFeatured: 'desc' },
        { ordering: 'asc' },
        { createdAt: 'desc' }
      ]
    })
  ]);

  return (
    <PageContainer scrollable>
      <div className='space-y-8'>
        <div className='space-y-2'>
          <Heading
            title='Team Page'
            description='Manage the hero and intro content for your team page.'
          />
          <Separator />
        </div>

        <TeamPageForm initialData={teamPage as any} />

        <TeamMembersClient initialData={members as any} />
      </div>
    </PageContainer>
  );
}
