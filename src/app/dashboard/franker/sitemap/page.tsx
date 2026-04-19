import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { SitemapConfigForm } from '@/features/franker/components/sitemap-config-form';
import { getSitemapConfig } from '@/app/actions/franker';

export default async function SitemapPage() {
  const config = await getSitemapConfig();

  return (
    <PageContainer scrollable>
      <div className='space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='XML Sitemap'
            description='Generates XML Sitemap for your website to help search engines index your content.'
          />
        </div>
        <Separator />
        <SitemapConfigForm initialConfig={config} />
      </div>
    </PageContainer>
  );
}
