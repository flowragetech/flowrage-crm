import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const tag = await prisma.tag.findUnique({
      where: { slug },
      include: {
        seoMetadata: true,
        posts: {
          where: { published: true },
          include: {
            seoMetadata: true,
            categories: true,
            tags: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!tag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }

    return NextResponse.json(tag);
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
