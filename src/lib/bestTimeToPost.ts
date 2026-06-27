import {
  fetchBestTimeRecommendations,
  getBestTimeForDay,
} from './recommendBestTime';

export type BestTimeCategoryKey =
  | 'accessoires'
  | 'beauty'
  | 'clothes'
  | 'food'
  | 'technology';

const DAY_ORDER = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

function toDayKey(date: Date): typeof DAY_ORDER[number] {
  const dayIndex = date.getUTCDay();
  return DAY_ORDER[dayIndex];
}

function parseHHmm(hhmm: string): { hours: number; minutes: number } {
  const [h, m] = hhmm.split(':');
  return { hours: Number(h), minutes: Number(m) };
}

/**
 * UI postType -> DB category key.
 */
export function mapPostTypeToBestTimeCategory(postType: string): BestTimeCategoryKey | null {
  switch (postType) {
    case 'accessories':
      return 'accessoires';
    case 'clothing':
      return 'clothes';
    case 'electronics':
      return 'technology';
    case 'beauty':
      return 'beauty';
    case 'food':
      return 'food';
    default:
      return null;
  }
}

/**
 * Returns the best UTC Date for a given day using the recommend-best-time API.
 */
export async function getBestScheduledAtForDate(
  category: BestTimeCategoryKey,
  date: Date
): Promise<{ scheduledAtUtc: Date; timeHHmm: string }> {
  const dayKey = toDayKey(date);
  const recommendations = await fetchBestTimeRecommendations(category);
  const timeHHmm = getBestTimeForDay(recommendations, dayKey);

  if (!timeHHmm) {
    throw new Error(`Aucun horaire recommande pour ${dayKey}`);
  }

  const { hours, minutes } = parseHHmm(timeHHmm);

  const y = date.getUTCFullYear();
  const m = date.getUTCMonth();
  const d = date.getUTCDate();

  const scheduledAtUtc = new Date(Date.UTC(y, m, d, hours, minutes, 0, 0));
  return { scheduledAtUtc, timeHHmm };
}
