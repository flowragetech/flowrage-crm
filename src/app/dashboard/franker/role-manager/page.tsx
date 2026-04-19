import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { RoleManagerForm } from '@/features/franker/components/role-manager-form';
import { getRoleManagerConfig } from '@/app/actions/franker';

export default async function RoleManagerPage() {
  const config = await getRoleManagerConfig();

  return (
    <PageContainer scrollable>
      <div className='space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Role Manager'
            description='Manage permissions for SEO tools and modules.'
          />
        </div>
        <Separator />
        <RoleManagerForm initialConfig={config} />
      </div>
    </PageContainer>
  );
}
