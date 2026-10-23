import { formatMMDDYY, parseInvoiceDate } from './mockInvoices';
import { getReportPdfUrl } from './reportDocumentMock';

/**
 * The date-range filter behind the reports toolbar.
 *
 * The toolbar shipped with a "This Week" select whose value was held in state
 * and never applied, beside a read-only field hard-coded to
 * `01/14/2024 - 01/18/2024` — two controls both claiming to scope a list of 2026
 * reports, neither of them doing it. The range is now derived from the same
 * clock the reports are, so the field states the window the list is actually
 * showing.
 *
 * Weeks start Monday: these are service visits, and a customer reading "this
 * week" means the working week.
 */

const DAY_MS = 86400000;

function startOfDay(date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function startOfWeek(date) {
  const next = startOfDay(date);
  // getDay() is 0 for Sunday, which belongs to the week that began six days ago.
  const offset = (next.getDay() + 6) % 7;
  next.setDate(next.getDate() - offset);
  return next;
}

/**
 * The window a filter option covers, as `[from, to]` inclusive of both days.
 * Returns null for "no filter", which is what an unset select means.
 */
export function getReportDateRange(option, now = new Date()) {
  const preset = option || 'This Week';
  const today = startOfDay(now);

  switch (preset) {
    case 'This Week': {
      const from = startOfWeek(today);
      return { from, to: new Date(from.getTime() + 6 * DAY_MS) };
    }
    case 'Last Week': {
      const thisWeek = startOfWeek(today);
      const from = new Date(thisWeek.getTime() - 7 * DAY_MS);
      return { from, to: new Date(from.getTime() + 6 * DAY_MS) };
    }
    case 'This Month': {
      const from = new Date(today.getFullYear(), today.getMonth(), 1);
      const to = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return { from, to };
    }
    default:
      return null;
  }
}

/**
 * The full span of a set of reports — what the range field shows when no window
 * is selected, so it describes the list on screen rather than sitting empty.
 */
export function getReportsSpan(reports = []) {
  const times = reports
    .map((report) => parseInvoiceDate(report.date)?.getTime())
    .filter((time) => time != null && !Number.isNaN(time));

  if (times.length === 0) return null;
  return { from: new Date(Math.min(...times)), to: new Date(Math.max(...times)) };
}

function formatDate(date) {
  return formatMMDDYY(date);
}

export function formatDateRange(range) {
  if (!range) return '';
  return `${formatDate(range.from)} - ${formatDate(range.to)}`;
}

export function isReportInRange(report, range) {
  if (!range) return true;
  const time = parseInvoiceDate(report.date)?.getTime();
  if (time == null || Number.isNaN(time)) return true;
  // `to` is a date at midnight; the day it names must count as inside.
  return time >= range.from.getTime() && time < range.to.getTime() + DAY_MS;
}

/** Same window logic as reports, applied to invoice due dates. */
export function getInvoicesSpan(invoices = []) {
  const times = invoices
    .map((invoice) => parseInvoiceDate(invoice.dueDate)?.getTime())
    .filter((time) => time != null && !Number.isNaN(time));

  if (times.length === 0) return null;
  return { from: new Date(Math.min(...times)), to: new Date(Math.max(...times)) };
}

export function isInvoiceDueInRange(invoice, range) {
  if (!range) return true;
  const time = parseInvoiceDate(invoice.dueDate)?.getTime();
  if (time == null || Number.isNaN(time)) return true;
  return time >= range.from.getTime() && time < range.to.getTime() + DAY_MS;
}

/**
 * Demo download uses the same PDF shown in the report preview drawer.
 */
export async function downloadReport(report) {
  const safe = (value) => String(value).replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '');
  const filename = `${safe(report.reportType)}_${safe(report.site)}_${safe(report.date)}.pdf`;
  const pdfPath = getReportPdfUrl(report);
  const pdfUrl = pdfPath.startsWith('http') ? pdfPath : new URL(pdfPath, window.location.origin).href;

  try {
    const response = await fetch(pdfUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  } catch {
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
  }
}
