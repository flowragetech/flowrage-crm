import { prisma } from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const portfolio = await prisma.portfolio.findMany({
      include: {
        seoMetadata: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const baseUrl = `${protocol}://${host}`;

    const enhancedPortfolio = portfolio.map((item) => ({
      ...item,
      image:
        item.image && item.image.startsWith('/')
          ? `${baseUrl}${item.image}`
          : item.image,
      seoMetadata: item.seoMetadata
        ? {
            ...item.seoMetadata,
            ogImage:
              item.seoMetadata.ogImage &&
              item.seoMetadata.ogImage.startsWith('/')
                ? `${baseUrl}${item.seoMetadata.ogImage}`
                : item.seoMetadata.ogImage
          }
        : null
    }));

    return NextResponse.json(enhancedPortfolio);
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
