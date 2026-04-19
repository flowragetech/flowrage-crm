import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { UpdatesClient } from '@/features/settings/components/updates-client';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function UpdatesPage() {
  const currentUser = await getCurrentUser();

  if (
    !currentUser ||
    (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')
  ) {
    return (
      <PageContainer scrollable>
        <div className='space-y-4'>
          <div className='flex items-start justify-between'>
            <Heading
              title='Access Denied'
              description='You do not have permission to manage system updates.'
            />
          </div>
          <Separator />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer scrollable>
      <div className='space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='System Updates'
            description='Manage version checks, safe update runs, backups, and restart requirements.'
          />
        </div>
        <Separator />
        <UpdatesClient />
      </div>
    </PageContainer>
  );
}
