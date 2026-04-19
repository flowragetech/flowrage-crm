import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const modules = [
  {
    id: 'content-seo',
    title: 'Content SEO',
    description: 'Audit and manage SEO metadata for all your pages and posts.',
    status: 'Active',
    enabled: true,
    link: '/dashboard/franker/content-seo'
  },
  {
    id: '404-monitor',
    title: '404 Monitor',
    description:
      'Records URLs on which visitors & search engines run into 404 Errors.',
    status: 'Active',
    enabled: true,
    link: '/dashboard/franker/404-monitor'
  },
  {
    id: 'redirections',
    title: 'Redirections',
    description:
      'Redirect content to other URLs using 301, 302, 307 redirects.',
    status: 'Active',
    enabled: true,
    link: '/dashboard/franker/redirects'
  },
  {
    id: 'schema',
    title: 'Schema (Structured Data)',
    description:
      'Adds structured data to your content to help search engines understand it.',
    status: 'Active',
    enabled: true,
    link: '/dashboard/franker/schema'
  },
  {
    id: 'sitemap',
    title: 'Sitemap',
    description:
      'Generates XML Sitemap for your website to help search engines index your content.',
    status: 'Active',
    enabled: true,
    link: '/dashboard/franker/sitemap'
  },
  {
    id: 'image-seo',
    title: 'Image SEO',
    description: 'Automates Image SEO by adding ALT and Title tags to images.',
    status: 'Active',
    enabled: true,
    link: '/dashboard/franker/image-seo'
  },
  {
    id: 'content-ai',
    title: 'Content AI',
    description:
      'AI-powered content suggestions to optimize your posts for SEO.',
    status: 'Active',
    enabled: true,
    link: '/dashboard/franker/content-ai'
  },
  {
    id: 'instant-indexing',
    title: 'Instant Indexing',
    description: 'Notify search engines about new content immediately.',
    status: 'Active',
    enabled: true,
    link: '/dashboard/franker/instant-indexing'
  },
  {
    id: 'link-counter',
    title: 'Link Counter',
    description: 'Count internal and external links in your posts.',
    status: 'Active',
    enabled: true,
    link: '/dashboard/franker/link-counter'
  },
  {
    id: 'local-seo',
    title: 'Local SEO',
    description:
      'Optimize your website for local search results and Google Maps.',
    status: 'Active',
    enabled: true,
    link: '/dashboard/franker/local-seo'
  },
  {
    id: 'role-manager',
    title: 'Role Manager',
    description: 'Manage user roles and capabilities for Franker SEO features.',
    status: 'Active',
    enabled: true,
    link: '/dashboard/franker/role-manager'
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description:
      'Google Search Console integration to track your site performance.',
    status: 'Active',
    enabled: true,
    link: '/dashboard/franker/analytics'
  }
];

export default function FrankerDashboard() {
  return (
    <PageContainer scrollable>
      <div className='space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='SEO Dashboard'
            description="Manage your site's SEO performance and settings."
          />
        </div>
        <Separator />

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Overall SEO Score
              </CardTitle>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                className='text-muted-foreground h-4 w-4'
              >
                <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
              </svg>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>87/100</div>
              <p className='text-muted-foreground text-xs'>
                +2.5% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Indexed Pages
              </CardTitle>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                className='text-muted-foreground h-4 w-4'
              >
                <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                <circle cx='9' cy='7' r='4' />
                <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
              </svg>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>142</div>
              <p className='text-muted-foreground text-xs'>
                +12 since last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>404 Errors</CardTitle>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                className='text-muted-foreground h-4 w-4'
              >
                <rect width='20' height='14' x='2' y='5' rx='2' />
                <path d='M2 10h20' />
              </svg>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-red-500'>3</div>
              <p className='text-muted-foreground text-xs'>
                Requires attention
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Keywords Ranked
              </CardTitle>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                className='text-muted-foreground h-4 w-4'
              >
                <path d='M12 20V10' />
                <path d='M18 20V4' />
                <path d='M6 20v-4' />
              </svg>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>24</div>
              <p className='text-muted-foreground text-xs'>Top 10 positions</p>
            </CardContent>
          </Card>
        </div>

        <div className='mt-8'>
          <Heading
            title='SEO Modules'
            description='Enable or disable features as needed.'
          />
        </div>
        <Separator />

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {modules.map((module) => (
            <Card key={module.id} className='flex flex-col justify-between'>
              <CardHeader className='pb-2'>
                <div className='flex items-start justify-between'>
                  <CardTitle className='text-base font-semibold'>
                    {module.title}
                  </CardTitle>
                  <Switch
                    checked={module.enabled}
                    disabled={module.status !== 'Active'}
                  />
                </div>
                <CardDescription className='mt-2 min-h-[40px] text-xs'>
                  {module.description}
                </CardDescription>
              </CardHeader>
              <CardFooter className='flex items-center justify-between pt-2'>
                <Badge
                  variant={module.status === 'Active' ? 'default' : 'secondary'}
                >
                  {module.status}
                </Badge>
                {module.status === 'Active' && module.link !== '#' && (
                  <Button variant='ghost' size='sm' asChild>
                    <Link href={module.link}>Settings</Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
