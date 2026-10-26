export interface ParsedRangeSuffix {
  since?: number;
  until?: number;
}

export const parseRangeSuffix = (suffix: string): ParsedRangeSuffix => {
  const trimmed = suffix.trim();
  if (!trimmed) {
    return {};
  }

  if (trimmed.startsWith("desde-")) {
    const since = Number(trimmed.slice("desde-".length));
    return Number.isFinite(since) ? { since } : {};
  }

  if (trimmed.startsWith("hasta-")) {
    const until = Number(trimmed.slice("hasta-".length));
    return Number.isFinite(until) ? { until } : {};
  }

  const match = trimmed.match(/^(\d+)-(\d+)$/);
  if (!match) {
    return {};
  }

  const since = Number(match[1]);
  const until = Number(match[2]);
  if (!Number.isFinite(since) || !Number.isFinite(until)) {
    return {};
  }

  return { since, until };
};

export const buildRangeSuffix = (
  since?: number,
  until?: number,
): string | undefined => {
  if (since !== undefined && until !== undefined) {
    return `${since}-${until}`;
  }
  if (since !== undefined) {
    return `desde-${since}`;
  }
  if (until !== undefined) {
    return `hasta-${until}`;
  }
  return undefined;
};
