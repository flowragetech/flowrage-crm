'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { withTimeout } from '@/lib/utils';
import nodemailer from 'nodemailer';

export async function updateSiteSettings(values: any) {
  try {
    const existingSettings = await withTimeout(
      prisma.siteSettings.findFirst(),
      10000
    );

    const previousSmtp = (existingSettings as any)?.smtpSettings as any;

    const smtpSettings =
      values.smtpHost ||
      values.smtpPort ||
      values.smtpUser ||
      values.smtpPassword ||
      values.smtpFromName ||
      values.smtpFromEmail
        ? {
            host: values.smtpHost || previousSmtp?.host || '',
            port: values.smtpPort
              ? Number(values.smtpPort)
              : (previousSmtp?.port ?? null),
            user: values.smtpUser || previousSmtp?.user || '',
            password:
              values.smtpPassword && values.smtpPassword.trim() !== ''
                ? values.smtpPassword
                : previousSmtp?.password || '',
            fromName: values.smtpFromName || previousSmtp?.fromName || '',
            fromEmail: values.smtpFromEmail || previousSmtp?.fromEmail || ''
          }
        : previousSmtp || null;

    const data = {
      siteName: values.siteName,
      siteDescription: values.siteDescription,
      logo: values.logo,
      favicon: values.favicon,
      primaryColor: values.primaryColor,
      secondaryColor: values.secondaryColor,
      contactInfo: JSON.stringify({
        email: values.contactEmail,
        phone: values.contactPhone,
        address: values.contactAddress,
        whatsapp: values.contactWhatsapp
      }),
      socialLinks: JSON.stringify({
        facebook: values.facebook,
        twitter: values.twitter,
        linkedin: values.linkedin,
        instagram: values.instagram,
        youtube: values.youtube
      }),
      currencyCode: values.currencyCode,
      currencySymbol: values.currencySymbol,
      smtpSettings: smtpSettings ? JSON.stringify(smtpSettings) : null
    };

    if (existingSettings) {
      await withTimeout(
        prisma.siteSettings.update({
          where: { id: existingSettings.id },
          data
        }),
        10000
      );
    } else {
      await withTimeout(
        prisma.siteSettings.create({
          data
        }),
        10000
      );
    }

    revalidatePath('/dashboard/settings');
    revalidatePath('/', 'layout'); // Revalidate global layout for favicon changes
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update site settings' };
  }
}

export async function sendSmtpTest(toEmail: string) {
  try {
    const settings = await withTimeout(prisma.siteSettings.findFirst(), 10000);
    const smtpRaw = (settings as any)?.smtpSettings as any;
    const smtp =
      typeof smtpRaw === 'string' ? JSON.parse(smtpRaw) : smtpRaw || null;
    const siteName = (settings as any)?.siteName || 'CRM Core';

    if (!smtp || !smtp.host || !smtp.user || !smtp.password) {
      return { success: false, error: 'SMTP settings are incomplete' };
    }

    const transport = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port || 587,
      secure: smtp.port === 465,
      auth: {
        user: smtp.user,
        pass: smtp.password
      }
    });

    await transport.verify();

    await transport.sendMail({
      from: smtp.fromEmail || smtp.user,
      to: toEmail,
      subject: `SMTP Test | ${siteName}`,
      text: `This is a test email to verify SMTP settings from ${siteName}.`
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to send test email' };
  }
}
