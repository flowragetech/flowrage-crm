'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { withTimeout } from '@/lib/utils';

export async function getSitemapConfig() {
  try {
    const settings = await withTimeout(prisma.siteSettings.findFirst(), 10000);
    if (!settings?.sitemapConfig) return null;
    return JSON.parse(settings.sitemapConfig);
  } catch (error) {
    return null;
  }
}

export async function updateSitemapConfig(values: any) {
  try {
    const existingSettings = await withTimeout(
      prisma.siteSettings.findFirst(),
      10000
    );

    const config = {
      enabled: values.enabled,
      includeImages: values.includeImages,
      exclude: values.exclude || [],
      additionalUrls: values.additionalUrls || []
    };

    if (existingSettings) {
      await withTimeout(
        prisma.siteSettings.update({
          where: { id: existingSettings.id },
          data: {
            sitemapConfig: JSON.stringify(config)
          }
        }),
        10000
      );
    } else {
      await withTimeout(
        prisma.siteSettings.create({
          data: {
            sitemapConfig: JSON.stringify(config)
          }
        }),
        10000
      );
    }

    revalidatePath('/dashboard/franker/sitemap');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update sitemap configuration' };
  }
}

export async function getImageSeoConfig() {
  try {
    const settings = await withTimeout(prisma.siteSettings.findFirst(), 10000);
    if (!settings?.imageSeoConfig) return null;
    return JSON.parse(settings.imageSeoConfig);
  } catch (error) {
    return null;
  }
}

export async function updateImageSeoConfig(values: any) {
  try {
    const existingSettings = await withTimeout(
      prisma.siteSettings.findFirst(),
      10000
    );

    const config = {
      autoAlt: values.autoAlt,
      altTemplate: values.altTemplate,
      autoTitle: values.autoTitle,
      titleTemplate: values.titleTemplate
    };

    if (existingSettings) {
      await withTimeout(
        prisma.siteSettings.update({
          where: { id: existingSettings.id },
          data: {
            imageSeoConfig: JSON.stringify(config)
          }
        }),
        10000
      );
    } else {
      await withTimeout(
        prisma.siteSettings.create({
          data: {
            imageSeoConfig: JSON.stringify(config)
          }
        }),
        10000
      );
    }

    revalidatePath('/dashboard/franker/image-seo');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to update image SEO configuration'
    };
  }
}

export async function getContentAiConfig() {
  try {
    const settings = await withTimeout(prisma.siteSettings.findFirst(), 10000);
    if (!settings?.aiConfig) return null;
    return JSON.parse(settings.aiConfig);
  } catch (error) {
    return null;
  }
}

export async function updateContentAiConfig(values: any) {
  try {
    const existingSettings = await withTimeout(
      prisma.siteSettings.findFirst(),
      10000
    );

    const config = {
      provider: values.provider,
      apiKey: values.apiKey,
      model: values.model,
      temperature: values.temperature,
      maxTokens: values.maxTokens
    };

    if (existingSettings) {
      await withTimeout(
        prisma.siteSettings.update({
          where: { id: existingSettings.id },
          data: {
            aiConfig: JSON.stringify(config)
          }
        }),
        10000
      );
    } else {
      await withTimeout(
        prisma.siteSettings.create({
          data: {
            aiConfig: JSON.stringify(config)
          }
        }),
        10000
      );
    }

    revalidatePath('/dashboard/franker/content-ai');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to update Content AI configuration'
    };
  }
}

export async function getIndexingConfig() {
  try {
    const settings = await withTimeout(prisma.siteSettings.findFirst(), 10000);
    if (!settings?.indexingConfig) return null;
    return JSON.parse(settings.indexingConfig);
  } catch (error) {
    return null;
  }
}

export async function updateIndexingConfig(values: any) {
  try {
    const existingSettings = await withTimeout(
      prisma.siteSettings.findFirst(),
      10000
    );

    const config = {
      googleJson: values.googleJson,
      bingApiKey: values.bingApiKey,
      indexNowEnabled: values.indexNowEnabled,
      googleIndexingEnabled: values.googleIndexingEnabled
    };

    if (existingSettings) {
      await withTimeout(
        prisma.siteSettings.update({
          where: { id: existingSettings.id },
          data: {
            indexingConfig: JSON.stringify(config)
          }
        }),
        10000
      );
    } else {
      await withTimeout(
        prisma.siteSettings.create({
          data: {
            indexingConfig: JSON.stringify(config)
          }
        }),
        10000
      );
    }

    revalidatePath('/dashboard/franker/instant-indexing');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to update Instant Indexing configuration'
    };
  }
}

export async function getLocalSeoConfig() {
  try {
    const settings = await withTimeout(prisma.siteSettings.findFirst(), 10000);
    if (!settings?.localSeoConfig) return null;
    return JSON.parse(settings.localSeoConfig);
  } catch (error) {
    return null;
  }
}

export async function updateLocalSeoConfig(values: any) {
  try {
    const existingSettings = await withTimeout(
      prisma.siteSettings.findFirst(),
      10000
    );

    const config = {
      businessName: values.businessName,
      type: values.type,
      streetAddress: values.streetAddress,
      city: values.city,
      state: values.state,
      zipCode: values.zipCode,
      country: values.country,
      phone: values.phone,
      priceRange: values.priceRange,
      openingHours: values.openingHours,
      mapUrl: values.mapUrl
    };

    if (existingSettings) {
      await withTimeout(
        prisma.siteSettings.update({
          where: { id: existingSettings.id },
          data: {
            localSeoConfig: JSON.stringify(config)
          }
        }),
        10000
      );
    } else {
      await withTimeout(
        prisma.siteSettings.create({
          data: {
            localSeoConfig: JSON.stringify(config)
          }
        }),
        10000
      );
    }

    revalidatePath('/dashboard/franker/local-seo');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to update Local SEO configuration'
    };
  }
}

export async function getRoleManagerConfig() {
  try {
    const settings = await withTimeout(prisma.siteSettings.findFirst(), 10000);
    if (!settings?.roleManagerConfig) return null;
    return JSON.parse(settings.roleManagerConfig);
  } catch (error) {
    return null;
  }
}

export async function updateRoleManagerConfig(values: any) {
  try {
    const existingSettings = await withTimeout(
      prisma.siteSettings.findFirst(),
      10000
    );

    // values is Record<role, moduleIds[]>
    const config = values;

    if (existingSettings) {
      await withTimeout(
        prisma.siteSettings.update({
          where: { id: existingSettings.id },
          data: {
            roleManagerConfig: JSON.stringify(config)
          }
        }),
        10000
      );
    } else {
      await withTimeout(
        prisma.siteSettings.create({
          data: {
            roleManagerConfig: JSON.stringify(config)
          }
        }),
        10000
      );
    }

    revalidatePath('/dashboard/franker/role-manager');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to update Role Manager configuration'
    };
  }
}

export async function getAnalyticsConfig() {
  try {
    const settings = await withTimeout(prisma.siteSettings.findFirst(), 10000);
    if (!settings?.analyticsConfig) return null;
    return JSON.parse(settings.analyticsConfig);
  } catch (error) {
    return null;
  }
}

export async function updateAnalyticsConfig(values: any) {
  try {
    const existingSettings = await withTimeout(
      prisma.siteSettings.findFirst(),
      10000
    );

    const config = {
      embedUrl: values.embedUrl,
      showInDashboard: values.showInDashboard
    };

    if (existingSettings) {
      await withTimeout(
        prisma.siteSettings.update({
          where: { id: existingSettings.id },
          data: {
            analyticsConfig: JSON.stringify(config)
          }
        }),
        10000
      );
    } else {
      await withTimeout(
        prisma.siteSettings.create({
          data: {
            analyticsConfig: JSON.stringify(config)
          }
        }),
        10000
      );
    }

    revalidatePath('/dashboard/franker/analytics');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to update Analytics configuration'
    };
  }
}
