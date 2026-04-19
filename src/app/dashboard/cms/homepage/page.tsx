import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { HomepageForm } from '@/features/cms/components/homepage-form';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function HomepageManagement() {
  const currentUser = await getCurrentUser();

  if (
    !currentUser ||
    !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(currentUser.role as string)
  ) {
    redirect('/dashboard/overview');
  }

  let homepage = null;

  homepage = await prisma.homepage.findFirst({
    include: { seoMetadata: true }
  });

  return (
    <PageContainer scrollable>
      <div className='space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Homepage Management'
            description='Manage your homepage content and SEO.'
          />
        </div>
        <Separator />
        <HomepageForm initialData={homepage as any} />
      </div>
    </PageContainer>
  );
}
