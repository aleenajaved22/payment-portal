import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { mockInvoices } from '../data/mockInvoices';

/**
 * The invoices the portal is currently showing.
 *
 * Every screen used to import `mockInvoices` straight from the data module, so
 * paying an invoice could not change anything: the array was a module constant
 * and the checkout's only lasting effect was a saved card. Holding the same rows
 * in state instead makes payment mean something — the row leaves Outstanding,
 * the total drops, the bar re-proportions — which is the whole point of the
 * dashboard's primary action.
 *
 * Deliberately in memory only. A reload restores the seed data, which is what a
 * demo wants: the flow can be walked again from the top without a reset button.
 */

const InvoicesContext = createContext(null);

export function InvoicesProvider({ children }) {
  const [invoices, setInvoices] = useState(mockInvoices);

  /**
   * Settle a set of invoices. Returns the rows that actually changed, so the
   * caller can report "3 invoices paid" without counting ones that were already
   * settled — paying a stale selection shouldn't inflate the confirmation.
   */
  const markInvoicesPaid = useCallback(
    (invoiceIds = []) => {
      const ids = new Set(invoiceIds);
      if (ids.size === 0) return [];

      // Worked out here rather than inside the updater: React may call an
      // updater twice, and the return value has to be counted once.
      const settling = invoices.filter((invoice) => ids.has(invoice.id) && invoice.status !== 'Paid');
      if (settling.length === 0) return [];

      const paidAt = new Date().toISOString();
      const settlingIds = new Set(settling.map((invoice) => invoice.id));

      setInvoices((previous) =>
        previous.map((invoice) =>
          settlingIds.has(invoice.id) ? { ...invoice, status: 'Paid', paidAt } : invoice,
        ),
      );

      return settling.map((invoice) => ({ ...invoice, status: 'Paid', paidAt }));
    },
    [invoices],
  );

  const value = useMemo(() => ({ invoices, markInvoicesPaid }), [invoices, markInvoicesPaid]);

  return <InvoicesContext.Provider value={value}>{children}</InvoicesContext.Provider>;
}

export function useInvoices() {
  const ctx = useContext(InvoicesContext);
  if (!ctx) {
    throw new Error('useInvoices must be used within InvoicesProvider');
  }
  return ctx;
}
