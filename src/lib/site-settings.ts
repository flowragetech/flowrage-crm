import { cache } from 'react';
import { defaultBranding } from '@/config/branding';
import { prisma } from '@/lib/prisma';

type JsonLike = Record<string, unknown> | string | null | undefined;

function parseJson<T extends Record<string, unknown>>(value: JsonLike): T {
  if (!value) {
    return {} as T;
  }

  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch {
      return {} as T;
    }
  }

  return value as T;
}

export const getSiteSettings = cache(async () => {
  const settings = await prisma.siteSettings.findFirst().catch(() => null);

  if (!settings) {
    return {
      ...defaultBranding,
      contactInfo: {},
      socialLinks: {},
      featureFlags: {}
    };
  }

  const rawSettings = settings as Record<string, unknown> | null;

  const contactInfo = parseJson<Record<string, string>>(
    settings?.contactInfo as JsonLike
  );
  const socialLinks = parseJson<Record<string, string>>(
    settings?.socialLinks as JsonLike
  );
  const featureFlags = parseJson<Record<string, boolean>>(
    rawSettings?.featureFlags as JsonLike
  );

  return {
    ...defaultBranding,
    ...settings,
    siteName:
      (rawSettings?.siteName as string | undefined) ?? defaultBranding.siteName,
    siteDescription:
      (rawSettings?.siteDescription as string | undefined) ??
      defaultBranding.siteDescription,
    logo: (rawSettings?.logo as string | undefined) ?? defaultBranding.logo,
    favicon:
      (rawSettings?.favicon as string | undefined) ?? defaultBranding.favicon,
    primaryColor:
      (rawSettings?.primaryColor as string | undefined) ??
      defaultBranding.primaryColor,
    secondaryColor:
      (rawSettings?.secondaryColor as string | undefined) ??
      defaultBranding.secondaryColor,
    contactInfo,
    socialLinks,
    featureFlags
  };
});

export function getModuleTogglesFromSettings(
  featureFlags?: Record<string, boolean>
) {
  return {
    blog: featureFlags?.blog ?? true,
    cms: featureFlags?.cms ?? true,
    crm: featureFlags?.crm ?? true,
    seo: featureFlags?.seo ?? true,
    media: featureFlags?.media ?? true
  };
}
