import {
  filterInvoicesByStatus,
  getUnpaidInvoices,
  mockInvoices,
  parseInvoiceAmount,
  parseInvoiceDate,
  sumInvoicesByStatus,
} from './mockInvoices';

/**
 * Dashboard aggregations.
 *
 * This is a customer's view: the job is to pay what's owed and see what's new,
 * not to study analytics. So the metrics here are the ones a customer acts on,
 * what's outstanding, what's overdue, and which invoices still need paying, all
 * composed from the same helpers the Payments page uses so the two can never
 * disagree about a total.
 */

export function getMoneyTotals(invoices = mockInvoices) {
  const paid = sumInvoicesByStatus(invoices, 'Paid');
  const pending = sumInvoicesByStatus(invoices, 'Pending');
  const overdue = sumInvoicesByStatus(invoices, 'Overdue');
  const unpaid = getUnpaidInvoices(invoices);

  return {
    totalBilled: paid + pending + overdue,
    paid,
    pending,
    overdue,
    outstanding: pending + overdue,
    outstandingCount: unpaid.length,
    pendingCount: filterInvoicesByStatus(invoices, 'Pending').length,
    overdueCount: filterInvoicesByStatus(invoices, 'Overdue').length,
  };
}

/**
 * Outstanding money grouped by site, biggest first, with the share of the total
 * each one carries.
 *
 * An owner with many locations reads the portfolio before the invoice list, so
 * the question this answers is "which of my sites is the problem", not "which
 * invoice is next". A site counts as overdue when any single unpaid invoice on
 * it has passed its date — one late invoice makes the whole site late.
 */
export function getOutstandingBySite(invoices = mockInvoices, now = new Date()) {
  const bySite = new Map();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  for (const invoice of getUnpaidInvoices(invoices)) {
    const entry = bySite.get(invoice.site) ?? {
      site: invoice.site,
      amount: 0,
      count: 0,
      overdue: false,
      overdueAmount: 0,
      pendingAmount: 0,
      days: null,
    };
    const amount = parseInvoiceAmount(invoice.amount);
    const isOverdue = invoice.status === 'Overdue';

    entry.amount += amount;
    entry.count += 1;
    entry.overdue = entry.overdue || isOverdue;
    if (isOverdue) entry.overdueAmount += amount;
    else entry.pendingAmount += amount;

    const days = daysFromToday(invoice.dueDate, startOfToday);
    if (days !== null) {
      // Overdue sites report their oldest debt; the rest report the next date due.
      if (isOverdue) entry.days = entry.days === null || days < entry.days ? days : entry.days;
      else if (!entry.overdue) entry.days = entry.days === null || days < entry.days ? days : entry.days;
    }

    bySite.set(invoice.site, entry);
  }

  const sites = [...bySite.values()].sort((a, b) => {
    if (a.overdue !== b.overdue) return a.overdue ? -1 : 1;
    if (a.overdue) return (a.days ?? 0) - (b.days ?? 0);
    return (a.days ?? 0) - (b.days ?? 0);
  });

  const total = sites.reduce((sum, entry) => sum + entry.amount, 0);
  return sites.map((entry) => ({ ...entry, share: total > 0 ? entry.amount / total : 0 }));
}

/** Signed whole days from today to a due date: negative is already past. */
function daysFromToday(dueDate, startOfToday) {
  const due = parseInvoiceDate(dueDate);
  if (!due) return null;
  due.setHours(0, 0, 0, 0);
  return Math.round((due.getTime() - startOfToday.getTime()) / 86400000);
}

/**
 * The invoices that still need paying, ordered the way a customer should work
 * through them: overdue first (they have a deadline that has passed), then
 * pending, and within each the soonest due date leads.
 */
export function getUnpaidInvoicesSorted(invoices = mockInvoices, now = new Date()) {
  const rank = { Overdue: 0, Pending: 1 };
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  return getUnpaidInvoices(invoices)
    .slice()
    .sort((a, b) => {
      if (rank[a.status] !== rank[b.status]) return rank[a.status] - rank[b.status];
      const aDue = parseInvoiceDate(a.dueDate)?.getTime() ?? 0;
      const bDue = parseInvoiceDate(b.dueDate)?.getTime() ?? 0;
      return aDue - bDue;
    })
    .map((invoice) => ({ ...invoice, daysToDue: daysFromToday(invoice.dueDate, startOfToday) }));
}

/**
 * The most recent payment made in this session, or null.
 *
 * Derived from the invoices themselves rather than from whatever the toast
 * happens to be holding: `markInvoicesPaid` stamps every invoice in a batch with
 * the same `paidAt`, so the newest timestamp and the rows that share it *are*
 * the last payment. That means the fact outlives the toast being dismissed, and
 * cannot drift from the list it describes.
 *
 * Seeded invoices that arrive already Paid carry no `paidAt`, so they are
 * correctly excluded — we only know about payments we watched happen.
 */
export function getLastPayment(invoices = mockInvoices) {
  const settled = invoices.filter((invoice) => invoice.status === 'Paid' && invoice.paidAt);
  if (settled.length === 0) return null;

  const latest = settled.reduce(
    (newest, invoice) => (invoice.paidAt > newest ? invoice.paidAt : newest),
    settled[0].paidAt,
  );
  const batch = settled.filter((invoice) => invoice.paidAt === latest);

  return {
    paidAt: latest,
    count: batch.length,
    amount: batch.reduce((sum, invoice) => sum + parseInvoiceAmount(invoice.amount), 0),
  };
}

/** "today", "yesterday", then a date — relative reads better at this size. */
export function formatPaidWhen(iso) {
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return null;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const thenDay = new Date(then);
  thenDay.setHours(0, 0, 0, 0);

  const days = Math.round((startOfToday.getTime() - thenDay.getTime()) / 86400000);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
