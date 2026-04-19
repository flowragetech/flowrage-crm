'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { withTimeout, sanitizeAndParseSchema } from '@/lib/utils';

export async function updateTeamPage(values: any) {
  try {
    const existingTeamPage = await withTimeout(
      prisma.teamPage.findFirst({
        include: { seoMetadata: true }
      }),
      10000
    );

    const parsedSchema = sanitizeAndParseSchema(values.schemaMarkup);

    const data = {
      heroTitle: values.heroTitle,
      heroHighlight: values.heroHighlight,
      heroSubtitle: values.heroSubtitle,
      heroDescription: values.heroDescription,
      introTitle: values.introTitle,
      introBody: values.introBody,
      sections: values.sections,
      seoMetadata: {
        upsert: {
          create: {
            metaTitle: values.metaTitle,
            metaDescription: values.metaDescription,
            keywords: values.keywords,
            ogImage: values.ogImage,
            canonical: values.canonical,
            schemaMarkup: parsedSchema
          },
          update: {
            metaTitle: values.metaTitle,
            metaDescription: values.metaDescription,
            keywords: values.keywords,
            ogImage: values.ogImage,
            canonical: values.canonical,
            schemaMarkup: parsedSchema
          }
        }
      }
    };

    if (existingTeamPage) {
      await withTimeout(
        prisma.teamPage.update({
          where: { id: existingTeamPage.id },
          data
        }),
        10000
      );
    } else {
      await withTimeout(
        prisma.teamPage.create({
          data: {
            heroTitle: values.heroTitle,
            heroHighlight: values.heroHighlight,
            heroSubtitle: values.heroSubtitle,
            heroDescription: values.heroDescription,
            introTitle: values.introTitle,
            introBody: values.introBody,
            sections: values.sections,
            seoMetadata: {
              create: {
                metaTitle: values.metaTitle,
                metaDescription: values.metaDescription,
                keywords: values.keywords,
                ogImage: values.ogImage,
                canonical: values.canonical,
                schemaMarkup: parsedSchema
              }
            }
          }
        }),
        10000
      );
    }

    revalidatePath('/dashboard/cms/team');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update team page content' };
  }
}

export async function getTeamMembers() {
  try {
    return await withTimeout(
      prisma.teamMember.findMany({
        orderBy: [
          { isFeatured: 'desc' },
          { ordering: 'asc' },
          { createdAt: 'desc' }
        ]
      }),
      10000
    );
  } catch (error) {
    return [];
  }
}

export async function getTeamMemberById(id: string) {
  try {
    return await withTimeout(
      prisma.teamMember.findUnique({
        where: { id }
      }),
      10000
    );
  } catch (error) {
    return null;
  }
}

export async function createTeamMember(data: {
  name: string;
  role: string;
  slug: string;
  shortBio?: string;
  fullBio?: string;
  photo?: string;
  expertise?: string;
  experience?: string;
  ordering?: number;
  socialLinks?: any;
  isFeatured?: boolean;
}) {
  try {
    const member = await withTimeout(
      prisma.teamMember.create({
        data: {
          name: data.name,
          role: data.role,
          slug: data.slug,
          shortBio: data.shortBio,
          fullBio: data.fullBio,
          photo: data.photo,
          expertise: data.expertise,
          experience: data.experience,
          ordering: data.ordering ?? 0,
          socialLinks:
            typeof data.socialLinks === 'object'
              ? JSON.stringify(data.socialLinks)
              : data.socialLinks,
          isFeatured: data.isFeatured ?? false
        }
      }),
      10000
    );

    revalidatePath('/dashboard/cms/team');
    return { success: true, member };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to create team member'
    };
  }
}

export async function updateTeamMember(
  id: string,
  data: {
    name: string;
    role: string;
    slug: string;
    shortBio?: string;
    fullBio?: string;
    photo?: string;
    expertise?: string;
    experience?: string;
    ordering?: number;
    socialLinks?: any;
    isFeatured?: boolean;
  }
) {
  try {
    const member = await withTimeout(
      prisma.teamMember.update({
        where: { id },
        data: {
          name: data.name,
          role: data.role,
          slug: data.slug,
          shortBio: data.shortBio,
          fullBio: data.fullBio,
          photo: data.photo,
          expertise: data.expertise,
          experience: data.experience,
          ordering: data.ordering ?? 0,
          socialLinks:
            typeof data.socialLinks === 'object'
              ? JSON.stringify(data.socialLinks)
              : data.socialLinks,
          isFeatured: data.isFeatured ?? false
        }
      }),
      10000
    );

    revalidatePath('/dashboard/cms/team');
    return { success: true, member };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to update team member'
    };
  }
}

export async function deleteTeamMember(id: string) {
  try {
    await withTimeout(
      prisma.teamMember.delete({
        where: { id }
      }),
      10000
    );

    revalidatePath('/dashboard/cms/team');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete team member' };
  }
}
