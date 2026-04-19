import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { SiteSettingsForm } from '@/features/settings/components/site-settings-form';
import { getCurrentUser } from '@/lib/auth';
import { getSiteSettings } from '@/lib/site-settings';

export const dynamic = 'force-dynamic';

export default async function SiteSettingsPage() {
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
              description='You do not have permission to manage site settings.'
            />
          </div>
          <Separator />
        </div>
      </PageContainer>
    );
  }

  const siteSettings = await getSiteSettings();

  return (
    <PageContainer scrollable>
      <div className='space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Site Settings'
            description='Manage white-label branding, module defaults, and operational settings.'
          />
        </div>
        <Separator />
        <SiteSettingsForm initialData={siteSettings} />
      </div>
    </PageContainer>
  );
}
