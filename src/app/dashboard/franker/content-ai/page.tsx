import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { ContentAiForm } from '@/features/franker/components/content-ai-form';
import { getContentAiConfig } from '@/app/actions/franker';

export default async function ContentAiPage() {
  const config = await getContentAiConfig();

  return (
    <PageContainer scrollable>
      <div className='space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Content AI'
            description='AI-powered content generation and optimization tools.'
          />
        </div>
        <Separator />
        <ContentAiForm initialConfig={config} />
      </div>
    </PageContainer>
  );
}
