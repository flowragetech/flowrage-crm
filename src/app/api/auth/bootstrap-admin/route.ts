import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      error:
        'Manual bootstrap has been removed. Use /setup to initialize the system.'
    },
    { status: 410 }
  );
}
