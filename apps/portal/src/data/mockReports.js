import { formatMMDDYY } from './mockInvoices';

/**
 * Site reports, dated relative to today.
 *
 * The dashboard surfaces these as "latest reports", so fixed dates would make
 * the panel lie as soon as the demo aged — it previously showed August 2025
 * whatever the day. Deriving them from the clock keeps "latest" honest, and
 * matches how mockInvoices and subscriptionMock already work.
 */
const DAY_MS = 86400000;

function startOfDay(date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function startOfWeek(date) {
  const next = startOfDay(date);
  const offset = (next.getDay() + 6) % 7;
  next.setDate(next.getDate() - offset);
  return next;
}

function daysAgo(days) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - days);
  return date;
}

function reportDate(days) {
  const date = daysAgo(days);
  return {
    day: date.toLocaleDateString('en-US', { weekday: 'long' }),
    date: formatMMDDYY(date),
  };
}

/** Keeps six demo rows inside the current Mon–Sun week (Reports default: This Week). */
function daysAgoForListingSlot(slot, total = 6) {
  const today = startOfDay(new Date());
  const weekStart = startOfWeek(today);
  const maxDaysAgo = Math.round((today.getTime() - weekStart.getTime()) / DAY_MS);
  const daysInWeekSoFar = maxDaysAgo + 1;
  if (slot < daysInWeekSoFar) {
    return maxDaysAgo - slot;
  }
  return slot % daysInWeekSoFar;
}

/** Franchise operator shown in the reports table Company column. */
export const companyBySite = {
  'KFC Owen Tech': 'KBP Brands',
  'KFC Lakeview': 'KBP Brands',
  'KFC Fremont': 'KBP Brands',
};

const REPORT_ROWS = [
  { id: '2', site: 'KFC Owen Tech', isNew: true },
  {
    id: '3',
    site: 'KFC Lakeview',
    isNew: false,
    exception: {
      title: 'Airflow below target on RTU-3',
      detail:
        'Return-side restriction cleared and the filter replaced. Recommend a follow-up reading at the next scheduled visit.',
    },
  },
  { id: '5', site: 'KFC Fremont', isNew: false },
  { id: '7', site: 'KFC Lakeview', isNew: false },
  { id: '8', site: 'KFC Owen Tech', isNew: false },
  { id: '9', site: 'KFC Fremont', isNew: false },
];

export const mockReports = REPORT_ROWS.map((row, index) => {
  const { exception, ...rest } = row;
  return {
    ...rest,
    company: companyBySite[row.site],
    reportType: 'Visit Report',
    ...reportDate(daysAgoForListingSlot(index, REPORT_ROWS.length)),
    ...(exception ? { exception } : {}),
  };
});

export const siteFilterOptions = ['All sites', 'KFC Owen Tech', 'KFC Lakeview', 'KFC Fremont'];
export const reportTypeFilterOptions = ['All types', 'Visit Report'];
/** Date-range presets — always one is selected (default on Reports: This Week). */
export const weekFilterOptions = ['This Week', 'Last Week', 'This Month'];
