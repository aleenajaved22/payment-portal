import { semantic } from '@signal/design-tokens/colors';

/** Saturated status fills from the DS strong-surface ramp (bar fills). */
const SEGMENT_BAR_FILL = {
  paid: semantic.surface.successStrong,
  pending: semantic.surface.warningStrong,
  overdue: semantic.surface.alertStrong,
};
const DASHBOARD_STAT_THEME = {
  total: {
    color: semantic.text.secondary2,
    iconBg: semantic.surface.greySubtle,
  },
  paid: {
    color: semantic.status.onSubtle.success,
    iconBg: semantic.surface.successSubtle,
  },
  pending: {
    color: semantic.status.onSubtle.warning,
    iconBg: semantic.surface.warningSubtle,
  },
  overdue: {
    color: semantic.text.alert,
    iconBg: semantic.surface.alertSubtle,
  },
};

/** Shared bill-to details keyed by site (FilterGo customer portal). */
export const billToBySite = {
  'KFC Owen Tech': {
    storeCode: 'FQ-04412',
    address: '14508 Owen Tech Blvd Austin, TX 78728',
    contactPerson: 'John Hairgrove',
    contactPhone: '(512) 251-4900',
    contactEmail: 'john.hairgrove@filtergo.com',
  },
  'KFC Lakeview': {
    storeCode: 'FQ-06120',
    address: '892 Lakeview Dr Omaha, NE 68114',
    contactPerson: 'Maria Chen',
    contactPhone: '(402) 555-0182',
    contactEmail: 'maria.chen@filtergo.com',
  },
  'KFC Fremont': {
    storeCode: 'FQ-05893',
    address: '707 East 23rd Street Fremont, NE 68025',
    contactPerson: 'Rosie Padilla',
    contactPhone: '(402) 555-0147',
    contactEmail: 'rosie.padilla@filtergo.com',
  },
};

/**
 * Invoice dates are held as offsets from today rather than fixed strings.
 *
 * They used to be hard-coded to mid-2025, which meant the demo drifted: every
 * invoice, including the ones labelled Pending, read as a year past due, and any
 * figure derived from a date — days overdue, due soon — came out absurd. Deriving
 * them from the clock keeps the Overdue / Pending labels true whenever the app is
 * opened, and matches how subscriptionMock already works.
 */
function shiftDays(days) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date;
}

/** 'MM/DD/YY' — the format parseInvoiceDate and the tables expect for due dates. */
function dueIn(days) {
  const date = shiftDays(days);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${mm}/${dd}/${String(date.getFullYear()).slice(-2)}`;
}

/** 'MM/DD/YYYY' — issue dates carry the full year. */
function issuedAgo(days) {
  const date = shiftDays(-days);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${mm}/${dd}/${date.getFullYear()}`;
}

/**
 * `filterCount` is how many filters that invoice covers.
 *
 * Explicit per invoice rather than divided out of the amount at render time: an
 * invoice carries one figure and no line items, so a count derived by division
 * would be a guess dressed as arithmetic. These sit at roughly $145 a filter
 * installed, which is what makes them plausible against the amounts.
 *
 * They deliberately do not sum to the dashboard's "Filters Replaced" total —
 * that figure covers twelve months of replacements across the estate, while
 * this is thirteen invoices. When invoices itemise (size x quantity x unit
 * price), this field is replaced by a sum over those lines.
 */
export const mockInvoices = [
  {
    id: '1',
    invoiceNumber: 'INV-10482',
    site: 'KFC Owen Tech',
    amount: '$4,250.00',
    status: 'Pending',
    contract: 'Contract Q1-2024',
    dueDate: dueIn(6),
    invoiceDate: issuedAgo(24),
    paymentTerms: 'NET 10',
    filterCount: 29,
  },
  {
    id: '2',
    invoiceNumber: 'INV-10481',
    site: 'KFC Lakeview',
    amount: '$2,180.00',
    status: 'Paid',
    contract: 'Contract Q2-2024',
    dueDate: dueIn(-40),
    invoiceDate: issuedAgo(70),
    paymentTerms: 'NET 10',
    filterCount: 15,
  },
  {
    id: '3',
    invoiceNumber: 'INV-10480',
    site: 'KFC Lakeview',
    amount: '$3,420.00',
    status: 'Overdue',
    contract: 'Contract Q1-2024',
    dueDate: dueIn(-34),
    invoiceDate: issuedAgo(64),
    paymentTerms: 'NET 10',
    filterCount: 24,
  },
  {
    id: '4',
    invoiceNumber: 'INV-10479',
    site: 'KFC Fremont',
    amount: '$1,890.00',
    status: 'Paid',
    contract: 'Contract Q2-2024',
    dueDate: dueIn(-61),
    invoiceDate: issuedAgo(91),
    paymentTerms: 'NET 10',
    filterCount: 13,
  },
  {
    id: '5',
    invoiceNumber: 'INV-10478',
    site: 'KFC Owen Tech',
    amount: '$5,100.00',
    status: 'Pending',
    contract: 'Contract Q2-2024',
    dueDate: dueIn(13),
    invoiceDate: issuedAgo(17),
    paymentTerms: 'NET 10',
    filterCount: 35,
  },
  {
    id: '6',
    invoiceNumber: 'INV-10477',
    site: 'KFC Lakeview',
    amount: '$2,650.00',
    status: 'Paid',
    contract: 'Contract Q1-2024',
    dueDate: dueIn(-75),
    invoiceDate: issuedAgo(105),
    paymentTerms: 'NET 10',
    filterCount: 18,
  },
  {
    id: '7',
    invoiceNumber: 'INV-10476',
    site: 'KFC Fremont',
    amount: '$980.00',
    status: 'Overdue',
    contract: 'Contract Q1-2024',
    dueDate: dueIn(-52),
    invoiceDate: issuedAgo(82),
    paymentTerms: 'NET 10',
    filterCount: 7,
  },
  {
    id: '8',
    invoiceNumber: 'INV-10475',
    site: 'KFC Owen Tech',
    amount: '$3,775.00',
    status: 'Pending',
    contract: 'Contract Q1-2024',
    dueDate: dueIn(21),
    invoiceDate: issuedAgo(9),
    paymentTerms: 'NET 10',
    filterCount: 26,
  },
  {
    id: '9',
    invoiceNumber: 'INV-10474',
    site: 'KFC Lakeview',
    amount: '$1,860.00',
    status: 'Overdue',
    contract: 'Contract Q1-2024',
    dueDate: dueIn(-21),
    invoiceDate: issuedAgo(51),
    paymentTerms: 'NET 10',
    filterCount: 13,
  },
  {
    id: '10',
    invoiceNumber: 'INV-10473',
    site: 'KFC Fremont',
    amount: '$2,340.00',
    status: 'Overdue',
    contract: 'Contract Q2-2024',
    dueDate: dueIn(-12),
    invoiceDate: issuedAgo(42),
    paymentTerms: 'NET 10',
    filterCount: 16,
  },
  {
    id: '11',
    invoiceNumber: 'INV-10484',
    site: 'KFC Lakeview',
    amount: '$2,910.00',
    status: 'Pending',
    contract: 'Contract Q2-2024',
    dueDate: dueIn(9),
    invoiceDate: issuedAgo(21),
    paymentTerms: 'NET 10',
    filterCount: 20,
  },
  {
    id: '12',
    invoiceNumber: 'INV-10485',
    site: 'KFC Fremont',
    amount: '$1,450.00',
    status: 'Pending',
    contract: 'Contract Q1-2024',
    dueDate: dueIn(17),
    invoiceDate: issuedAgo(13),
    paymentTerms: 'NET 10',
    filterCount: 10,
  },
  {
    id: '13',
    invoiceNumber: 'INV-10486',
    site: 'KFC Owen Tech',
    amount: '$3,260.00',
    status: 'Pending',
    contract: 'Contract Q2-2024',
    dueDate: dueIn(28),
    invoiceDate: issuedAgo(2),
    paymentTerms: 'NET 10',
    filterCount: 22,
  },
];

export function getUniqueInvoiceSites(invoices = mockInvoices) {
  const seen = new Set();
  const sites = [];
  for (const invoice of invoices) {
    if (!seen.has(invoice.site)) {
      seen.add(invoice.site);
      sites.push(invoice.site);
    }
  }
  return sites;
}

export const invoiceSiteFilterOptions = ['All sites', ...getUniqueInvoiceSites()];
export const invoiceStatusFilterOptions = ['All statuses', 'Paid', 'Pending', 'Overdue'];

export function filterInvoicesByStatus(invoices, status) {
  if (!status) return invoices;
  return invoices.filter((invoice) => invoice.status === status);
}

export function getPendingInvoices(invoices = mockInvoices) {
  return filterInvoicesByStatus(invoices, 'Pending');
}

export function getOverdueInvoices(invoices = mockInvoices) {
  return filterInvoicesByStatus(invoices, 'Overdue');
}

export function getUnpaidInvoices(invoices = mockInvoices) {
  return invoices.filter((invoice) => invoice.status === 'Pending' || invoice.status === 'Overdue');
}

export function getBillToForSite(site) {
  return (
    billToBySite[site] ?? {
      storeCode: 'FQ-04412',
      address: '14508 Owen Tech Blvd Austin, TX 78728',
      contactPerson: 'John Hairgrove',
      contactPhone: '(512) 251-4900',
      contactEmail: 'john.hairgrove@filtergo.com',
    }
  );
}

export function getInvoiceStats(invoices = mockInvoices) {
  const pending = getPendingInvoices(invoices).length;
  const overdue = getOverdueInvoices(invoices).length;

  return [
    { label: 'Total Invoices', value: invoices.length, iconKey: 'total' },
    { label: 'Pending Payment', value: pending, iconKey: 'pending' },
    { label: 'Overdue', value: overdue, iconKey: 'overdue' },
  ];
}

/** Matches “Pending Payment” stat — banner and Pay Now from banner. */
export function getAwaitingPaymentCount(invoices = mockInvoices) {
  return getPendingInvoices(invoices).length;
}

export function parseInvoiceAmount(amountStr) {
  const value = Number(String(amountStr).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(value) ? value : 0;
}

/** Parse invoice due/invoice date strings (MM/DD/YY, MM/DD/YYYY, or locale long form). */
export function parseInvoiceDate(value) {
  if (value == null || value === '') return null;

  const slashMatch = String(value).trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (slashMatch) {
    const month = Number(slashMatch[1]);
    const day = Number(slashMatch[2]);
    let year = Number(slashMatch[3]);
    if (year < 100) year += 2000;
    const date = new Date(year, month - 1, day);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/** Display due dates as MM/DD/YY in tables and detail views. */
export function formatInvoiceDueDate(value) {
  const parsed = parseInvoiceDate(value);
  if (!parsed) return value ?? '';
  const mm = String(parsed.getMonth() + 1).padStart(2, '0');
  const dd = String(parsed.getDate()).padStart(2, '0');
  const yy = String(parsed.getFullYear()).slice(-2);
  return `${mm}/${dd}/${yy}`;
}

export function formatInvoiceTotal(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

export function sumInvoiceAmounts(invoices = []) {
  return invoices.reduce((sum, invoice) => sum + parseInvoiceAmount(invoice.amount), 0);
}

export function sumInvoicesByStatus(invoices, status) {
  return sumInvoiceAmounts(filterInvoicesByStatus(invoices, status));
}

/** One bar per invoice; height = share of largest amount in the set (sorted low → high). */
export function getInvoiceSparklinePoints(invoices = []) {
  if (!invoices.length) {
    return [{ id: 'empty', label: 'No invoices', amount: '$0', value: 0.15 }];
  }

  const sorted = [...invoices].sort(
    (a, b) => parseInvoiceAmount(a.amount) - parseInvoiceAmount(b.amount),
  );
  const maxAmount = Math.max(...sorted.map((invoice) => parseInvoiceAmount(invoice.amount)), 1);

  return sorted.map((invoice) => {
    const ratio = parseInvoiceAmount(invoice.amount) / maxAmount;
    return {
      id: invoice.id,
      label: invoice.invoiceNumber,
      amount: invoice.amount,
      value: Math.max(0.22, ratio),
    };
  });
}

export function getInvoiceDashboardCards(invoices = mockInvoices) {
  const totalAmount = sumInvoiceAmounts(invoices);
  const paidTotal = sumInvoicesByStatus(invoices, 'Paid');
  const pendingTotal = sumInvoicesByStatus(invoices, 'Pending');
  const overdueTotal = sumInvoicesByStatus(invoices, 'Overdue');

  return [
    {
      id: 'total',
      label: 'Total',
      amount: formatInvoiceTotal(totalAmount),
      ...DASHBOARD_STAT_THEME.total,
      iconVariant: 'total',
      sparkline: getInvoiceSparklinePoints(invoices),
    },
    {
      id: 'paid',
      label: 'Paid',
      amount: formatInvoiceTotal(paidTotal),
      ...DASHBOARD_STAT_THEME.paid,
      iconVariant: 'check',
      sparkline: getInvoiceSparklinePoints(filterInvoicesByStatus(invoices, 'Paid')),
    },
    {
      id: 'pending',
      label: 'Pending',
      amount: formatInvoiceTotal(pendingTotal),
      ...DASHBOARD_STAT_THEME.pending,
      iconVariant: 'clock',
      sparkline: getInvoiceSparklinePoints(getPendingInvoices(invoices)),
    },
    {
      id: 'overdue',
      label: 'Overdue',
      amount: formatInvoiceTotal(overdueTotal),
      ...DASHBOARD_STAT_THEME.overdue,
      iconVariant: 'alert',
      sparkline: getInvoiceSparklinePoints(getOverdueInvoices(invoices)),
    },
  ];
}

export function getInvoiceStatusSegmentStats(invoices = mockInvoices) {
  // Ordered by urgency: Overdue leads the legend. Paid is computed here for the
  // totals but filtered out below — the legend shows only what still needs action.
  const segments = [
    {
      id: 'overdue',
      label: 'Overdue',
      barColor: SEGMENT_BAR_FILL.overdue,
      dotColor: SEGMENT_BAR_FILL.overdue,
    },
    {
      id: 'pending',
      label: 'Pending',
      barColor: SEGMENT_BAR_FILL.pending,
      dotColor: SEGMENT_BAR_FILL.pending,
    },
    {
      id: 'paid',
      label: 'Paid',
      barColor: SEGMENT_BAR_FILL.paid,
      dotColor: SEGMENT_BAR_FILL.paid,
    },
  ].map((segment) => {
    const matching = filterInvoicesByStatus(invoices, segment.label);
    const value = sumInvoiceAmounts(matching);
    return {
      ...segment,
      value,
      count: matching.length,
      amountLabel: formatInvoiceTotal(value),
    };
  });

  const totalValue = segments.reduce((sum, segment) => sum + segment.value, 0);
  const safeTotal = totalValue || 1;
  /** What the customer still owes — everything not yet paid. */
  const outstandingValue = segments
    .filter((segment) => segment.label !== 'Paid')
    .reduce((sum, segment) => sum + segment.value, 0);
  const outstandingCount = segments
    .filter((segment) => segment.label !== 'Paid')
    .reduce((sum, segment) => sum + segment.count, 0);

  /**
   * The legend only carries what the customer can act on — Paid is settled, so it
   * drops out of the list while still counting toward the total shown beside it.
   */
  const actionableSegments = segments.filter((segment) => segment.label !== 'Paid');

  return {
    totalLabel: formatInvoiceTotal(totalValue),
    outstandingLabel: formatInvoiceTotal(outstandingValue),
    outstandingCount,
    segments: actionableSegments.map((segment) => ({
      ...segment,
      percent: totalValue === 0 ? 0 : Math.round((segment.value / safeTotal) * 100),
    })),
  };
}

/** Line-item subtotal + adjustments = table amount (for detail drawer totals). */
export function getInvoiceAmountBreakdown(invoice) {
  const grandTotal = parseInvoiceAmount(invoice?.amount);
  const adjustments = grandTotal > 2500 ? 2000 : 0;
  const lineItemsSubtotal = Math.max(0, grandTotal - adjustments);

  return {
    lineItemsSubtotal: formatInvoiceTotal(lineItemsSubtotal),
    adjustments: formatInvoiceTotal(adjustments),
    taxes: 'N/A',
    grandTotal: formatInvoiceTotal(grandTotal),
  };
}
