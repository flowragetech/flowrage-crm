import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const pages = await prisma.staticPage.findMany({
      include: {
        seoMetadata: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(pages);
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
