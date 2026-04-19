'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { withTimeout, sanitizeAndParseSchema } from '@/lib/utils';

export async function getServiceCategories() {
  try {
    return await withTimeout(
      prisma.serviceCategory.findMany({
        orderBy: {
          order: 'asc'
        }
      }),
      10000
    );
  } catch (error) {
    return [];
  }
}

export async function getServices() {
  try {
    const services = await withTimeout(
      prisma.service.findMany({
        include: {
          seoMetadata: true,
          category: true
        },
        orderBy: [{ category: { order: 'asc' } }, { order: 'asc' }]
      }),
      10000
    );
    return services;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching services:', error);
    return [];
  }
}

export async function getServiceById(id: string) {
  try {
    return await withTimeout(
      prisma.service.findUnique({
        where: { id },
        include: {
          seoMetadata: true,
          category: true
        }
      }),
      10000
    );
  } catch (error) {
    return null;
  }
}

export async function createService(data: {
  name: string;
  slug: string;
  description: string;
  icon?: string;
  image?: string;
  content?: string;
  features?: string;
  categoryId?: string;
  order?: number;
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
    const service = await withTimeout(
      prisma.service.create({
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description,
          icon: data.icon,
          // @ts-ignore
          image: data.image,
          content: data.content,
          features: data.features,
          category: data.categoryId
            ? { connect: { id: data.categoryId } }
            : undefined,
          order: data.order || 0,
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

    revalidatePath('/dashboard/cms/services');
    return { success: true, service };
  } catch (error) {
    return { success: false, error: 'Failed to create service' };
  }
}

export async function updateService(
  id: string,
  data: {
    name: string;
    slug: string;
    description: string;
    icon?: string;
    content?: string;
    features?: string;
    categoryId?: string;
    order?: number;
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
    const service = await withTimeout(
      prisma.service.update({
        where: { id },
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description,
          icon: data.icon,
          // @ts-ignore
          image: data.image,
          content: data.content,
          features: data.features,
          category: data.categoryId
            ? { connect: { id: data.categoryId } }
            : undefined,
          order: data.order,
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

    revalidatePath('/dashboard/cms/services');
    return { success: true, service };
  } catch (error) {
    return { success: false, error: 'Failed to update service' };
  }
}

export async function deleteService(id: string, seoMetadataId: string) {
  try {
    // Delete service first
    await withTimeout(
      prisma.service.delete({
        where: { id }
      }),
      10000
    );

    // Then delete associated SEO metadata
    await withTimeout(
      prisma.seoMetadata.delete({
        where: { id: seoMetadataId }
      }),
      10000
    );

    revalidatePath('/dashboard/cms/services');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete service' };
  }
}
