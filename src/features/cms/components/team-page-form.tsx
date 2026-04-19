'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FrankerSeoPanel } from '@/features/franker/components/franker-seo-panel';
import { useRouter } from 'next/navigation';
import { updateTeamPage } from '@/app/actions/cms';

const teamPageSchema = z.object({
  heroTitle: z.string().min(2, {
    message: 'Hero title must be at least 2 characters.'
  }),
  heroHighlight: z.string().optional(),
  heroSubtitle: z.string().optional(),
  heroDescription: z.string().optional(),
  introTitle: z.string().optional(),
  introBody: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
  ogImage: z.string().optional(),
  canonical: z.string().url().optional().or(z.literal('')),
  schemaMarkup: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || !val.trim()) return true;
        const trimmed = val.trim();
        if (trimmed.length > 500000) return false;
        try {
          JSON.parse(trimmed);
          return true;
        } catch {
          return false;
        }
      },
      {
        message:
          'Invalid JSON-LD. Please paste valid JSON (without script tags).'
      }
    )
});

type TeamPageFormValues = z.infer<typeof teamPageSchema>;

interface TeamPageSeoData {
  metaTitle?: string | null;
  metaDescription?: string | null;
  keywords?: string | null;
  ogImage?: string | null;
  canonical?: string | null;
  schemaMarkup?: any;
}

interface TeamPageData {
  heroTitle?: string | null;
  heroHighlight?: string | null;
  heroSubtitle?: string | null;
  heroDescription?: string | null;
  introTitle?: string | null;
  introBody?: string | null;
  seoMetadata?: TeamPageSeoData | null;
}

interface TeamPageFormProps {
  initialData?: TeamPageData | null;
}

export function TeamPageForm({ initialData }: TeamPageFormProps) {
  const router = useRouter();

  const form = useForm<TeamPageFormValues>({
    resolver: zodResolver(teamPageSchema),
    defaultValues: {
      heroTitle: initialData?.heroTitle || '',
      heroHighlight: initialData?.heroHighlight || '',
      heroSubtitle: initialData?.heroSubtitle || '',
      heroDescription: initialData?.heroDescription || '',
      introTitle: initialData?.introTitle || '',
      introBody: initialData?.introBody || '',
      metaTitle: initialData?.seoMetadata?.metaTitle || '',
      metaDescription: initialData?.seoMetadata?.metaDescription || '',
      keywords: initialData?.seoMetadata?.keywords || '',
      ogImage: initialData?.seoMetadata?.ogImage || '',
      canonical: initialData?.seoMetadata?.canonical || '',
      schemaMarkup: initialData?.seoMetadata?.schemaMarkup
        ? JSON.stringify(initialData.seoMetadata.schemaMarkup, null, 2)
        : ''
    }
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: TeamPageFormValues) {
    try {
      const result = await updateTeamPage(values);
      if (result.success) {
        toast.success('Team page content updated successfully!');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to update team page');
      }
    } catch {
      toast.error(
        'Failed to parse schema markup. Please ensure it is valid JSON.'
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <FormField
              control={form.control}
              name='heroTitle'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero Title</FormLabel>
                  <FormControl>
                    <Input placeholder='Meet Your Growth Team' {...field} />
                  </FormControl>
                  <FormDescription>
                    Main heading for the team page hero section.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='heroHighlight'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero Highlight</FormLabel>
                  <FormControl>
                    <Input placeholder='Team Directory' {...field} />
                  </FormControl>
                  <FormDescription>
                    Highlighted word or phrase in the hero title.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='heroSubtitle'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero Subtitle</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='The strategists behind your growth'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='heroDescription'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Introduce your core team and their mission.'
                      className='min-h-[80px]'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Experts Intro Section</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <FormField
              control={form.control}
              name='introTitle'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Meet the team behind your brand'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='introBody'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Explain how your team works and what makes them unique.'
                      className='min-h-[80px]'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <FrankerSeoPanel control={form.control} namePrefix='' />

        <div className='flex justify-end'>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Team Page'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
