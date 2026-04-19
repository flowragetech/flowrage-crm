import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { ImageSeoForm } from '@/features/franker/components/image-seo-form';
import { getImageSeoConfig } from '@/app/actions/franker';

export default async function ImageSeoPage() {
  const config = await getImageSeoConfig();

  return (
    <PageContainer scrollable>
      <div className='space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Image SEO'
            description='Automates Image SEO by adding ALT and Title tags to images.'
          />
        </div>
        <Separator />
        <ImageSeoForm initialConfig={config} />
      </div>
    </PageContainer>
  );
}
