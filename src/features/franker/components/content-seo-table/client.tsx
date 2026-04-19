'use client';

import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { SeoContentItem } from '@/app/actions/franker-content-seo';
import { ContentSeoTable } from './content-seo-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ContentSeoClientProps {
  data: SeoContentItem[];
}

export function ContentSeoClient({ data }: ContentSeoClientProps) {
  // Calculate quick stats
  const total = data.length;
  const good = data.filter((item) => {
    const seo = item.seoMetadata;
    return (
      seo?.metaTitle && seo?.metaDescription && seo?.ogImage && seo?.keywords
    );
  }).length;
  const poor = data.filter((item) => {
    const seo = item.seoMetadata;
    return !seo?.metaTitle || !seo?.metaDescription;
  }).length;
  const fair = total - good - poor;

  return (
    <>
      <div className='flex items-start justify-between'>
        <Heading
          title={`Content SEO Audit (${total})`}
          description='Manage and audit SEO metadata for all your content.'
        />
      </div>
      <Separator />

      <div className='grid gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Good SEO</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>{good}</div>
            <p className='text-muted-foreground text-xs'>Complete metadata</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Fair SEO</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-yellow-600'>{fair}</div>
            <p className='text-muted-foreground text-xs'>
              Missing some optional fields
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Poor SEO</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-red-600'>{poor}</div>
            <p className='text-muted-foreground text-xs'>
              Missing title or description
            </p>
          </CardContent>
        </Card>
      </div>

      <ContentSeoTable data={data} />
    </>
  );
}
