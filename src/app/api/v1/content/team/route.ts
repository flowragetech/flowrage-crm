import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const page = await prisma.teamPage.findFirst({
      include: {
        seoMetadata: true
      }
    });

    const members = await prisma.teamMember.findMany({
      orderBy: [
        { isFeatured: 'desc' },
        { ordering: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json({ page, members });
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
