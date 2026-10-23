const OVERDUE_STATUS_COLORS = { dot: '#B32318', halo: '#FBEEED' };

/** Inner dot + outer halo — payments stats row and invoice status chips. */
export const INVOICE_STATUS_COLORS = {
  Paid: { dot: '#31A150', halo: '#DEF1DE' },
  Overdue: OVERDUE_STATUS_COLORS,
  'Payment Failed': OVERDUE_STATUS_COLORS,
  Pending: { dot: '#FE7711', halo: '#FFEED4' },
};

export const INVOICE_PAID_DOT = INVOICE_STATUS_COLORS.Paid.dot;
export const INVOICE_PAID_HALO = INVOICE_STATUS_COLORS.Paid.halo;

export const INVOICE_OVERDUE_ORANGE = INVOICE_STATUS_COLORS.Overdue.dot;
export const INVOICE_OVERDUE_HALO = INVOICE_STATUS_COLORS.Overdue.halo;

export const INVOICE_PAYMENT_FAILED_RED = INVOICE_STATUS_COLORS['Payment Failed'].dot;
export const INVOICE_PAYMENT_FAILED_HALO = INVOICE_STATUS_COLORS['Payment Failed'].halo;

export const INVOICE_PENDING_DOT = INVOICE_STATUS_COLORS.Pending.dot;
export const INVOICE_PENDING_HALO = INVOICE_STATUS_COLORS.Pending.halo;
