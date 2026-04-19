'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Globe, Smartphone, Monitor } from 'lucide-react';

export default function SerpPreviewPage() {
  const [title, setTitle] = useState('Your Page Title Goes Here | Brand Name');
  const [description, setDescription] = useState(
    'This is an example of how your page will appear in Google search results. Keep your description under 160 characters for best results.'
  );
  const [url, setUrl] = useState('example.com/your-page-slug');
  const [keyword, setKeyword] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Approximate pixel widths (very rough estimation)
  const [titleWidth, setTitleWidth] = useState(0);
  const [descWidth, setDescWidth] = useState(0);

  // Limits
  const MAX_TITLE_WIDTH = 580; // pixels
  const MAX_DESC_WIDTH = 990; // pixels (desktop) / different for mobile but usually char count matters more

  useEffect(() => {
    // Simple estimation: avg char width ~9px for title (Arial 20px), ~7px for desc (Arial 14px)
    // This is a rough heuristic.
    setTitleWidth(title.length * 9.5);
    setDescWidth(description.length * 7);
  }, [title, description]);

  const highlightKeyword = (text: string) => {
    if (!keyword.trim()) return text;
    const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <b key={i}>{part}</b>
      ) : (
        part
      )
    );
  };

  return (
    <ScrollArea className='h-[calc(100vh-4rem)]'>
      <div className='flex-1 space-y-4 p-4 pt-6 md:p-8'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-3xl font-bold tracking-tight'>
            SERP Preview Tool
          </h1>
          <p className='text-muted-foreground'>
            Visualize how your content will appear in Google search results.
          </p>
        </div>

        <div className='grid gap-6 md:grid-cols-2'>
          {/* Editor Column */}
          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Content Editor</CardTitle>
                <CardDescription>
                  Edit your metadata to see real-time updates.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='title'>Meta Title</Label>
                  <Input
                    id='title'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder='Enter page title'
                  />
                  <div className='text-muted-foreground flex justify-between text-xs'>
                    <span
                      className={
                        titleWidth > MAX_TITLE_WIDTH
                          ? 'font-medium text-red-500'
                          : ''
                      }
                    >
                      ~{Math.round(titleWidth)}px / {MAX_TITLE_WIDTH}px
                    </span>
                    <span>{title.length} chars</span>
                  </div>
                  {titleWidth > MAX_TITLE_WIDTH && (
                    <p className='text-xs text-red-500'>
                      Title may be truncated in search results.
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='description'>Meta Description</Label>
                  <Textarea
                    id='description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder='Enter meta description'
                    rows={4}
                  />
                  <div className='text-muted-foreground flex justify-between text-xs'>
                    <span
                      className={
                        descWidth > MAX_DESC_WIDTH
                          ? 'font-medium text-red-500'
                          : ''
                      }
                    >
                      ~{Math.round(descWidth)}px / {MAX_DESC_WIDTH}px
                    </span>
                    <span>{description.length} chars</span>
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='url'>URL / Slug</Label>
                  <Input
                    id='url'
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder='example.com/page'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='keyword'>Focus Keyword (for bolding)</Label>
                  <Input
                    id='keyword'
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder='Enter focus keyword'
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Column */}
          <div className='space-y-6'>
            <Card className='h-full'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle>Google Preview</CardTitle>
                <div className='bg-muted flex items-center space-x-2 rounded-md p-1'>
                  <button
                    onClick={() => setIsMobile(false)}
                    className={`rounded-sm p-1.5 transition-all ${!isMobile ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
                    title='Desktop View'
                  >
                    <Monitor className='h-4 w-4' />
                  </button>
                  <button
                    onClick={() => setIsMobile(true)}
                    className={`rounded-sm p-1.5 transition-all ${isMobile ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
                    title='Mobile View'
                  >
                    <Smartphone className='h-4 w-4' />
                  </button>
                </div>
              </CardHeader>
              <CardContent className='pt-6'>
                <div className='bg-opacity-50 flex min-h-[300px] flex-col items-center justify-center rounded-lg border bg-white p-6 dark:bg-zinc-950'>
                  {/* Google Result Card */}
                  <div
                    className={`w-full ${isMobile ? 'max-w-[375px]' : 'max-w-[600px]'} bg-background hover:bg-accent/5 rounded-md border border-transparent p-4 text-left shadow-sm transition-colors`}
                  >
                    {/* URL/Breadcrumb */}
                    <div className='mb-1 flex items-center gap-2'>
                      <div className='flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-gray-100 text-xs'>
                        <Globe className='h-4 w-4 text-gray-500' />
                      </div>
                      <div className='flex flex-col overflow-hidden leading-tight'>
                        <span className='text-foreground/90 truncate text-sm font-medium'>
                          {url.split('/')[0] || 'example.com'}
                        </span>
                        <span className='text-muted-foreground truncate text-xs'>
                          {url}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3
                      className='mb-1 cursor-pointer truncate text-xl font-normal text-[#1a0dab] hover:underline dark:text-[#8ab4f8]'
                      style={{ fontFamily: 'arial, sans-serif' }}
                    >
                      {title || 'Page Title'}
                    </h3>

                    {/* Description */}
                    <div
                      className='text-sm text-[#4d5156] dark:text-[#bdc1c6]'
                      style={{ fontFamily: 'arial, sans-serif' }}
                    >
                      {/* Date often appears here for blogs */}
                      <span className='text-muted-foreground/60 mr-1'>
                        Oct 24, 2024 —
                      </span>
                      {highlightKeyword(
                        description || 'Meta description will appear here...'
                      )}
                    </div>

                    {/* Sitelinks (Visual Decoration for "Rich" feel) */}
                    <div className='mt-4 flex gap-4 text-sm text-[#1a0dab] dark:text-[#8ab4f8]'>
                      <span className='cursor-pointer hover:underline'>
                        About Us
                      </span>
                      <span className='cursor-pointer hover:underline'>
                        Contact
                      </span>
                      <span className='cursor-pointer hover:underline'>
                        Services
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
