import { UpdateManifest } from '@/lib/updates/types';

export async function fetchUpdateManifest(manifestUrl: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(manifestUrl, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(
        `Manifest request failed with status ${response.status}.`
      );
    }

    const payload = (await response.json()) as UpdateManifest;

    if (!payload.latest) {
      throw new Error('Manifest response is missing the latest version.');
    }

    return payload;
  } finally {
    clearTimeout(timer);
  }
}
