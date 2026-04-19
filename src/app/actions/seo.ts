'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { withTimeout, sanitizeAndParseSchema } from '@/lib/utils';

export async function getGlobalSeo() {
  try {
    return await withTimeout(prisma.globalSeo.findFirst(), 10000);
  } catch (error) {
    return null;
  }
}

export async function updateGlobalSeo(values: any) {
  try {
    const existingSeo = await withTimeout(prisma.globalSeo.findFirst(), 10000);

    const data = {
      defaultMetaTitle: values.defaultMetaTitle,
      defaultMetaDescription: values.defaultMetaDescription,
      ogSiteName: values.ogSiteName,
      ogImage: values.ogImage,
      twitterHandle: values.twitterHandle,
      googleAnalyticsId: values.googleAnalyticsId,
      googleSearchConsoleId: values.googleSearchConsoleId,
      bingWebmasterId: values.bingWebmasterId,
      schemaMarkup: sanitizeAndParseSchema(values.schemaMarkup)
    };

    if (existingSeo) {
      await withTimeout(
        prisma.globalSeo.update({
          where: { id: existingSeo.id },
          data
        }),
        10000
      );
    } else {
      await withTimeout(
        prisma.globalSeo.create({
          data
        }),
        10000
      );
    }

    revalidatePath('/dashboard/seo/global');
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update global SEO' };
  }
}

export async function getRedirectById(id: string) {
  try {
    return await withTimeout(
      prisma.redirect.findUnique({
        where: { id }
      }),
      10000
    );
  } catch (error) {
    return null;
  }
}

export async function getRedirects() {
  try {
    return await withTimeout(
      prisma.redirect.findMany({
        orderBy: { createdAt: 'desc' }
      }),
      10000
    );
  } catch (error) {
    return [];
  }
}

export async function upsertRedirect(values: any) {
  try {
    const data = {
      source: values.source,
      destination: values.destination,
      statusCode: parseInt(values.statusCode) || 301,
      isActive: values.isActive ?? true
    };

    if (values.id) {
      await withTimeout(
        prisma.redirect.update({
          where: { id: values.id },
          data
        }),
        10000
      );
    } else {
      await withTimeout(
        prisma.redirect.create({
          data
        }),
        10000
      );
    }

    revalidatePath('/dashboard/seo/redirects');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to save redirect' };
  }
}

export async function deleteRedirect(id: string) {
  try {
    await withTimeout(
      prisma.redirect.delete({
        where: { id }
      }),
      10000
    );
    revalidatePath('/dashboard/seo/redirects');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete redirect' };
  }
}
