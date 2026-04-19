'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { withTimeout } from '@/lib/utils';

export async function getInquiries() {
  try {
    return await withTimeout(
      prisma.inquiry.findMany({
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

export async function getInquiryById(id: string) {
  try {
    return await withTimeout(
      prisma.inquiry.findUnique({
        where: { id }
      }),
      10000
    );
  } catch (error) {
    return null;
  }
}

export async function updateInquiryStatus(id: string, status: string) {
  try {
    await withTimeout(
      prisma.inquiry.update({
        where: { id },
        data: { status }
      }),
      10000
    );
    revalidatePath('/dashboard/inquiries');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update status' };
  }
}

export async function deleteInquiry(id: string) {
  try {
    await withTimeout(
      prisma.inquiry.delete({
        where: { id }
      }),
      10000
    );
    revalidatePath('/dashboard/inquiries');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete inquiry' };
  }
}

export async function createInquiry(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  try {
    const inquiry = await withTimeout(
      prisma.inquiry.create({
        data
      }),
      10000
    );
    revalidatePath('/dashboard/inquiries');
    return { success: true, inquiry };
  } catch (error) {
    return { success: false, error: 'Failed to create inquiry' };
  }
}
