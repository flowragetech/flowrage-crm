import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { UserForm } from '@/features/users/components/user-form';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';

export const metadata = {
  title: 'Add New User | CRM Core'
};

export default async function NewUserPage() {
  const currentUser = await getCurrentUser();

  if (
    !currentUser ||
    (currentUser.role !== Role.ADMIN && currentUser.role !== Role.SUPER_ADMIN)
  ) {
    redirect('/dashboard/overview');
  }

  return (
    <PageContainer scrollable>
      <div className='max-w-4xl space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Add New User'
            description='Create a new admin user account.'
          />
        </div>
        <Separator />
        <div className='max-w-2xl rounded-md border p-6'>
          <UserForm />
        </div>
      </div>
    </PageContainer>
  );
}
