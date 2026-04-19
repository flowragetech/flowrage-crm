import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { LinkCounterView } from '@/features/franker/components/link-counter-view';

export default function LinkCounterPage() {
  return (
    <PageContainer scrollable>
      <div className='space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Link Counter'
            description='Analyze internal and external links in your content.'
          />
        </div>
        <Separator />
        <LinkCounterView />
      </div>
    </PageContainer>
  );
}
