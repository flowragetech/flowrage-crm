import PageContainer from '@/components/layout/page-container';
import { ContentSeoClient } from '@/features/franker/components/content-seo-table/client';
import { getAllContentForSeo } from '@/app/actions/franker-content-seo';

export const metadata = {
  title: 'Content SEO Audit | Franker SEO'
};

export default async function ContentSeoPage() {
  const data = await getAllContentForSeo();

  return (
    <PageContainer scrollable>
      <div className='space-y-4'>
        <ContentSeoClient data={data} />
      </div>
    </PageContainer>
  );
}
