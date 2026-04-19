import { getCurrentUser } from '@/lib/auth';
import { UpdateService } from '@/lib/updates/service';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function isAdminRole(role?: string | null) {
  return role === 'ADMIN' || role === 'SUPER_ADMIN';
}

export async function GET() {
  const currentUser = await getCurrentUser();

  if (!currentUser || !isAdminRole(currentUser.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const service = new UpdateService();
    const result = await service.checkForUpdates();

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to check for updates.';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
