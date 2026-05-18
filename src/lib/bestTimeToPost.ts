export type BestTimeCategoryKey =
  | 'accessoires'
  | 'beauty'
  | 'clothes'
  | 'food'
  | 'technology';

const DAY_ORDER = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

function toDayKey(date: Date): typeof DAY_ORDER[number] {
  // Use UTC day so we don't shift with timezone.
  const dayIndex = date.getUTCDay(); // 0..6 (Sun..Sat)
  return DAY_ORDER[dayIndex];
}

function parseHHmm(hhmm: string): { hours: number; minutes: number } {
  const [h, m] = hhmm.split(':');
  return { hours: Number(h), minutes: Number(m) };
}

/**
 * Fallback dataset (kept so the UI still works if DB isn't seeded yet).
 */
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

export function getBestTimesForCategory(category: BestTimeCategoryKey) {
  return FALLBACK_DATA[category];
}

/**
 * Convert DB response into a normalized mapping compatible with getBestScheduledAtForDate.
 */
function normalizeDbData(dbData: any): Record<BestTimeCategoryKey, Record<string, string>> {
  const out: any = {
    accessoires: {},
    beauty: {},
    clothes: {},
    food: {},
    technology: {},
  };

  for (const cat of Object.keys(out)) {
    const catKey = cat as BestTimeCategoryKey;
    const catDays = dbData?.[catKey] ?? dbData?.[cat] ?? {};
    for (const day of DAY_ORDER) {
      const t = catDays?.[day] ?? catDays?.[day.toLowerCase()];
      if (typeof t === 'string' && t) out[catKey][day] = t;
    }
  }

  return out as Record<BestTimeCategoryKey, Record<string, string>>;
}

let cachedDbData: Record<BestTimeCategoryKey, Record<string, string>> | null = null;
let cachePromise: Promise<void> | null = null;

async function loadBestTimesFromApi(): Promise<void> {
  if (cachedDbData) return;
  if (cachePromise) return cachePromise;

  cachePromise = (async () => {
    try {
      const apiBase = (import.meta as any).env?.VITE_API_URL || 'https://api.postoryai.com/api';
      const res = await fetch(`${apiBase}/meta/best-time-to-post`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.success) throw new Error('API returned success=false');

      cachedDbData = normalizeDbData(json.data);
    } catch {
      // keep fallback
      cachedDbData = null;
    }
  })();

  await cachePromise;
}

/**
 * Returns the best UTC Date for a given day.
 * - Tries to use DB data (seeded from all.csv)
 * - Falls back to in-code dataset if DB isn't available.
 */
export async function getBestScheduledAtForDate(
  category: BestTimeCategoryKey,
  date: Date
): Promise<{ scheduledAtUtc: Date; timeHHmm: string }> {

  await loadBestTimesFromApi();

  const dayKey = toDayKey(date);
  const timeHHmm =
    cachedDbData?.[category]?.[dayKey] ?? FALLBACK_DATA[category]?.[dayKey] ?? FALLBACK_DATA[category]?.[dayKey as any];

  const { hours, minutes } = parseHHmm(timeHHmm);

  const y = date.getUTCFullYear();
  const m = date.getUTCMonth();
  const d = date.getUTCDate();

  const scheduledAtUtc = new Date(Date.UTC(y, m, d, hours, minutes, 0, 0));
  return { scheduledAtUtc, timeHHmm };
}

