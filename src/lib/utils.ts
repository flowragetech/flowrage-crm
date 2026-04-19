import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: 'accurate' | 'normal';
  } = {}
) {
  const { decimals = 0, sizeType = 'normal' } = opts;

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate'
      ? (accurateSizes[i] ?? 'Bytest')
      : (sizes[i] ?? 'Bytes')
  }`;
}

export function withTimeout<T>(p: Promise<T>, ms: number) {
  return Promise.race<T>([
    p,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), ms)
    )
  ]);
}

export function sanitizeAndParseSchema(
  input?: string | object
): any | undefined {
  if (!input) return undefined;
  if (typeof input === 'object') return input;
  if (typeof input !== 'string') return undefined;

  const trimmed = input.trim();
  if (!trimmed) return undefined;
  // Strip optional <script> wrappers if pasted directly
  const withoutScript = trimmed
    .replace(/^<script[^>]*type=["']application\/ld\+json["'][^>]*>/i, '')
    .replace(/<\/script>\s*$/i, '');
  // Prevent excessively large payloads from blocking the request
  if (withoutScript.length > 500_000) {
    throw new Error('Schema Markup is too large (max 500KB).');
  }
  try {
    return JSON.parse(withoutScript);
  } catch {
    throw new Error(
      'Invalid JSON-LD provided. Please ensure it is valid JSON.'
    );
  }
}
