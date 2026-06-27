import type { BestTimeCategoryKey } from './bestTimeToPost';
import {
  fetchBestTimeRecommendations,
  recommendationsToWeekByDay,
} from './recommendBestTime';

const DAY_ORDER = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

export type BestTimeByDay = Record<typeof DAY_ORDER[number], string | null>;

export async function getBestTimesWeekForCategory(category: BestTimeCategoryKey): Promise<BestTimeByDay> {
  const recommendations = await fetchBestTimeRecommendations(category);
  const weekByDay = recommendationsToWeekByDay(recommendations);

  const out: BestTimeByDay = {} as BestTimeByDay;
  for (const day of DAY_ORDER) {
    out[day] = weekByDay[day] ?? null;
  }

  return out;
}

export function getDayOrder() {
  return [...DAY_ORDER];
}
