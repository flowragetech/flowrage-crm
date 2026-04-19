'use server';

import { prisma } from '@/lib/prisma';
import { withTimeout } from '@/lib/utils';

export interface LinkStats {
  totalPosts: number;
  totalInternalLinks: number;
  totalExternalLinks: number;
  posts: {
    id: string;
    title: string;
    internalLinks: number;
    externalLinks: number;
  }[];
}

export async function scanLinkStats(baseUrl: string = ''): Promise<LinkStats> {
  try {
    const posts = await withTimeout(
      prisma.blogPost.findMany({
        select: { id: true, title: true, content: true }
      }),
      10000
    );

    let totalInternal = 0;
    let totalExternal = 0;
    const postStats = [];

    // Simple regex for hrefs
    // Note: robust HTML parsing is better, but regex suffices for simple stats
    const hrefRegex = /href=["']([^"']*)["']/g;

    for (const post of posts) {
      let internal = 0;
      let external = 0;
      let match;

      while ((match = hrefRegex.exec(post.content)) !== null) {
        const url = match[1];
        if (url.startsWith('/') || url.includes(baseUrl)) {
          internal++;
        } else if (url.startsWith('http')) {
          external++;
        }
      }

      totalInternal += internal;
      totalExternal += external;

      postStats.push({
        id: post.id,
        title: post.title,
        internalLinks: internal,
        externalLinks: external
      });
    }

    return {
      totalPosts: posts.length,
      totalInternalLinks: totalInternal,
      totalExternalLinks: totalExternal,
      posts: postStats
    };
  } catch (error) {
    return {
      totalPosts: 0,
      totalInternalLinks: 0,
      totalExternalLinks: 0,
      posts: []
    };
  }
}
