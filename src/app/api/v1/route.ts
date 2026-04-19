import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'online',
    message: 'CRM Core API v1 is running',
    timestamp: new Date().toISOString(),
    documentation: '/docs'
  });
}
