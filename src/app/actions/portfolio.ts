'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { withTimeout, sanitizeAndParseSchema } from '@/lib/utils';

export async function getPortfolios() {
  try {
    return await withTimeout(
      prisma.portfolio.findMany({
        include: {
          seoMetadata: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      10000
    );
  } catch (error) {
    return [];
  }
}

export async function getPortfolioById(id: string) {
  try {
    return await withTimeout(
      prisma.portfolio.findUnique({
        where: { id },
        include: {
          seoMetadata: true
        }
      }),
      10000
    );
  } catch (error) {
    return null;
  }
}

export async function createPortfolio(data: {
  title: string;
  slug: string;
  description: string;
  client?: string;
  image?: string;
  content?: string;
  seoMetadata: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
    ogImage?: string;
    canonical?: string;
    schemaMarkup?: any;
  };
}) {
  try {
    const portfolio = await withTimeout(
      prisma.portfolio.create({
        data: {
          title: data.title,
          slug: data.slug,
          description: data.description,
          client: data.client,
          image: data.image,
          content: data.content,
          seoMetadata: {
            create: {
              metaTitle: data.seoMetadata.metaTitle,
              metaDescription: data.seoMetadata.metaDescription,
              keywords: data.seoMetadata.keywords,
              ogImage: data.seoMetadata.ogImage,
              canonical: data.seoMetadata.canonical,
              schemaMarkup: sanitizeAndParseSchema(
                data.seoMetadata.schemaMarkup
              )
            }
          }
        }
      }),
      10000
    );

    revalidatePath('/dashboard/cms/portfolio');
    return { success: true, portfolio };
  } catch (error) {
    return { success: false, error: 'Failed to create portfolio' };
  }
}

export async function updatePortfolio(
  id: string,
  data: {
    title: string;
    slug: string;
    description: string;
    client?: string;
    image?: string;
    content?: string;
    seoMetadata: {
      id: string;
      metaTitle?: string;
      metaDescription?: string;
      keywords?: string;
      ogImage?: string;
      canonical?: string;
      schemaMarkup?: any;
    };
  }
) {
  try {
    const portfolio = await withTimeout(
      prisma.portfolio.update({
        where: { id },
        data: {
          title: data.title,
          slug: data.slug,
          description: data.description,
          client: data.client,
          image: data.image,
          content: data.content,
          seoMetadata: {
            update: {
              where: { id: data.seoMetadata.id },
              data: {
                metaTitle: data.seoMetadata.metaTitle,
                metaDescription: data.seoMetadata.metaDescription,
                keywords: data.seoMetadata.keywords,
                ogImage: data.seoMetadata.ogImage,
                canonical: data.seoMetadata.canonical,
                schemaMarkup: sanitizeAndParseSchema(
                  data.seoMetadata.schemaMarkup
                )
              }
            }
          }
        }
      }),
      10000
    );

    revalidatePath('/dashboard/cms/portfolio');
    return { success: true, portfolio };
  } catch (error) {
    return { success: false, error: 'Failed to update portfolio' };
  }
}

export async function deletePortfolio(id: string, seoMetadataId: string) {
  try {
    await withTimeout(
      prisma.portfolio.delete({
        where: { id }
      }),
      10000
    );

    await withTimeout(
      prisma.seoMetadata.delete({
        where: { id: seoMetadataId }
      }),
      10000
    );

    revalidatePath('/dashboard/cms/portfolio');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete portfolio' };
  }
}
