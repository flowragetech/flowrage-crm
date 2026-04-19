'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { withTimeout } from '@/lib/utils';

export async function getMediaItems() {
  try {
    return await withTimeout(
      prisma.media.findMany({
        orderBy: { createdAt: 'desc' }
      }),
      10000
    );
  } catch (error) {
    return [];
  }
}

export async function deleteMedia(id: string) {
  try {
    // 1. Get the media item to find its URL
    const item = await withTimeout(
      prisma.media.findUnique({
        where: { id }
      }),
      10000
    );

    if (item) {
      // 2. Extract filename from URL (e.g., /uploads/name.png -> name.png)
      const fileName = item.url.split('/').pop();
      if (fileName) {
        const filePath = join(process.cwd(), 'public', 'uploads', fileName);
        try {
          await unlink(filePath);
        } catch {
          // Continue with database deletion even if file is missing
        }
      }
    }

    await withTimeout(
      prisma.media.delete({
        where: { id }
      }),
      10000
    );
    revalidatePath('/dashboard/media');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete media' };
  }
}

export async function updateMediaDetails(
  id: string,
  data: {
    name?: string;
    altText?: string;
    caption?: string;
    description?: string;
    category?: string;
  }
) {
  try {
    await withTimeout(
      prisma.media.update({
        where: { id },
        data
      }),
      10000
    );
    revalidatePath('/dashboard/media');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update details' };
  }
}

// Update addMediaEntry to include new fields
export async function addMediaEntry(data: {
  name: string;
  url: string;
  key: string;
  size: number;
  type: string;
  width?: number;
  height?: number;
  category?: string;
}) {
  try {
    const media = await withTimeout(
      prisma.media.create({
        data
      }),
      10000
    );
    revalidatePath('/dashboard/media');
    return { success: true, media };
  } catch (error) {
    return { success: false, error: 'Failed to add media to database' };
  }
}
