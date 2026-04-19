import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

function applyCors(request: NextRequest, response: NextResponse) {
  const origin = request.headers.get('origin') || '*';
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );
  return response;
}

export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );
  const origin = request.headers.get('origin') || '*';
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return applyCors(
        request,
        NextResponse.json({ user: null }, { status: 401 })
      );
    }

    return applyCors(request, NextResponse.json({ user }));
  } catch {
    return applyCors(
      request,
      NextResponse.json({ error: 'Unable to fetch user' }, { status: 500 })
    );
  }
}
