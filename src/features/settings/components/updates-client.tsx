'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { toast } from 'sonner';

type UpdatePayload = {
  currentVersion: string;
  latestVersion: string | null;
  updateAvailable: boolean;
  manifestUrl: string | null;
  downloadUrl: string | null;
  changelog: string | null;
  strategy: string;
  canRunUpdates: boolean;
  capabilityWarnings: string[];
  environment: {
    workingDirectory: string;
    backupDirectory: string;
    restartCommandConfigured: boolean;
  };
  latestJob: {
    id: string;
    status: string;
    targetVersion: string | null;
    summary: string | null;
    errorMessage: string | null;
    backupPath: string | null;
    restartRequired: boolean;
    createdAt: string;
    updatedAt: string;
    startedAt: string | null;
    completedAt: string | null;
  } | null;
};

function statusVariant(status?: string | null) {
  switch (status) {
    case 'completed':
      return 'default';
    case 'failed':
      return 'destructive';
    default:
      return 'outline';
  }
}

async function fetchUpdateStatus() {
  const response = await fetch('/api/system/updates/check', {
    cache: 'no-store'
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || 'Failed to load update status.');
  }

  return payload as UpdatePayload;
}

export function UpdatesClient() {
  const [data, setData] = useState<UpdatePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const latestJobId = data?.latestJob?.id;
  const latestJobStatus = data?.latestJob?.status;

  const load = async (silent = false) => {
    if (!silent) {
      setLoading(true);
    }

    try {
      const payload = await fetchUpdateStatus();
      setData(payload);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to load update status.';
      toast.error(message);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const payload = await fetchUpdateStatus();

        if (!cancelled) {
          setData(payload);
        }
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof Error
              ? error.message
              : 'Failed to load update status.';
          toast.error(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (
      !latestJobId ||
      !['queued', 'running'].includes(latestJobStatus || '')
    ) {
      return;
    }

    if (
      typeof document !== 'undefined' &&
      document.visibilityState !== 'visible'
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        void load(true);
      }
    }, 10000);

    return () => window.clearInterval(timer);
  }, [latestJobId, latestJobStatus]);

  const runUpdate = async () => {
    setRunning(true);

    try {
      const response = await fetch('/api/system/updates/run', {
        method: 'POST'
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Failed to start update.');
      }

      toast.success('Update started. Progress will refresh automatically.');
      await load(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to start update.';
      toast.error(message);
    } finally {
      setRunning(false);
    }
  };

  if (loading && !data) {
    return (
      <p className='text-muted-foreground text-sm'>Loading update status...</p>
    );
  }

  if (!data) {
    return (
      <p className='text-destructive text-sm'>Unable to load update status.</p>
    );
  }

  const job = data.latestJob;

  return (
    <div className='space-y-4'>
      <Card>
        <CardHeader>
          <CardTitle>Release Status</CardTitle>
          <CardDescription>
            Check the installed version, latest remote release, and environment
            readiness before applying an update.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid gap-3 md:grid-cols-3'>
            <div className='rounded-lg border p-4'>
              <p className='text-muted-foreground text-xs tracking-wide uppercase'>
                Current version
              </p>
              <p className='mt-2 text-2xl font-semibold'>
                {data.currentVersion}
              </p>
            </div>
            <div className='rounded-lg border p-4'>
              <p className='text-muted-foreground text-xs tracking-wide uppercase'>
                Latest version
              </p>
              <p className='mt-2 text-2xl font-semibold'>
                {data.latestVersion || 'Unavailable'}
              </p>
            </div>
            <div className='rounded-lg border p-4'>
              <p className='text-muted-foreground text-xs tracking-wide uppercase'>
                Update strategy
              </p>
              <p className='mt-2 text-2xl font-semibold uppercase'>
                {data.strategy}
              </p>
            </div>
          </div>

          <div className='flex flex-wrap items-center gap-3'>
            <Badge variant={data.updateAvailable ? 'default' : 'outline'}>
              {data.updateAvailable ? 'Update available' : 'Up to date'}
            </Badge>
            <Badge variant={data.canRunUpdates ? 'default' : 'destructive'}>
              {data.canRunUpdates ? 'Ready to run' : 'Needs configuration'}
            </Badge>
            <Button
              onClick={runUpdate}
              disabled={
                running ||
                !data.updateAvailable ||
                !data.canRunUpdates ||
                ['queued', 'running'].includes(job?.status || '')
              }
            >
              {running || ['queued', 'running'].includes(job?.status || '')
                ? 'Update In Progress'
                : 'Update Now'}
            </Button>
            <Button variant='outline' onClick={() => void load()}>
              Refresh
            </Button>
          </div>

          {data.changelog && (
            <div className='rounded-lg border p-4'>
              <p className='text-sm font-medium'>Changelog</p>
              <p className='text-muted-foreground mt-2 text-sm whitespace-pre-wrap'>
                {data.changelog}
              </p>
            </div>
          )}

          {data.capabilityWarnings.length > 0 && (
            <div className='border-destructive/30 bg-destructive/5 rounded-lg border p-4'>
              <p className='text-destructive text-sm font-medium'>
                Configuration warnings
              </p>
              <div className='text-muted-foreground mt-2 space-y-1 text-sm'>
                {data.capabilityWarnings.map((warning) => (
                  <p key={warning}>{warning}</p>
                ))}
              </div>
            </div>
          )}

          <div className='grid gap-3 md:grid-cols-2'>
            <div className='rounded-lg border p-4'>
              <p className='text-sm font-medium'>Working directory</p>
              <p className='text-muted-foreground mt-2 text-sm break-all'>
                {data.environment.workingDirectory}
              </p>
            </div>
            <div className='rounded-lg border p-4'>
              <p className='text-sm font-medium'>Backup directory</p>
              <p className='text-muted-foreground mt-2 text-sm break-all'>
                {data.environment.backupDirectory}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Latest Update Job</CardTitle>
          <CardDescription>
            Inspect the most recent run, including backup location and any
            failure details.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {!job ? (
            <p className='text-muted-foreground text-sm'>
              No update jobs have been run yet.
            </p>
          ) : (
            <>
              <div className='flex flex-wrap items-center gap-3'>
                <Badge variant={statusVariant(job.status)}>{job.status}</Badge>
                <span className='text-muted-foreground text-sm'>
                  Target version: {job.targetVersion || 'Unknown'}
                </span>
              </div>
              {job.summary && <p className='text-sm'>{job.summary}</p>}
              {job.errorMessage && (
                <p className='text-destructive text-sm'>{job.errorMessage}</p>
              )}
              <div className='grid gap-3 md:grid-cols-2'>
                <div className='rounded-lg border p-4'>
                  <p className='text-sm font-medium'>Backup file</p>
                  <p className='text-muted-foreground mt-2 text-sm break-all'>
                    {job.backupPath || 'No backup recorded'}
                  </p>
                </div>
                <div className='rounded-lg border p-4'>
                  <p className='text-sm font-medium'>Restart</p>
                  <p className='text-muted-foreground mt-2 text-sm'>
                    {job.restartRequired
                      ? 'External restart still required.'
                      : 'Restart handled by configured command.'}
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
