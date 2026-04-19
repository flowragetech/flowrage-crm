import PageContainer from '@/components/layout/page-container';
import { getMediaItems } from '@/app/actions/media';
import { WordPressMediaLibrary } from '@/features/media/components/wp-media-library';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function MediaManagement() {
  const currentUser = await getCurrentUser();

  if (
    !currentUser ||
    !['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'AUTHOR'].includes(
      currentUser.role as string
    )
  ) {
    redirect('/dashboard/overview');
  }

  const mediaItems = await getMediaItems();

  return (
    <PageContainer scrollable>
      <div className='space-y-4'>
        <WordPressMediaLibrary initialItems={mediaItems} />
      </div>
    </PageContainer>
  );
}
