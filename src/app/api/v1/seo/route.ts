import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const seo = await prisma.globalSeo.findFirst();

    if (!seo) {
      return NextResponse.json(null);
    }

    return NextResponse.json(seo);
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
