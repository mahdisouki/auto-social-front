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

const FALLBACK_DATA: Record<BestTimeCategoryKey, Record<string, string>> = {
  accessoires: {
    Monday: '16:00',
    Tuesday: '19:30',
    Wednesday: '18:30',
    Thursday: '18:30',
    Friday: '15:00',
    Saturday: '17:00',
    Sunday: '16:30',
  },
  beauty: {
    Monday: '17:00',
    Tuesday: '18:30',
    Wednesday: '16:00',
    Thursday: '18:00',
    Friday: '18:00',
    Saturday: '18:00',
    Sunday: '20:30',
  },
  clothes: {
    Monday: '23:30',
    Tuesday: '22:00',
    Wednesday: '11:30',
    Thursday: '17:30',
    Friday: '17:00',
    Saturday: '23:00',
    Sunday: '19:30',
  },
  food: {
    Monday: '23:30',
    Tuesday: '22:00',
    Wednesday: '11:30',
    Thursday: '19:30',
    Friday: '20:00',
    Saturday: '20:30',
    Sunday: '19:30',
  },
  technology: {
    Monday: '18:30',
    Tuesday: '20:00',
    Wednesday: '21:00',
    Thursday: '15:30',
    Friday: '10:30',
    Saturday: '12:00',
    Sunday: '15:30',
  },
};

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

export function getBestTimesForCategory(category: BestTimeCategoryKey) {
  return FALLBACK_DATA[category];
}

/**
 * Returns the best UTC Date for a given day.
 * Uses the recommend-best-time API, falling back to in-code data if unavailable.
 */
export async function getBestScheduledAtForDate(
  category: BestTimeCategoryKey,
  date: Date
): Promise<{ scheduledAtUtc: Date; timeHHmm: string }> {
  const dayKey = toDayKey(date);
  let timeHHmm: string | null = null;

  try {
    const recommendations = await fetchBestTimeRecommendations(category);
    timeHHmm = getBestTimeForDay(recommendations, dayKey);
  } catch {
    // fall through to fallback
  }

  if (!timeHHmm) {
    timeHHmm = FALLBACK_DATA[category]?.[dayKey] ?? null;
  }

  if (!timeHHmm) {
    throw new Error(`No best time found for ${dayKey}`);
  }

  const { hours, minutes } = parseHHmm(timeHHmm);

  const y = date.getUTCFullYear();
  const m = date.getUTCMonth();
  const d = date.getUTCDate();

  const scheduledAtUtc = new Date(Date.UTC(y, m, d, hours, minutes, 0, 0));
  return { scheduledAtUtc, timeHHmm };
}
