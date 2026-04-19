'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { withTimeout, sanitizeAndParseSchema } from '@/lib/utils';

export async function getStaticPages() {
  try {
    return await withTimeout(
      prisma.staticPage.findMany({
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

export async function getStaticPageById(id: string) {
  try {
    return await withTimeout(
      prisma.staticPage.findUnique({
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

export async function createStaticPage(data: {
  title: string;
  slug: string;
  content: string;
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
    const page = await withTimeout(
      prisma.staticPage.create({
        data: {
          title: data.title,
          slug: data.slug,
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

    revalidatePath('/dashboard/cms/pages');
    return { success: true, page };
  } catch (error) {
    return { success: false, error: 'Failed to create static page' };
  }
}

export async function updateStaticPage(
  id: string,
  data: {
    title: string;
    slug: string;
    content: string;
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
    const page = await withTimeout(
      prisma.staticPage.update({
        where: { id },
        data: {
          title: data.title,
          slug: data.slug,
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

    revalidatePath('/dashboard/cms/pages');
    return { success: true, page };
  } catch (error) {
    return { success: false, error: 'Failed to update static page' };
  }
}

export async function deleteStaticPage(id: string, seoMetadataId: string) {
  try {
    await withTimeout(
      prisma.staticPage.delete({
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

    revalidatePath('/dashboard/cms/pages');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete static page' };
  }
}
