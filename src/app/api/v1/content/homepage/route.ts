import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const homepage = await prisma.homepage.findFirst({
      include: {
        seoMetadata: true
      }
    });

    if (!homepage) {
      return NextResponse.json(
        { error: 'Homepage content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(homepage);
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
