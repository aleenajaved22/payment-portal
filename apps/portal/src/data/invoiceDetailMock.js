import { getBillToForSite, getInvoiceAmountBreakdown } from './mockInvoices';

const DEFAULT_LINE_ITEMS = [
  {
    lineItem: 'Filter Replacement',
    productDescription: '100*100*2',
    quantity: 1,
    unitPrice: 55,
    total: 55,
  },
  {
    lineItem: 'Filter Replacement',
    productDescription: '100*100*1',
    quantity: 1,
    unitPrice: 32.32,
    total: 32.32,
  },
];

const DEFAULT_ADJUSTMENT_LINE_ITEMS = [
  {
    lineItem: 'Filter Replacement',
    description: '100*100*2',
    quantity: 2,
    unitPrice: 55,
    total: 110,
  },
];

export function getInvoiceDetailExtras(invoice) {
  const billTo = getBillToForSite(invoice?.site);
  const amountBreakdown = getInvoiceAmountBreakdown(invoice);

  const contracts =
    invoice?.contracts ??
    (invoice?.contract ? [invoice.contract] : ['Contract Q1-2024', 'Contract Q2-2024']);

  return {
    billToAddress: billTo.address,
    contactPerson: billTo.contactPerson,
    contactPhone: billTo.contactPhone,
    contactEmail: billTo.contactEmail,
    invoiceGenerated: invoice?.invoiceDate ?? '12/12/24',
    invoiceDuration: invoice?.invoiceDuration ?? '12/12/24 - 02/25/24',
    poNumber: invoice?.poNumber ?? '67892',
    paymentTerms: invoice?.paymentTerms ?? 'NET 10',
    contracts,
    lineItems: invoice?.lineItems ?? DEFAULT_LINE_ITEMS,
    adjustmentLineItems: invoice?.adjustmentLineItems ?? DEFAULT_ADJUSTMENT_LINE_ITEMS,
    adjustmentsHelperText:
      'Review adjustments from the previous month that have been added to this invoice. You may delete the adjustment amount.',
    invoiceMemo:
      invoice?.invoiceMemo ??
      'This invoice includes charges for services provided under the Emerald Agreement. For questions, contact accounts@filtergo.com.',
    ...amountBreakdown,
  };
}
