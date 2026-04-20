import path from 'path';
import { readFile } from 'fs/promises';
import { prisma } from '@/lib/prisma';

const APP_VERSION_META_KEY = 'system.version.current';

const globalForVersionSync = globalThis as unknown as {
  systemVersionSyncPromise?: Promise<void>;
};

export async function readLocalAppVersion() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const raw = await readFile(packageJsonPath, 'utf8');
  const packageJson = JSON.parse(raw) as { version?: string };

  return packageJson.version?.trim() || '0.0.0';
}

export async function ensureCurrentVersionSynced() {
  if (!globalForVersionSync.systemVersionSyncPromise) {
    globalForVersionSync.systemVersionSyncPromise = (async () => {
      try {
        const version = await readLocalAppVersion();

        await prisma.appMeta.upsert({
          where: {
            key: APP_VERSION_META_KEY
          },
          update: {
            value: version
          },
          create: {
            key: APP_VERSION_META_KEY,
            value: version
          }
        });
      } catch (error) {
        void error;
      }
    })();
  }

  return globalForVersionSync.systemVersionSyncPromise;
}

export const appVersionMetaKey = APP_VERSION_META_KEY;
