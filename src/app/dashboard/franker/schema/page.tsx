import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { SchemaBuilderForm } from '@/features/franker/components/schema-builder-form';
import { getGlobalSeo } from '@/app/actions/seo';

export default async function SchemaPage() {
  const initialData = await getGlobalSeo();

  return (
    <PageContainer scrollable>
      <div className='space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Schema (Structured Data)'
            description='Adds structured data to your content to help search engines understand it.'
          />
        </div>
        <Separator />
        <SchemaBuilderForm initialData={initialData} />
      </div>
    </PageContainer>
  );
}
