'use server';

import { prisma } from '@/lib/prisma';
import { withTimeout } from '@/lib/utils';

export type SearchResultItem = {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  section: 'CRM' | 'Blog' | 'CMS' | 'Media';
};

export async function searchWorkspace(
  query: string
): Promise<SearchResultItem[]> {
  const term = query.trim();

  if (term.length < 2) {
    return [];
  }

  const contains = { contains: term, mode: 'insensitive' as const };

  const [orders, posts, pages, media] = await Promise.all([
    prisma.order
      .findMany({
        where: {
          OR: [{ name: contains }, { email: contains }, { service: contains }]
        },
        take: 5,
        orderBy: { createdAt: 'desc' }
      })
      .catch(() => []),
    prisma.blogPost
      .findMany({
        where: {
          OR: [{ title: contains }, { excerpt: contains }, { slug: contains }]
        },
        take: 5,
        orderBy: { updatedAt: 'desc' }
      })
      .catch(() => []),
    prisma.staticPage
      .findMany({
        where: {
          OR: [{ title: contains }, { slug: contains }, { content: contains }]
        },
        take: 5,
        orderBy: { updatedAt: 'desc' }
      })
      .catch(() => []),
    prisma.media
      .findMany({
        where: {
          OR: [{ name: contains }, { altText: contains }, { caption: contains }]
        },
        take: 5,
        orderBy: { updatedAt: 'desc' }
      })
      .catch(() => [])
  ]);

  const results: SearchResultItem[] = [
    ...orders.map((order) => ({
      id: `deal-${order.id}`,
      title: order.name || order.email || 'Untitled deal',
      subtitle: `Deal - ${order.service}`,
      url: '/dashboard/crm/deals',
      section: 'CRM' as const
    })),
    ...posts.map((post) => ({
      id: `post-${post.id}`,
      title: post.title,
      subtitle: `Blog - ${post.slug}`,
      url: `/dashboard/blog/posts/${post.id}`,
      section: 'Blog' as const
    })),
    ...pages.map((page) => ({
      id: `page-${page.id}`,
      title: page.title,
      subtitle: `Page - ${page.slug}`,
      url: `/dashboard/cms/pages/${page.id}`,
      section: 'CMS' as const
    })),
    ...media.map((item) => ({
      id: `media-${item.id}`,
      title: item.name,
      subtitle: `Media - ${item.type}`,
      url: '/dashboard/media',
      section: 'Media' as const
    }))
  ];

  return withTimeout(Promise.resolve(results.slice(0, 20)), 10000);
}
