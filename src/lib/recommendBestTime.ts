import type { BestTimeCategoryKey } from './bestTimeToPost';

export type BestTimeRecommendation = {
  day_name: string;
  hour: number;
  predicted_engagement: number;
};

type RecommendBestTimeResponse = {
  category: string;
  count: number;
  recommendations: BestTimeRecommendation[];
  status: string;
};

const RECOMMEND_API_URL =
  import.meta.env.VITE_RECOMMEND_API_URL || 'http://localhost:5001';

const cache = new Map<BestTimeCategoryKey, BestTimeRecommendation[]>();
const cachePromises = new Map<BestTimeCategoryKey, Promise<BestTimeRecommendation[]>>();

export function hourToHHmm(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`;
}

export async function fetchBestTimeRecommendations(
  category: BestTimeCategoryKey
): Promise<BestTimeRecommendation[]> {
  const cached = cache.get(category);
  if (cached) return cached;

  const inFlight = cachePromises.get(category);
  if (inFlight) return inFlight;

  const promise = (async () => {
    const res = await fetch(`${RECOMMEND_API_URL}/recommend-best-time`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category }),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const json: RecommendBestTimeResponse = await res.json();
    if (json.status !== 'success') {
      throw new Error('API returned non-success status');
    }

    cache.set(category, json.recommendations);
    return json.recommendations;
  })();

  cachePromises.set(category, promise);

  try {
    return await promise;
  } finally {
    cachePromises.delete(category);
  }
}

/**
 * Collapse ranked recommendations into one best time per day (first = highest engagement).
 */
export function recommendationsToWeekByDay(
  recommendations: BestTimeRecommendation[]
): Record<string, string> {
  const out: Record<string, string> = {};

  for (const rec of recommendations) {
    if (!out[rec.day_name]) {
      out[rec.day_name] = hourToHHmm(rec.hour);
    }
  }

  return out;
}

export function getBestTimeForDay(
  recommendations: BestTimeRecommendation[],
  dayName: string
): string | null {
  const match = recommendations.find((r) => r.day_name === dayName);
  return match ? hourToHHmm(match.hour) : null;
}
