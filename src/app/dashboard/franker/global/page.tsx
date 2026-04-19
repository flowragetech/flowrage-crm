import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { GlobalSeoForm } from '@/features/seo/components/global-seo-form';
import { getGlobalSeo } from '@/app/actions/seo';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function FrankerGlobalSeo() {
  const currentUser = await getCurrentUser();

  if (
    !currentUser ||
    !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(currentUser.role as string)
  ) {
    redirect('/dashboard/overview');
  }

  const initialData = await getGlobalSeo();

  return (
    <PageContainer scrollable>
      <div className='space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='SEO Global Settings'
            description='Manage site-wide SEO metadata and configurations.'
          />
        </div>
        <Separator />
        <GlobalSeoForm initialData={initialData} />
      </div>
    </PageContainer>
  );
}
