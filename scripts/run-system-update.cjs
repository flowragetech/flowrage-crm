#!/usr/bin/env node

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { exec } = require('child_process');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const jobId = process.argv[2];

if (!jobId) {
  console.error('A system update job id is required.');
  process.exit(1);
}

function getConfig() {
  return {
    manifestUrl: process.env.UPDATE_MANIFEST_URL || null,
    workingDirectory: process.env.UPDATE_WORKDIR || process.cwd(),
    backupDirectory:
      process.env.UPDATE_BACKUP_DIR ||
      path.join(process.cwd(), 'backups'),
    allowDirtyWorkingTree: process.env.UPDATE_ALLOW_DIRTY === 'true',
    commandTimeoutMs: Number.parseInt(
      process.env.UPDATE_COMMAND_TIMEOUT_MS || '1200000',
      10
    ),
    backupCommand: process.env.UPDATE_BACKUP_COMMAND || null,
    commands: {
      pull: process.env.UPDATE_PULL_COMMAND || 'git pull --ff-only',
      install: process.env.UPDATE_INSTALL_COMMAND || 'npm install',
      migrate:
        process.env.UPDATE_MIGRATE_COMMAND || 'npx prisma migrate deploy',
      build: process.env.UPDATE_BUILD_COMMAND || 'npm run build',
      restart: process.env.UPDATE_RESTART_COMMAND || null
    }
  };
}

function runCommand(command, options = {}) {
  return new Promise((resolve, reject) => {
    exec(
      command,
      {
        cwd: options.cwd,
        timeout: options.timeoutMs,
        windowsHide: true,
        maxBuffer: 1024 * 1024 * 20
      },
      (error, stdout, stderr) => {
        if (error) {
          reject(
            new Error(
              [error.message, stderr && stderr.trim()]
                .filter(Boolean)
                .join('\n')
                .trim()
            )
          );
          return;
        }

        resolve({
          stdout: (stdout || '').trim(),
          stderr: (stderr || '').trim()
        });
      }
    );
  });
}

function parseDatabaseUrl(rawUrl) {
  const url = new URL(rawUrl);
  const database = url.pathname.replace(/^\//, '');

  return {
    username: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    host: url.hostname,
    port: url.port || '5432',
    database,
    schema: url.searchParams.get('schema') || 'public'
  };
}

async function appendJobLog(message) {
  const existing = await prisma.systemUpdateJob.findUnique({
    where: { id: jobId },
    select: { log: true }
  });

  const nextLog = `${existing?.log || ''}${existing?.log ? '\n' : ''}${new Date().toISOString()} ${message}`;

  await prisma.systemUpdateJob.update({
    where: { id: jobId },
    data: {
      log: nextLog
    }
  });
}

async function updateJob(data) {
  await prisma.systemUpdateJob.update({
    where: { id: jobId },
    data
  });
}

async function readVersion(workingDirectory) {
  const packageJsonPath = path.join(workingDirectory, 'package.json');
  const raw = await fsp.readFile(packageJsonPath, 'utf8');
  const packageJson = JSON.parse(raw);

  return packageJson.version || '0.0.0';
}

async function backupDatabase(config) {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required to create a database backup.');
  }

  await fsp.mkdir(config.backupDirectory, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(config.backupDirectory, `system-update-${timestamp}.sql`);

  if (config.backupCommand) {
    await runCommand(config.backupCommand.replace(/\{backupPath\}/g, backupPath), {
      cwd: config.workingDirectory,
      timeoutMs: config.commandTimeoutMs
    });

    return backupPath;
  }

  const details = parseDatabaseUrl(databaseUrl);
  const pgDumpCommand =
    process.platform === 'win32'
      ? `$env:PGPASSWORD="${details.password}"; pg_dump -h "${details.host}" -p "${details.port}" -U "${details.username}" -d "${details.database}" -n "${details.schema}" -f "${backupPath}"`
      : `PGPASSWORD="${details.password}" pg_dump -h "${details.host}" -p "${details.port}" -U "${details.username}" -d "${details.database}" -n "${details.schema}" -f "${backupPath}"`;

  await runCommand(pgDumpCommand, {
    cwd: config.workingDirectory,
    timeoutMs: config.commandTimeoutMs
  });

  return backupPath;
}

async function ensureCleanWorkingTree(config) {
  const { stdout } = await runCommand('git status --porcelain', {
    cwd: config.workingDirectory,
    timeoutMs: 15000
  });

  if (stdout && !config.allowDirtyWorkingTree) {
    throw new Error(
      'Working tree has uncommitted changes. Commit or stash them, or set UPDATE_ALLOW_DIRTY=true after reviewing the risk.'
    );
  }

  return stdout;
}

async function executeStep(label, command, config) {
  await appendJobLog(`Running ${label}: ${command}`);
  const result = await runCommand(command, {
    cwd: config.workingDirectory,
    timeoutMs: config.commandTimeoutMs
  });

  if (result.stdout) {
    await appendJobLog(result.stdout);
  }

  if (result.stderr) {
    await appendJobLog(result.stderr);
  }
}

async function main() {
  const config = getConfig();
  const job = await prisma.systemUpdateJob.findUnique({
    where: { id: jobId }
  });

  if (!job) {
    throw new Error(`System update job ${jobId} was not found.`);
  }

  await updateJob({
    status: 'running',
    startedAt: new Date(),
    summary: 'Creating backup and applying update.'
  });

  await appendJobLog(`Update job started for target version ${job.targetVersion || 'unknown'}.`);

  if (!fs.existsSync(config.workingDirectory)) {
    throw new Error(`Working directory does not exist: ${config.workingDirectory}`);
  }

  await ensureCleanWorkingTree(config);
  await appendJobLog('Working tree check passed.');

  const backupPath = await backupDatabase(config);
  await updateJob({ backupPath });
  await appendJobLog(`Database backup created at ${backupPath}.`);

  await executeStep('source update', config.commands.pull, config);
  await executeStep('dependency install', config.commands.install, config);
  await executeStep('database migrations', config.commands.migrate, config);
  await executeStep('application build', config.commands.build, config);

  const newVersion = await readVersion(config.workingDirectory);

  await prisma.appMeta.upsert({
    where: {
      key: 'system.version.current'
    },
    update: {
      value: newVersion
    },
    create: {
      key: 'system.version.current',
      value: newVersion
    }
  });

  if (config.commands.restart) {
    await executeStep('restart', config.commands.restart, config);
    await appendJobLog('Restart command completed.');
  } else {
    await appendJobLog(
      'No restart command configured. An external supervisor should recycle the app process.'
    );
  }

  await updateJob({
    status: 'completed',
    currentVersion: newVersion,
    completedAt: new Date(),
    summary: `Updated successfully to ${newVersion}.`,
    restartRequired: !config.commands.restart
  });
}

main()
  .catch(async (error) => {
    const message =
      error instanceof Error ? error.message : 'Unknown system update error.';

    try {
      await appendJobLog(`Update failed: ${message}`);
      await updateJob({
        status: 'failed',
        completedAt: new Date(),
        errorMessage: message,
        summary: 'Update failed. Review the job log and backup before retrying.'
      });
    } catch (innerError) {
      console.error(innerError);
    }

    console.error(message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
