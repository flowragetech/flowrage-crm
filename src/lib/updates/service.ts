import { prisma } from '@/lib/prisma';
import { getUpdateConfig } from '@/lib/updates/config';
import { execCommand } from '@/lib/updates/exec';
import { fetchUpdateManifest } from '@/lib/updates/manifest';
import { isVersionNewer } from '@/lib/updates/semver';
import { UpdateCheckResult } from '@/lib/updates/types';
import {
  ensureCurrentVersionSynced,
  readLocalAppVersion
} from '@/lib/system-version';

function serializeJob(
  job: {
    id: string;
    status: string;
    targetVersion: string | null;
    summary: string | null;
    errorMessage: string | null;
    backupPath: string | null;
    restartRequired: boolean;
    createdAt: Date;
    updatedAt: Date;
    startedAt: Date | null;
    completedAt: Date | null;
  } | null
) {
  if (!job) {
    return null;
  }

  return {
    ...job,
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
    startedAt: job.startedAt?.toISOString() || null,
    completedAt: job.completedAt?.toISOString() || null
  };
}

export class UpdateService {
  async checkForUpdates(): Promise<UpdateCheckResult> {
    await ensureCurrentVersionSynced();

    const config = getUpdateConfig();
    const currentVersion = await readLocalAppVersion();
    const latestJob = await prisma.systemUpdateJob.findFirst({
      orderBy: {
        createdAt: 'desc'
      }
    });

    const capabilityWarnings: string[] = [];
    const blockingIssues: string[] = [];

    if (!config.manifestUrl) {
      const message =
        'UPDATE_MANIFEST_URL is not configured, so remote version checks are disabled.';
      capabilityWarnings.push(message);
      blockingIssues.push(message);
    }

    if (!config.commands.restart) {
      capabilityWarnings.push(
        'No restart command is configured. Use an external supervisor or set UPDATE_RESTART_COMMAND.'
      );
    }

    if (config.driver === 'git') {
      try {
        await execCommand('git rev-parse --is-inside-work-tree', {
          cwd: config.workingDirectory,
          timeoutMs: 10000
        });
      } catch {
        const message =
          'Git update mode is enabled but the working directory is not a Git repository.';
        capabilityWarnings.push(message);
        blockingIssues.push(message);
      }
    }

    let latestVersion: string | null = null;
    let changelog: string | null = null;
    let downloadUrl: string | null = null;

    if (config.manifestUrl) {
      try {
        const manifest = await fetchUpdateManifest(config.manifestUrl);
        latestVersion = manifest.latest;
        changelog = manifest.changelog || null;
        downloadUrl = manifest.downloadUrl || null;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Failed to fetch the remote update manifest.';
        capabilityWarnings.push(message);
        blockingIssues.push(message);
      }
    }

    return {
      currentVersion,
      latestVersion,
      updateAvailable:
        latestVersion !== null && isVersionNewer(latestVersion, currentVersion),
      manifestUrl: config.manifestUrl,
      downloadUrl,
      changelog,
      strategy: config.driver,
      canRunUpdates: blockingIssues.length === 0,
      capabilityWarnings,
      environment: {
        workingDirectory: config.workingDirectory,
        backupDirectory: config.backupDirectory,
        restartCommandConfigured: Boolean(config.commands.restart)
      },
      latestJob: serializeJob(latestJob)
    };
  }

  async getLatestJob() {
    const latestJob = await prisma.systemUpdateJob.findFirst({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return serializeJob(latestJob);
  }

  async createUpdateJob(userId: string) {
    const check = await this.checkForUpdates();

    if (!check.canRunUpdates) {
      throw new Error(check.capabilityWarnings.join(' '));
    }

    if (!check.updateAvailable || !check.latestVersion) {
      throw new Error('No newer version is currently available.');
    }

    const runningJob = await prisma.systemUpdateJob.findFirst({
      where: {
        status: {
          in: ['queued', 'running']
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (runningJob) {
      throw new Error('Another update job is already running.');
    }

    return prisma.systemUpdateJob.create({
      data: {
        currentVersion: check.currentVersion,
        targetVersion: check.latestVersion,
        status: 'queued',
        strategy: check.strategy,
        manifestUrl: check.manifestUrl,
        changelog: check.changelog,
        downloadUrl: check.downloadUrl,
        summary: 'Update queued.',
        triggeredByUserId: userId,
        restartRequired: !check.environment.restartCommandConfigured
      }
    });
  }
}
