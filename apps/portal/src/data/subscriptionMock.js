/**
 * Subscription / contract model, shaped from the contract billing screen.
 *
 * Two contract types, mirroring the "Recurring Plan" vs "Per Service Completion"
 * toggle:
 *  - recurring: a cadence, a per-cycle price (with discount), and a billing
 *    schedule of dated charges (paid vs upcoming derived from today).
 *  - per-service: no schedule; billed when a job is completed, so it carries a
 *    service history and a billed-to-date total instead.
 *
 * Plan type is a property of the site's contract, so the dashboard's site filter
 * selects which variant is shown (here, KFC Fremont runs on-demand).
 */

const AMOUNT = 342;
const BASE_AMOUNT = 360;
const SCHEDULE_ISO = ['2026-04-01', '2026-07-01', '2026-10-01', '2027-01-01'];

const CONTRACT_START = '2024-12-24';
const CONTRACT_END = '2026-12-30';

function atMidnight(iso) {
  return new Date(`${iso}T00:00:00`);
}

function contractWindow(now) {
  const contractStart = atMidnight(CONTRACT_START);
  const contractEnd = atMidnight(CONTRACT_END);
  const span = contractEnd.getTime() - contractStart.getTime();
  const contractProgress = Math.min(1, Math.max(0, (now.getTime() - contractStart.getTime()) / span));
  return { contractStart, contractEnd, contractProgress };
}

function buildRecurring(now) {
  const schedule = SCHEDULE_ISO.map((iso) => {
    const date = atMidnight(iso);
    return { iso, date, amount: AMOUNT, paid: date.getTime() <= now.getTime() };
  });

  return {
    planType: 'recurring',
    planName: 'Filter replacement plan',
    cadence: 'Quarterly',
    cadenceNoun: 'quarter',
    status: 'Active',
    pricePerCycle: AMOUNT,
    basePrice: BASE_AMOUNT,
    discountPercent: Math.round((1 - AMOUNT / BASE_AMOUNT) * 100),
    schedule,
    paymentsMade: schedule.filter((entry) => entry.paid).length,
    paymentsTotal: schedule.length,
    nextCharge: schedule.find((entry) => !entry.paid) ?? null,
    ...contractWindow(now),
  };
}

function buildPerService(now) {
  const serviceHistory = [
    { iso: '2026-08-12', amount: 980, filters: 4 },
    { iso: '2026-05-03', amount: 1210, filters: 6 },
    { iso: '2026-02-18', amount: 680, filters: 3 },
  ]
    .map((entry) => ({ ...entry, date: atMidnight(entry.iso) }))
    .filter((entry) => entry.date.getTime() <= now.getTime());

  const billedToDate = serviceHistory.reduce((sum, entry) => sum + entry.amount, 0);
  const lastService = serviceHistory[0] ?? null;

  return {
    planType: 'per-service',
    planName: 'On-demand service',
    status: 'Active',
    billedToDate,
    servicesCount: serviceHistory.length,
    lastService,
    serviceHistory,
    ...contractWindow(now),
  };
}

/** Site contracts differ; KFC Fremont is billed per service, the rest recurring. */
export function getSubscription(site, now = new Date()) {
  if (site === 'KFC Fremont') return buildPerService(now);
  return buildRecurring(now);
}
