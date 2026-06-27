import type { BestTimeCategoryKey } from './bestTimeToPost';
import {
  fetchBestTimeRecommendations,
  recommendationsToWeekByDay,
} from './recommendBestTime';

const DAY_ORDER = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

export type BestTimeByDay = Record<typeof DAY_ORDER[number], string | null>;

const FALLBACK_WEEK: Record<BestTimeCategoryKey, BestTimeByDay> = {
  accessoires: {
    Sunday: '16:30',
    Monday: '16:00',
    Tuesday: '19:30',
    Wednesday: '18:30',
    Thursday: '18:30',
    Friday: '15:00',
    Saturday: '17:00',
  },
  beauty: {
    Sunday: '20:30',
    Monday: '17:00',
    Tuesday: '18:30',
    Wednesday: '16:00',
    Thursday: '18:00',
    Friday: '18:00',
    Saturday: '18:00',
  },
  clothes: {
    Sunday: '19:30',
    Monday: '23:30',
    Tuesday: '22:00',
    Wednesday: '11:30',
    Thursday: '17:30',
    Friday: '17:00',
    Saturday: '23:00',
  },
  food: {
    Sunday: '19:30',
    Monday: '23:30',
    Tuesday: '22:00',
    Wednesday: '11:30',
    Thursday: '19:30',
    Friday: '20:00',
    Saturday: '20:30',
  },
  technology: {
    Sunday: '15:30',
    Monday: '18:30',
    Tuesday: '20:00',
    Wednesday: '21:00',
    Thursday: '15:30',
    Friday: '10:30',
    Saturday: '12:00',
  },
};

export async function getBestTimesWeekForCategory(category: BestTimeCategoryKey): Promise<BestTimeByDay> {
  let weekByDay: Record<string, string> = {};

  try {
    const recommendations = await fetchBestTimeRecommendations(category);
    weekByDay = recommendationsToWeekByDay(recommendations);
  } catch {
    // fall through to fallback
  }

  const out: BestTimeByDay = {} as BestTimeByDay;
  for (const day of DAY_ORDER) {
    out[day] = weekByDay[day] ?? FALLBACK_WEEK[category]?.[day] ?? null;
  }

  return out;
}

export function getDayOrder() {
  return [...DAY_ORDER];
}
