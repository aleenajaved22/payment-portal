/**
 * Filters replaced, by size, per site.
 *
 * This is the one metric on the dashboard that is about the service rather than
 * the money: an owner of many locations rarely has a central picture of which
 * filter sizes their estate actually consumes.
 *
 * It lives in its own mock because invoices in this app carry a single amount
 * and no line items, so there is nothing to derive it from yet. Once invoices
 * itemise filters (size × quantity × unit price), this file should be replaced
 * by a selector over those line items — the shape returned here is what that
 * selector needs to produce. KFC Fremont's counts deliberately sum to 13 so they
 * agree with the per-service history in subscriptionMock.
 */

const USAGE_BY_SITE = {
  'KFC Owen Tech': [
    { size: '20 × 20 × 2', count: 86 },
    { size: '16 × 25 × 1', count: 54 },
    { size: '24 × 24 × 2', count: 32 },
    { size: '20 × 25 × 4', count: 18 },
  ],
  'KFC Lakeview': [
    { size: '20 × 20 × 2', count: 61 },
    { size: '16 × 25 × 1', count: 44 },
    { size: '24 × 24 × 2', count: 25 },
    { size: '16 × 20 × 1', count: 14 },
  ],
  'KFC Fremont': [
    { size: '20 × 20 × 2', count: 5 },
    { size: '16 × 25 × 1', count: 4 },
    { size: '24 × 24 × 2', count: 4 },
  ],
};

/** Largest size first, with each one's share of the total. */
export function getFilterMix(site) {
  const rows = site ? USAGE_BY_SITE[site] ?? [] : mergeAllSites();
  const total = rows.reduce((sum, row) => sum + row.count, 0);

  return {
    total,
    sizes: rows
      .slice()
      .sort((a, b) => b.count - a.count)
      .map((row) => ({ ...row, share: total > 0 ? row.count / total : 0 })),
  };
}

function mergeAllSites() {
  const totals = new Map();

  for (const rows of Object.values(USAGE_BY_SITE)) {
    for (const row of rows) {
      totals.set(row.size, (totals.get(row.size) ?? 0) + row.count);
    }
  }

  return [...totals.entries()].map(([size, count]) => ({ size, count }));
}
