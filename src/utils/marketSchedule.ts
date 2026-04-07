import type { Market, ProductCategory } from '../types';

const DAY_PREFIX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

/** Weekday numbers matching JS Date#getDay(). */
export function parseMarketWeekdays(daysStr: string): number[] {
  const out: number[] = [];
  for (const part of daysStr.split(',')) {
    const t = part.trim().slice(0, 3);
    const n = DAY_PREFIX[t];
    if (n !== undefined) out.push(n);
  }
  return out;
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function parseISODateLocal(iso: string): Date {
  const [y, m, day] = iso.split('-').map((s) => parseInt(s, 10));
  return new Date(y, m - 1, day, 12, 0, 0, 0);
}

/** Market runs on this calendar day (by weekday schedule). */
export function isMarketOpenOnDate(m: Market, isoDate: string): boolean {
  const wd = parseISODateLocal(isoDate).getDay();
  return parseMarketWeekdays(m.days).includes(wd);
}

/** Any scheduled weekday falls on a date in [start, end] inclusive. */
export function hasOccurrenceBetween(m: Market, start: Date, end: Date): boolean {
  const weekdays = parseMarketWeekdays(m.days);
  if (weekdays.length === 0) return false;
  let cur = startOfDay(start);
  const endT = startOfDay(end).getTime();
  while (cur.getTime() <= endT) {
    if (weekdays.includes(cur.getDay())) return true;
    cur = addDays(cur, 1);
  }
  return false;
}

export type MapFilterState = {
  category: 'all' | Exclude<ProductCategory, 'featured'>;
  distanceMiles: 'any' | 1 | 3 | 5;
  statusActive: boolean;
  statusUpcoming: boolean;
  specificDate: string | null;
};

export const DEFAULT_MAP_FILTERS: MapFilterState = {
  category: 'all',
  distanceMiles: 'any',
  statusActive: true,
  statusUpcoming: true,
  specificDate: null,
};

export function marketPassesMapFilters(
  m: Market,
  f: MapFilterState,
  refLat: number,
  refLng: number,
  distanceFn: (la: number, lo: number, la2: number, lo2: number) => number,
): boolean {
  if (f.category !== 'all' && !m.categories.includes(f.category)) {
    return false;
  }

  if (f.distanceMiles !== 'any') {
    if (distanceFn(refLat, refLng, m.latitude, m.longitude) > f.distanceMiles) {
      return false;
    }
  }

  if (f.specificDate) {
    return isMarketOpenOnDate(m, f.specificDate);
  }

  const today = startOfDay(new Date());
  const day7 = addDays(today, 7);
  const day8 = addDays(today, 8);
  const day90 = addDays(today, 90);

  if (!f.statusActive && !f.statusUpcoming) {
    return true;
  }

  let ok = false;
  if (f.statusActive && hasOccurrenceBetween(m, today, day7)) ok = true;
  if (f.statusUpcoming && hasOccurrenceBetween(m, day8, day90)) ok = true;
  return ok;
}
