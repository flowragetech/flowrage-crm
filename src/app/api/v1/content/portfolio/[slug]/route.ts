import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const portfolio = await prisma.portfolio.findUnique({
      where: { slug },
      include: {
        seoMetadata: true
      }
    });

    if (!portfolio) {
      return NextResponse.json(
        { error: 'Portfolio item not found' },
        { status: 404 }
      );
    }

    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const baseUrl = `${protocol}://${host}`;

    const enhancedPortfolio = {
      ...portfolio,
      image:
        portfolio.image && portfolio.image.startsWith('/')
          ? `${baseUrl}${portfolio.image}`
          : portfolio.image,
      seoMetadata: portfolio.seoMetadata
        ? {
            ...portfolio.seoMetadata,
            ogImage:
              portfolio.seoMetadata.ogImage &&
              portfolio.seoMetadata.ogImage.startsWith('/')
                ? `${baseUrl}${portfolio.seoMetadata.ogImage}`
                : portfolio.seoMetadata.ogImage
          }
        : null
    };

    return NextResponse.json(enhancedPortfolio);
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
