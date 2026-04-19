import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, userAgent, referer } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const existingLog = await prisma.notFoundLog.findUnique({
      where: { url }
    });

    if (existingLog) {
      await prisma.notFoundLog.update({
        where: { id: existingLog.id },
        data: {
          hits: { increment: 1 },
          lastAccessed: new Date(),
          userAgent: userAgent || existingLog.userAgent,
          referer: referer || existingLog.referer
        }
      });
    } else {
      await prisma.notFoundLog.create({
        data: {
          url,
          userAgent,
          referer,
          hits: 1
        }
      });
    }

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    void error;
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function GET() {
  try {
    const logs = await prisma.notFoundLog.findMany({
      orderBy: { lastAccessed: 'desc' }
    });
    return NextResponse.json(logs, { headers: corsHeaders });
  } catch (error) {
    void error;
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
