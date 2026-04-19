'use server';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export type SeoContentItem = {
  id: string;
  title: string;
  slug: string;
  type: 'Page' | 'Blog' | 'Service' | 'Portfolio';
  updatedAt: Date;
  seoMetadata: {
    metaTitle: string | null;
    metaDescription: string | null;
    ogImage: string | null;
    keywords: string | null;
  } | null;
};

type StaticPageItem = Prisma.StaticPageGetPayload<{
  select: {
    id: true;
    title: true;
    slug: true;
    updatedAt: true;
    seoMetadata: {
      select: {
        metaTitle: true;
        metaDescription: true;
        ogImage: true;
        keywords: true;
      };
    };
  };
}>;

type BlogPostItem = Prisma.BlogPostGetPayload<{
  select: {
    id: true;
    title: true;
    slug: true;
    updatedAt: true;
    seoMetadata: {
      select: {
        metaTitle: true;
        metaDescription: true;
        ogImage: true;
        keywords: true;
      };
    };
  };
}>;

type ServiceItem = Prisma.ServiceGetPayload<{
  select: {
    id: true;
    name: true;
    slug: true;
    updatedAt: true;
    seoMetadata: {
      select: {
        metaTitle: true;
        metaDescription: true;
        ogImage: true;
        keywords: true;
      };
    };
  };
}>;

type PortfolioItem = Prisma.PortfolioGetPayload<{
  select: {
    id: true;
    title: true;
    slug: true;
    updatedAt: true;
    seoMetadata: {
      select: {
        metaTitle: true;
        metaDescription: true;
        ogImage: true;
        keywords: true;
      };
    };
  };
}>;

export async function getAllContentForSeo(): Promise<SeoContentItem[]> {
  try {
    const pages: StaticPageItem[] = await prisma.staticPage.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        updatedAt: true,
        seoMetadata: {
          select: {
            metaTitle: true,
            metaDescription: true,
            ogImage: true,
            keywords: true
          }
        }
      }
    });

    const posts: BlogPostItem[] = await prisma.blogPost.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        updatedAt: true,
        seoMetadata: {
          select: {
            metaTitle: true,
            metaDescription: true,
            ogImage: true,
            keywords: true
          }
        }
      }
    });

    const services: ServiceItem[] = await prisma.service.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        updatedAt: true,
        seoMetadata: {
          select: {
            metaTitle: true,
            metaDescription: true,
            ogImage: true,
            keywords: true
          }
        }
      }
    });

    const portfolios: PortfolioItem[] = await prisma.portfolio.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        updatedAt: true,
        seoMetadata: {
          select: {
            metaTitle: true,
            metaDescription: true,
            ogImage: true,
            keywords: true
          }
        }
      }
    });

    const formattedPages: SeoContentItem[] = pages.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      type: 'Page',
      updatedAt: p.updatedAt,
      seoMetadata: p.seoMetadata
    }));

    const formattedPosts: SeoContentItem[] = posts.map((p) => ({
      id: p.id,
      title: p.title,
      slug: `blog/${p.slug}`,
      type: 'Blog',
      updatedAt: p.updatedAt,
      seoMetadata: p.seoMetadata
    }));

    const formattedServices: SeoContentItem[] = services.map((p) => ({
      id: p.id,
      title: p.name,
      slug: `services/${p.slug}`,
      type: 'Service',
      updatedAt: p.updatedAt,
      seoMetadata: p.seoMetadata
    }));

    const formattedPortfolios: SeoContentItem[] = portfolios.map((p) => ({
      id: p.id,
      title: p.title,
      slug: `portfolio/${p.slug}`,
      type: 'Portfolio',
      updatedAt: p.updatedAt,
      seoMetadata: p.seoMetadata
    }));

    return [
      ...formattedPages,
      ...formattedPosts,
      ...formattedServices,
      ...formattedPortfolios
    ].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  } catch (error) {
    return [];
  }
}
