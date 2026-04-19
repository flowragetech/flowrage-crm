'use client';

import { Control } from 'react-hook-form';
import { SeoPanel } from '@/features/seo/components/seo-panel';

interface FrankerSeoPanelProps {
  control: Control<any>;
  namePrefix?: string;
}

export function FrankerSeoPanel({
  control,
  namePrefix = 'seoMetadata'
}: FrankerSeoPanelProps) {
  return (
    <SeoPanel
      control={control}
      namePrefix={namePrefix}
      title='SEO'
      description='Reusable search optimization tools for any content type.'
    />
  );
}
