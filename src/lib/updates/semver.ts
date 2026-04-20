function normalize(version: string) {
  return version.trim().replace(/^v/i, '').split('-')[0];
}

function toParts(version: string) {
  return normalize(version)
    .split('.')
    .map((part) => Number.parseInt(part, 10))
    .map((part) => (Number.isFinite(part) ? part : 0));
}

export function compareVersions(left: string, right: string) {
  const a = toParts(left);
  const b = toParts(right);
  const length = Math.max(a.length, b.length, 3);

  for (let index = 0; index < length; index += 1) {
    const leftPart = a[index] ?? 0;
    const rightPart = b[index] ?? 0;

    if (leftPart > rightPart) {
      return 1;
    }

    if (leftPart < rightPart) {
      return -1;
    }
  }

  return 0;
}

export function isVersionNewer(candidate: string, current: string) {
  return compareVersions(candidate, current) > 0;
}
