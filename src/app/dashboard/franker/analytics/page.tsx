import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { AnalyticsView } from '@/features/franker/components/analytics-view';
import { getAnalyticsConfig } from '@/app/actions/franker';

export default async function AnalyticsPage() {
  const config = await getAnalyticsConfig();

  return (
    <PageContainer scrollable>
      <div className='space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Analytics'
            description='Track your SEO performance and website traffic.'
          />
        </div>
        <Separator />
        <AnalyticsView initialConfig={config} />
      </div>
    </PageContainer>
  );
}
