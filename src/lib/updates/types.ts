export type UpdateDriver = 'git' | 'custom';

export type UpdateStatus =
  | 'queued'
  | 'running'
  | 'completed'
  | 'failed'
  | 'no-update'
  | 'blocked';

export type UpdateManifest = {
  latest: string;
  downloadUrl?: string;
  changelog?: string;
  minimumSupportedVersion?: string;
};

export type UpdateCheckResult = {
  currentVersion: string;
  latestVersion: string | null;
  updateAvailable: boolean;
  manifestUrl: string | null;
  downloadUrl: string | null;
  changelog: string | null;
  strategy: UpdateDriver;
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

export type UpdateCommandPlan = {
  pull: string;
  install: string;
  migrate: string;
  build: string;
  restart?: string;
};
