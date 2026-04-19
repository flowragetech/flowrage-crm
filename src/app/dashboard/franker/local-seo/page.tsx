import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { LocalSeoForm } from '@/features/franker/components/local-seo-form';
import { getLocalSeoConfig } from '@/app/actions/franker';

export default async function LocalSeoPage() {
  const config = await getLocalSeoConfig();

  return (
    <PageContainer scrollable>
      <div className='space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Local SEO'
            description='Optimize your site for local search results and Google Maps.'
          />
        </div>
        <Separator />
        <LocalSeoForm initialConfig={config} />
      </div>
    </PageContainer>
  );
}
