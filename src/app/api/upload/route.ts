import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentUser } from '@/lib/auth';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (
      !currentUser ||
      (currentUser.role !== 'ADMIN' &&
        currentUser.role !== 'SUPER_ADMIN' &&
        currentUser.role !== 'EDITOR' &&
        currentUser.role !== 'AUTHOR')
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File too large. Max size is 5MB.' },
        { status: 413 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueId = uuidv4();
    const extension = file.name.split('.').pop();
    const fileName = extension ? `${uniqueId}.${extension}` : uniqueId;

    const path = join(process.cwd(), 'public', 'uploads', fileName);

    await writeFile(path, buffer);

    const url = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      url,
      name: file.name,
      size: file.size,
      type: file.type
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
