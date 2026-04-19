import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    reportingOptions: [],
    expertOptions: [],
    deprecated: true,
    message: 'Configuration options moved into modular CRM Core settings.'
  });
}
