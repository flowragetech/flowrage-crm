import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { InstantIndexingForm } from '@/features/franker/components/instant-indexing-form';
import { getIndexingConfig } from '@/app/actions/franker';

export default async function InstantIndexingPage() {
  const config = await getIndexingConfig();

  return (
    <PageContainer scrollable>
      <div className='space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Instant Indexing'
            description='Notify search engines immediately when you publish or update content.'
          />
        </div>
        <Separator />
        <InstantIndexingForm initialConfig={config} />
      </div>
    </PageContainer>
  );
}
