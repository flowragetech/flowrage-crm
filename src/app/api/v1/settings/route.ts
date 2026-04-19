import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findFirst();

    if (!settings) {
      return NextResponse.json(null);
    }

    return NextResponse.json({
      id: settings.id,
      siteName: settings.siteName,
      siteDescription: settings.siteDescription,
      logo: settings.logo,
      favicon: settings.favicon,
      contactInfo: settings.contactInfo,
      socialLinks: settings.socialLinks,
      currencyCode: settings.currencyCode,
      currencySymbol: settings.currencySymbol,
      smtpSettings: settings.smtpSettings,
      headerData: settings.headerData,
      footerData: settings.footerData,
      updatedAt: settings.updatedAt
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const settings = await prisma.siteSettings.findFirst();

    const dataToUpdate = { ...body };

    // Stringify JSON fields if they are objects
    const jsonFields = [
      'contactInfo',
      'socialLinks',
      'smtpSettings',
      'footerData',
      'headerData',
      'sitemapConfig',
      'imageSeoConfig',
      'aiConfig',
      'indexingConfig',
      'localSeoConfig',
      'roleManagerConfig',
      'analyticsConfig'
    ];

    jsonFields.forEach((field) => {
      if (dataToUpdate[field] && typeof dataToUpdate[field] === 'object') {
        dataToUpdate[field] = JSON.stringify(dataToUpdate[field]);
      }
    });

    if (!settings) {
      // Create if doesn't exist (though usually seeded)
      const newSettings = await prisma.siteSettings.create({
        data: {
          ...dataToUpdate,
          siteName: body.siteName || 'CRM Core'
        }
      });
      return NextResponse.json(newSettings);
    }

    const updatedSettings = await prisma.siteSettings.update({
      where: { id: settings.id },
      data: dataToUpdate
    });

    return NextResponse.json(updatedSettings);
  } catch (error) {
    void error;
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
