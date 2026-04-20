import fs from 'fs';
import path from 'path';
import { UpdateCommandPlan, UpdateDriver } from '@/lib/updates/types';

const DEFAULT_BACKUP_DIRECTORY = path.join(process.cwd(), 'backups');

function detectPackageManagerInstallCommand() {
  const cwd = process.cwd();

  if (fs.existsSync(path.join(cwd, 'package-lock.json'))) {
    return 'npm ci';
  }

  if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) {
    return 'pnpm install --frozen-lockfile';
  }

  if (fs.existsSync(path.join(cwd, 'yarn.lock'))) {
    return 'yarn install --frozen-lockfile';
  }

  if (fs.existsSync(path.join(cwd, 'bun.lock'))) {
    return 'bun install --frozen-lockfile';
  }

  return 'npm install';
}

export function getUpdateConfig() {
  const driver = (process.env.UPDATE_DRIVER?.trim() || 'git') as UpdateDriver;
  const workingDirectory = process.env.UPDATE_WORKDIR?.trim() || process.cwd();
  const backupDirectory =
    process.env.UPDATE_BACKUP_DIR?.trim() || DEFAULT_BACKUP_DIRECTORY;

  const commands: UpdateCommandPlan = {
    pull: process.env.UPDATE_PULL_COMMAND?.trim() || 'git pull --ff-only',
    install:
      process.env.UPDATE_INSTALL_COMMAND?.trim() ||
      detectPackageManagerInstallCommand(),
    migrate:
      process.env.UPDATE_MIGRATE_COMMAND?.trim() || 'npx prisma migrate deploy',
    build: process.env.UPDATE_BUILD_COMMAND?.trim() || 'npm run build',
    restart: process.env.UPDATE_RESTART_COMMAND?.trim() || undefined
  };

  return {
    driver,
    manifestUrl: process.env.UPDATE_MANIFEST_URL?.trim() || null,
    workingDirectory,
    backupDirectory,
    commands,
    allowDirtyWorkingTree: process.env.UPDATE_ALLOW_DIRTY === 'true',
    commandTimeoutMs: Number.parseInt(
      process.env.UPDATE_COMMAND_TIMEOUT_MS || '1200000',
      10
    ),
    backupCommand: process.env.UPDATE_BACKUP_COMMAND?.trim() || null
  };
}
