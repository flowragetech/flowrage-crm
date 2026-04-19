import PageContainer from '@/components/layout/page-container';
import { getUsers } from '@/app/actions/users';
import { UsersClient } from '@/features/users/components/users-client';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'User Management | CRM Core'
};

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const currentUser = await getCurrentUser();

  if (
    !currentUser ||
    !['ADMIN', 'SUPER_ADMIN'].includes(currentUser.role as string)
  ) {
    redirect('/dashboard/overview');
  }

  const users = await getUsers();

  return (
    <PageContainer scrollable>
      <div className='space-y-4'>
        <UsersClient initialData={users as any} />
      </div>
    </PageContainer>
  );
}
