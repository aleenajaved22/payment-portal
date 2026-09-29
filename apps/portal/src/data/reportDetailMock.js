import { getBillToForSite } from './mockInvoices';
import { getFilterMix } from './filterUsage';

/**
 * The contents of a single site report.
 *
 * Derived rather than hand-written, so a report can never contradict the rest of
 * the portal: the sizes come from that site's own filter mix, and the bill-to
 * block is the same record the invoices use. Only the per-visit quantities are
 * invented, because nothing in the data model records what happened on one
 * visit — `getFilterMix` is an annual total, and printing 152 filters against a
 * single afternoon's work would be a plain falsehood.
 *
 * When visit-level service records exist, replace `visitCounts` with a lookup;
 * the shape returned here is what that lookup needs to produce.
 */

/**
 * A small deterministic hash of the report id. The same report therefore always
 * renders the same figures — a mock that reshuffles on every render reads as a
 * bug to anyone watching the screen twice.
 */
function seedFrom(id) {
  let seed = 0;
  for (const char of String(id)) seed = (seed * 31 + char.charCodeAt(0)) % 9973;
  return seed;
}

/**
 * Plausible per-visit quantities: a handful per size, never the annual figure.
 * Ranked by what was actually replaced on the day, so the bars read as a
 * ranking the way the dashboard's filter mix does — the site's annual ordering
 * is not the ordering of one visit.
 */
function visitCounts(sizes, seed) {
  return sizes
    .map((entry, index) => ({
      size: entry.size,
      count: 2 + ((seed + index * 7) % 5),
    }))
    .sort((a, b) => b.count - a.count);
}

const TECHNICIANS = ['M. Delgado', 'R. Okonkwo', 'J. Whitfield', 'A. Bergström'];

export function getReportDetail(report) {
  if (!report) return null;

  const seed = seedFrom(report.id);
  const mix = getFilterMix(report.site);
  const replaced = visitCounts(mix.sizes.slice(0, 4), seed);
  const totalReplaced = replaced.reduce((sum, entry) => sum + entry.count, 0);
  const billTo = getBillToForSite(report.site);

  /* Between 40 and 115 minutes, stepped in fives so it reads like something a
     technician wrote down rather than a float. */
  const durationMinutes = 40 + ((seed % 16) * 5);

  return {
    reference: `RPT-${String(10000 + (seed % 9000))}`,
    technician: TECHNICIANS[seed % TECHNICIANS.length],
    durationMinutes,
    unitsServiced: 3 + (seed % 5),
    replaced,
    totalReplaced,
    billTo,
    /* Carried straight through from the record: most visits pass cleanly, and
       the ones that don't say so on the report itself. */
    exception: report.exception ?? null,
  };
}

export function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!hours) return `${rest} min`;
  return rest ? `${hours} hr ${rest} min` : `${hours} hr`;
}
