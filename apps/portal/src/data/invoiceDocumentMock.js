import { billToBySite, formatInvoiceTotal, parseInvoiceAmount } from './mockInvoices';

const COMPANY_LINES = [
  'Filtergo, LLC',
  '3880 S 149th St',
  'Ste 106',
  'Omaha, NE 68144-5568',
  'accounting@filter-go.com',
  '+1 (402) 671-5734',
];

const SALES_REP = 'FG-00001';
const TAX_RATE = 0.07;

function formatShortDate(dateStr) {
  if (!dateStr) return '—';
  const parsed = new Date(dateStr);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  }
  return dateStr;
}

function formatServiceDateCompact(dateStr) {
  if (!dateStr) return '—';
  const parsed = new Date(dateStr);
  if (!Number.isNaN(parsed.getTime())) {
    const month = parsed.getMonth() + 1;
    const day = parsed.getDate();
    const year = String(parsed.getFullYear()).slice(-2);
    return `${month}.${day}.${year}`;
  }
  return dateStr.replace(/\//g, '.');
}

function buildBillToLines(invoice) {
  const site = invoice?.site;
  const billTo = site ? billToBySite[site] : null;
  const contact = billTo?.contactPerson ?? 'Customer contact';

  if (billTo) {
    const addressParts = billTo.address.split(',').map((part) => part.trim());
    const siteLine = billTo.storeCode ? `KBP Brands ${billTo.storeCode} ${site}` : site;
    return [contact, siteLine, ...addressParts, 'United States'];
  }

  return [
    'Rosie Padilla',
    'KBP Brands FQ-05893 KFC Fremont',
    '707 East 23rd Street',
    'Fremont, NE 68025',
    'United States',
  ];
}

function splitAmountsFromTotal(totalValue) {
  const subtotalValue = Math.round((totalValue / (1 + TAX_RATE)) * 100) / 100;
  const taxValue = Math.round((totalValue - subtotalValue) * 100) / 100;
  return { subtotalValue, taxValue, totalValue };
}

function buildPaidLineItems(subtotalValue) {
  return [
    {
      index: 1,
      product: 'Filter Replacement',
      description: 'Filter Replacement - Unit 1',
      qty: '1',
      rate: formatInvoiceTotal(subtotalValue),
      amount: formatInvoiceTotal(subtotalValue),
    },
  ];
}

function buildUnpaidLineItems(subtotalValue) {
  const line1Amount = Math.round(subtotalValue * 0.4 * 100) / 100;
  const line2Amount = Math.round((subtotalValue - line1Amount) * 100) / 100;
  const qty1 = 4;
  const qty2 = 6;

  return [
    {
      index: 1,
      product: 'Filter Replacement',
      description: 'Filter Replacement - 20x20x2',
      qty: String(qty1),
      rate: formatInvoiceTotal(line1Amount / qty1),
      amount: formatInvoiceTotal(line1Amount),
    },
    {
      index: 2,
      product: 'Filter Replacement',
      description: 'Filter Replacement - 20x25x2',
      qty: String(qty2),
      rate: formatInvoiceTotal(line2Amount / qty2),
      amount: formatInvoiceTotal(line2Amount),
    },
  ];
}

export function getInvoicePdfUrl(invoice) {
  if (!invoice) return null;
  if (invoice.status === 'Paid') {
    return '/Invoice_US_209867_1.pdf';
  }
  return '/Invoice_US_210209_1.pdf';
}

export function getPaidInvoiceDocument(invoice) {
  const isPaid = invoice?.status === 'Paid';
  const totalValue = parseInvoiceAmount(invoice?.amount) || (isPaid ? 28.89 : 199.56);
  const { subtotalValue, taxValue } = splitAmountsFromTotal(totalValue);

  const contactFirst = buildBillToLines(invoice)[0]?.split(' ')[0] ?? 'there';
  const serviceDateSource = invoice?.invoiceDate ?? invoice?.dueDate;

  return {
    companyLines: COMPANY_LINES,
    billToLines: buildBillToLines(invoice),
    invoiceNumber: invoice?.invoiceNumber?.replace(/^INV-/i, 'US_') ?? (isPaid ? 'US_209867' : 'US_210209'),
    invoiceDate: formatShortDate(invoice?.invoiceDate) ?? (isPaid ? '09/04/2026' : '09/11/2026'),
    dueDate: formatShortDate(invoice?.dueDate) ?? (isPaid ? '09/04/2026' : '10/11/2026'),
    salesRep: SALES_REP,
    showSalesRep: isPaid,
    showViewAndPay: !isPaid,
    showPaymentLines: isPaid,
    lineItems: isPaid ? buildPaidLineItems(subtotalValue) : buildUnpaidLineItems(subtotalValue),
    customerNote: isPaid
      ? [
          `Service Date: ${formatServiceDateCompact(serviceDateSource)}`,
          `Thank you, ${contactFirst}!`,
          "We'll be back in: 3 months",
          'Brad @ Filtergo',
        ]
      : [`Service Date: ${formatServiceDateCompact(serviceDateSource)}`, 'Thank you!'],
    subtotal: formatInvoiceTotal(subtotalValue),
    salesTax: formatInvoiceTotal(taxValue),
    total: formatInvoiceTotal(totalValue),
    payment: formatInvoiceTotal(-totalValue),
    balanceDue: formatInvoiceTotal(0),
    paidInFull: isPaid,
  };
}
