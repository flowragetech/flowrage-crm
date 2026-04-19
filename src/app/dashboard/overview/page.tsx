import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent
} from '@/components/ui/card';
import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import {
  IconPlus,
  IconFileText,
  IconPhoto,
  IconBriefcase,
  IconArrowRight,
  IconClock,
  IconMail
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function OverViewLayout() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect('/auth/sign-in');
  }

  let counts = {
    services: 0,
    portfolio: 0,
    blogPosts: 0,
    categories: 0,
    inquiries: 0
  };

  let recentPosts: any[] = [];
  let recentMedia: any[] = [];
  let recentInquiries: any[] = [];

  try {
    const [
      services,
      portfolio,
      blogPosts,
      categories,
      inquiries,
      posts,
      media,
      unreadInquiries
    ] = await Promise.all([
      prisma.service.count(),
      prisma.portfolio.count(),
      prisma.blogPost.count(),
      prisma.category.count(),
      prisma.inquiry.count(),
      prisma.blogPost.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { categories: true }
      }),
      prisma.media.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.inquiry.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
      })
    ]);
    counts = { services, portfolio, blogPosts, categories, inquiries };
    recentPosts = posts;
    recentMedia = media;
    recentInquiries = unreadInquiries;
  } catch {
    void 0;
  }

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Hi, Welcome back 👋
          </h2>
        </div>

        <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
          <Card className='@container/card'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardDescription>Total Services</CardDescription>
              <IconBriefcase size={20} className='text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{counts.services}</div>
              <p className='text-muted-foreground text-xs'>
                Active service offerings
              </p>
            </CardContent>
          </Card>
          <Card className='@container/card'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardDescription>Portfolio Projects</CardDescription>
              <IconBriefcase size={20} className='text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{counts.portfolio}</div>
              <p className='text-muted-foreground text-xs'>
                Completed projects
              </p>
            </CardContent>
          </Card>
          <Card className='@container/card'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardDescription>Blog Posts</CardDescription>
              <IconFileText size={20} className='text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{counts.blogPosts}</div>
              <p className='text-muted-foreground text-xs'>
                Published articles
              </p>
            </CardContent>
          </Card>
          <Card className='@container/card'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardDescription>Total Inquiries</CardDescription>
              <IconMail size={20} className='text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{counts.inquiries}</div>
              <p className='text-muted-foreground text-xs'>
                Customer messages received
              </p>
            </CardContent>
          </Card>
        </div>

        <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
          <Card className='lg:col-span-4'>
            <CardHeader className='flex flex-row items-center justify-between'>
              <div className='space-y-1'>
                <CardTitle>Recent Blog Posts</CardTitle>
                <CardDescription>Your latest content updates.</CardDescription>
              </div>
              <Button variant='ghost' size='sm' asChild>
                <Link href='/dashboard/blog/posts' className='gap-1'>
                  View all <IconArrowRight size={14} />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {recentPosts.length > 0 ? (
                  recentPosts.map((post) => (
                    <div key={post.id} className='flex items-center gap-4'>
                      <div className='bg-muted relative h-12 w-12 shrink-0 overflow-hidden rounded-none'>
                        {post.featuredImage ? (
                          <Image
                            src={post.featuredImage}
                            alt={post.title}
                            fill
                            className='object-cover'
                          />
                        ) : (
                          <div className='flex h-full w-full items-center justify-center'>
                            <IconFileText
                              size={20}
                              className='text-muted-foreground'
                            />
                          </div>
                        )}
                      </div>
                      <div className='flex-1 space-y-1 overflow-hidden'>
                        <p className='truncate text-sm leading-none font-medium'>
                          {post.title}
                        </p>
                        <div className='text-muted-foreground flex items-center gap-2 text-xs'>
                          <span className='flex items-center gap-1'>
                            <IconClock size={12} />
                            {formatDistanceToNow(new Date(post.createdAt), {
                              addSuffix: true
                            })}
                          </span>
                          {post.categories?.[0] && (
                            <Badge variant='secondary' className='text-[10px]'>
                              {post.categories[0].name}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button variant='outline' size='sm' asChild>
                        <Link href={`/dashboard/blog/posts/${post.id}`}>
                          Edit
                        </Link>
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className='text-muted-foreground flex h-[200px] items-center justify-center'>
                    No posts yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className='flex flex-col gap-4 lg:col-span-3'>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Commonly used tasks.</CardDescription>
              </CardHeader>
              <CardContent className='grid grid-cols-2 gap-2'>
                <Button
                  variant='outline'
                  className='justify-start gap-2'
                  asChild
                >
                  <Link href='/dashboard/blog/posts/new'>
                    <IconPlus size={16} /> New Post
                  </Link>
                </Button>
                <Button
                  variant='outline'
                  className='justify-start gap-2'
                  asChild
                >
                  <Link href='/dashboard/media'>
                    <IconPhoto size={16} /> Media
                  </Link>
                </Button>
                <Button
                  variant='outline'
                  className='justify-start gap-2'
                  asChild
                >
                  <Link href='/dashboard/cms/services/new'>
                    <IconPlus size={16} /> New Service
                  </Link>
                </Button>
                <Button
                  variant='outline'
                  className='justify-start gap-2'
                  asChild
                >
                  <Link href='/dashboard/cms/homepage'>
                    <IconBriefcase size={16} /> Edit Home
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className='flex-1'>
              <CardHeader>
                <CardTitle>Recent Media</CardTitle>
                <CardDescription>Recently uploaded files.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-3 gap-2'>
                  {recentMedia.map((item) => (
                    <div
                      key={item.id}
                      className='bg-muted relative aspect-square overflow-hidden rounded-none border'
                    >
                      <Image
                        src={item.url}
                        alt={item.name}
                        fill
                        className='object-cover'
                      />
                    </div>
                  ))}
                  {recentMedia.length === 0 && (
                    <div className='text-muted-foreground col-span-3 py-10 text-center text-xs'>
                      No media uploaded.
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant='ghost' size='sm' className='w-full' asChild>
                  <Link href='/dashboard/media'>View Media Library</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Inquiries</CardTitle>
                <CardDescription>
                  Latest messages from the website.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {recentInquiries.map((inquiry) => (
                    <div key={inquiry.id} className='flex items-start gap-4'>
                      <div className='bg-primary/10 flex h-8 w-8 items-center justify-center rounded-none'>
                        <IconMail size={16} className='text-primary' />
                      </div>
                      <div className='flex-1 space-y-1'>
                        <div className='flex items-center justify-between'>
                          <p className='text-sm leading-none font-medium'>
                            {inquiry.name}
                          </p>
                          <span className='text-muted-foreground text-[10px]'>
                            {formatDistanceToNow(new Date(inquiry.createdAt))}{' '}
                            ago
                          </span>
                        </div>
                        <p className='text-muted-foreground line-clamp-1 text-xs'>
                          {inquiry.subject || 'No Subject'}
                        </p>
                      </div>
                    </div>
                  ))}
                  {recentInquiries.length === 0 && (
                    <div className='text-muted-foreground py-6 text-center text-sm'>
                      No inquiries received yet.
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant='ghost' size='sm' className='w-full' asChild>
                  <Link href='/dashboard/inquiries'>View All Inquiries</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
