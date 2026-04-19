import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const redirects = await prisma.redirect.findMany({
      where: {
        isActive: true
      }
    });

    return NextResponse.json(redirects);
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { source, destination, statusCode, isActive } = body;

    if (!source || !destination) {
      return NextResponse.json(
        { error: 'Source and destination URLs are required' },
        { status: 400 }
      );
    }

    const existingRedirect = await prisma.redirect.findUnique({
      where: { source }
    });

    if (existingRedirect) {
      return NextResponse.json(
        { error: 'Redirect source already exists' },
        { status: 409 }
      );
    }

    const redirect = await prisma.redirect.create({
      data: {
        source,
        destination,
        statusCode: statusCode || 301,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    return NextResponse.json(redirect, { status: 201 });
  } catch (error) {
    void error;
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, source, destination, statusCode, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Redirect ID is required' },
        { status: 400 }
      );
    }

    const redirect = await prisma.redirect.update({
      where: { id },
      data: {
        source,
        destination,
        statusCode,
        isActive
      }
    });

    return NextResponse.json(redirect);
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Redirect ID is required' },
        { status: 400 }
      );
    }

    await prisma.redirect.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    void error;
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
