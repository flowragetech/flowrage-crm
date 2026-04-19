'use client';

import { useEffect, useMemo, useState } from 'react';
import { Control, useWatch } from 'react-hook-form';
import { Monitor, Link2, Smartphone, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { MediaPicker } from '@/features/media/components/media-picker';
import { analyzeSeo } from '@/features/seo/utils/analyze-seo';

interface SeoPanelProps {
  control: Control<any>;
  namePrefix?: string;
  contentFieldName?: string;
  slugFieldName?: string;
  title?: string;
  description?: string;
}

export function SeoPanel({
  control,
  namePrefix = 'seoMetadata',
  contentFieldName = 'content',
  slugFieldName = 'slug',
  title = 'SEO',
  description = 'Manage search metadata, schema, and share previews.'
}: SeoPanelProps) {
  const [activeTab, setActiveTab] = useState('general');
  const [device, setDevice] = useState<'mobile' | 'desktop'>('desktop');

  const getFieldName = (field: string) =>
    namePrefix ? `${namePrefix}.${field}` : field;

  const metaTitle =
    useWatch({ control, name: getFieldName('metaTitle') }) || '';
  const metaDescription =
    useWatch({ control, name: getFieldName('metaDescription') }) || '';
  const focusKeyword =
    useWatch({ control, name: getFieldName('keywords') }) || '';
  const canonicalUrl =
    useWatch({ control, name: getFieldName('canonical') }) || '';
  const ogImage = useWatch({ control, name: getFieldName('ogImage') }) || '';
  const schemaJson =
    useWatch({ control, name: getFieldName('schemaMarkup') }) || '';
  const slug = useWatch({ control, name: slugFieldName }) || '';
  const content = useWatch({ control, name: contentFieldName }) || '';

  const [score, setScore] = useState(0);
  const [checks, setChecks] = useState<ReturnType<typeof analyzeSeo>['checks']>(
    []
  );
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const result = analyzeSeo({
      focusKeyword,
      title: metaTitle,
      description: metaDescription,
      slug,
      content
    });

    setScore(result.score);
    setChecks(result.checks);
    setSuggestions(result.suggestions);
  }, [content, focusKeyword, metaDescription, metaTitle, slug]);

  const scoreTone = useMemo(() => {
    if (score >= 80) {
      return 'text-emerald-600';
    }

    if (score >= 60) {
      return 'text-amber-600';
    }

    return 'text-rose-600';
  }, [score]);

  return (
    <Card className='w-full'>
      <CardHeader className='pb-3'>
        <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
          <div className='space-y-1'>
            <div className='flex items-center gap-2'>
              <CardTitle>{title}</CardTitle>
              <Badge
                variant='outline'
                className={cn('font-semibold', scoreTone)}
              >
                {score}/100
              </Badge>
            </div>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className='w-full md:w-56'>
            <Progress value={score} className='h-2' />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='grid w-full grid-cols-4'>
            <TabsTrigger value='general'>General</TabsTrigger>
            <TabsTrigger value='analysis'>Analysis</TabsTrigger>
            <TabsTrigger value='schema'>Schema</TabsTrigger>
            <TabsTrigger value='social'>Social</TabsTrigger>
          </TabsList>

          <TabsContent value='general' className='space-y-6 pt-4'>
            <div className='rounded-lg border p-4'>
              <div className='mb-4 flex items-center justify-between'>
                <h3 className='text-sm font-medium'>SERP Preview</h3>
                <div className='flex gap-2'>
                  <Button
                    type='button'
                    size='sm'
                    variant={device === 'mobile' ? 'default' : 'outline'}
                    onClick={() => setDevice('mobile')}
                  >
                    <Smartphone className='mr-2 h-4 w-4' />
                    Mobile
                  </Button>
                  <Button
                    type='button'
                    size='sm'
                    variant={device === 'desktop' ? 'default' : 'outline'}
                    onClick={() => setDevice('desktop')}
                  >
                    <Monitor className='mr-2 h-4 w-4' />
                    Desktop
                  </Button>
                </div>
              </div>

              <div className='rounded-md border bg-white p-4 text-left font-sans dark:bg-zinc-950'>
                {device === 'mobile' ? (
                  <div className='max-w-[360px]'>
                    <div className='mb-1 flex items-center gap-2 text-xs text-gray-500'>
                      <div className='flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-[10px]'>
                        Web
                      </div>
                      <span className='truncate'>
                        example.com › {slug || 'page-slug'}
                      </span>
                    </div>
                    <div className='mb-1 text-lg leading-snug text-[#1a0dab] dark:text-[#8ab4f8]'>
                      {metaTitle || 'Add an SEO title'}
                    </div>
                    <div className='text-sm leading-normal text-[#4d5156] dark:text-[#bdc1c6]'>
                      {metaDescription ||
                        'Write a concise, compelling meta description.'}
                    </div>
                  </div>
                ) : (
                  <div className='max-w-[600px]'>
                    <div className='mb-1 text-xl leading-snug text-[#1a0dab] dark:text-[#8ab4f8]'>
                      {metaTitle || 'Add an SEO title'}
                    </div>
                    <div className='mb-1 text-sm text-[#006621] dark:text-[#7baaf7]'>
                      {canonicalUrl ||
                        `https://example.com/${slug || 'page-slug'}`}
                    </div>
                    <div className='text-sm leading-normal text-[#4d5156] dark:text-[#bdc1c6]'>
                      {metaDescription ||
                        'Write a concise, compelling meta description.'}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className='grid gap-4'>
              <FormField
                control={control}
                name={getFieldName('keywords')}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Focus Keyword</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='crm migration checklist'
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Use one primary phrase per page for clearer analysis.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={getFieldName('metaTitle')}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Title</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          placeholder='Best CRM Migration Checklist for 2026'
                          {...field}
                        />
                        <span className='text-muted-foreground absolute top-2 right-2 text-xs'>
                          {field.value?.length || 0}/60
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={getFieldName('metaDescription')}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Description</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Textarea
                          placeholder='Summarize the page value in a click-worthy way.'
                          {...field}
                          value={field.value || ''}
                        />
                        <span className='text-muted-foreground absolute top-2 right-2 text-xs'>
                          {field.value?.length || 0}/160
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={getFieldName('canonical')}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Canonical URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='https://example.com/core/seo'
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Set this when duplicate or variant pages point to a
                      preferred URL.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value='analysis' className='space-y-6 pt-4'>
            <div className='grid gap-3'>
              {checks.map((check) => (
                <div
                  key={check.id}
                  className='flex items-start gap-3 rounded-lg border p-3'
                >
                  <div
                    className={cn(
                      'mt-1 h-2.5 w-2.5 rounded-full',
                      check.status === 'pass' && 'bg-emerald-500',
                      check.status === 'warning' && 'bg-amber-500',
                      check.status === 'fail' && 'bg-rose-500'
                    )}
                  />
                  <div className='space-y-1'>
                    <p className='text-sm font-medium'>{check.label}</p>
                    <p className='text-muted-foreground text-sm'>
                      {check.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className='rounded-lg border border-dashed p-4'>
              <div className='mb-3 flex items-center gap-2'>
                <Sparkles className='h-4 w-4' />
                <h3 className='font-medium'>Next Improvements</h3>
              </div>
              <div className='space-y-2 text-sm'>
                {suggestions.length > 0 ? (
                  suggestions.map((suggestion) => (
                    <p key={suggestion} className='text-muted-foreground'>
                      {suggestion}
                    </p>
                  ))
                ) : (
                  <p className='text-muted-foreground'>
                    This page is in a healthy range. Keep content updated and
                    monitor search data.
                  </p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value='schema' className='space-y-4 pt-4'>
            <FormField
              control={control}
              name={getFieldName('schemaMarkup')}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schema JSON-LD</FormLabel>
                  <FormControl>
                    <Textarea
                      className='min-h-[220px] font-mono text-sm'
                      placeholder='{"@context":"https://schema.org","@type":"Article"}'
                      {...field}
                      value={
                        typeof field.value === 'string'
                          ? field.value
                          : JSON.stringify(field.value || {}, null, 2)
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Use valid JSON-LD for articles, services, products, local
                    business, and more.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {schemaJson ? (
              <div className='text-muted-foreground rounded-lg border border-dashed p-3 text-sm'>
                Schema is attached and ready for render-time injection.
              </div>
            ) : null}
          </TabsContent>

          <TabsContent value='social' className='space-y-4 pt-4'>
            <FormField
              control={control}
              name={getFieldName('ogImage')}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Open Graph Image</FormLabel>
                  <FormControl>
                    <div className='flex flex-col gap-4'>
                      {field.value ? (
                        <div className='relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border'>
                          <Image
                            src={field.value}
                            alt='Social share image'
                            fill
                            className='object-cover'
                          />
                        </div>
                      ) : null}
                      <MediaPicker
                        onSelect={(url) => field.onChange(url)}
                        title='Select Social Image'
                        trigger={
                          <Button
                            variant='outline'
                            type='button'
                            className='w-fit gap-2'
                          >
                            <Link2 className='h-4 w-4' />
                            {field.value ? 'Change Image' : 'Pick Image'}
                          </Button>
                        }
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Reuse media library assets for social previews across all
                    modules.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
