import path from 'path';
import { spawn } from 'child_process';
import { getCurrentUser } from '@/lib/auth';
import { UpdateService } from '@/lib/updates/service';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function isAdminRole(role?: string | null) {
  return role === 'ADMIN' || role === 'SUPER_ADMIN';
}

export async function POST() {
  const currentUser = await getCurrentUser();

  if (!currentUser || !isAdminRole(currentUser.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const service = new UpdateService();
    const job = await service.createUpdateJob(currentUser.id);
    const runnerPath = path.join(
      process.cwd(),
      'scripts',
      'run-system-update.cjs'
    );

    const child = spawn(process.execPath, [runnerPath, job.id], {
      cwd: process.cwd(),
      detached: true,
      stdio: 'ignore',
      windowsHide: true,
      env: process.env
    });

    child.unref();

    return NextResponse.json({
      success: true,
      jobId: job.id,
      message: 'Update job started.'
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to start update.';

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
