import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { UserForm } from '@/features/users/components/user-form';
import { getUserById } from '@/app/actions/users';
import { getCurrentUser } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';
import { Role } from '@prisma/client';

export const metadata = {
  title: 'Edit User | CRM Core'
};

export default async function EditUserPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const currentUser = await getCurrentUser();

  if (
    !currentUser ||
    (currentUser.role !== Role.ADMIN && currentUser.role !== Role.SUPER_ADMIN)
  ) {
    redirect('/dashboard/overview');
  }

  const user = await getUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <PageContainer scrollable>
      <div className='max-w-4xl space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Edit User'
            description='Update user account details.'
          />
        </div>
        <Separator />
        <div className='max-w-2xl rounded-md border p-6'>
          <UserForm initialData={user} />
        </div>
      </div>
    </PageContainer>
  );
}
