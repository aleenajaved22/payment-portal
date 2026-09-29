import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useEffect, useMemo, useState } from 'react';
import { PortalShell } from '../components/PortalShell';
import { PaymentMethodModal } from '../components/PaymentMethodModal';
import { InvoicePreviewDrawer } from '../components/InvoicePreviewDrawer';
import { InvoiceStatsRow, InvoiceStatsSegmentRow } from '../components/InvoiceStatsRow';
import { InvoiceBoardList } from '../components/InvoiceBoardList';
import { InvoicesToolbar } from '../components/InvoicesToolbar';
import { EmptyState, InvoicesTable } from '../components/design-system';
import { useInvoices } from '../context/InvoicesContext';
import { usePaymentMethods } from '../context/PaymentMethodsContext';
import { PaymentConfirmationToast } from '../components/PaymentConfirmationToast';
import {
  formatInvoiceTotal,
  getInvoiceDashboardCards,
  getInvoiceStatusSegmentStats,
  getPendingInvoices,
  parseInvoiceAmount,
  parseInvoiceDate,
  sumInvoiceAmounts,
} from '../data/mockInvoices';

const ROWS_PER_PAGE = 8;
const STATS_LAYOUT_STORAGE_KEY = 'filtergo_portal_invoice_stats_layout';

export function InvoicePaymentPage() {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [site, setSite] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);
  const [sortField, setSortField] = useState('dueDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedIds, setSelectedIds] = useState([]);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [invoicesForPayment, setInvoicesForPayment] = useState([]);
  const [previewInvoice, setPreviewInvoice] = useState(null);
  const [previewDrawerOpen, setPreviewDrawerOpen] = useState(false);
  const [statsLayout, setStatsLayout] = useState(() => {
    try {
      const stored = localStorage.getItem(STATS_LAYOUT_STORAGE_KEY);
      if (stored === 'board' || stored === 'segment') return 'board';
      return 'grid';
    } catch {
      return 'grid';
    }
  });

  const { defaultMethod, defaultMethodId, methods, payAtCheckout, syncFromStorage } = usePaymentMethods();
  const { invoices: allInvoices, markInvoicesPaid } = useInvoices();
  const [lastPayment, setLastPayment] = useState(null);

  const openInvoicePreview = (invoice) => {
    setPreviewInvoice(invoice);
    setPreviewDrawerOpen(true);
  };

  const closeInvoicePreview = () => {
    setPreviewDrawerOpen(false);
    setPreviewInvoice(null);
  };

  const beginPayment = (invoices) => {
    if (!invoices.length) return;
    syncFromStorage();
    /* Clear the last confirmation as the next payment starts. It was only ever
       cleared on dismissal, so opening checkout again and cancelling brought
       back a toast describing a payment from several minutes earlier. */
    setLastPayment(null);
    setInvoicesForPayment(invoices);
    setPayModalOpen(true);
  };

  const openPaymentModalFromToolbar = () => {
    beginPayment(
      allInvoices.filter((invoice) => selectedIds.includes(invoice.id) && invoice.status !== 'Paid'),
    );
  };

  const dashboardCards = useMemo(() => getInvoiceDashboardCards(allInvoices), [allInvoices]);
  const statusSegmentStats = useMemo(() => getInvoiceStatusSegmentStats(allInvoices), [allInvoices]);
  const isBoardLayout = statsLayout === 'board';
  const pendingInvoices = useMemo(() => getPendingInvoices(allInvoices), [allInvoices]);
  const openPaymentModalForInvoice = (invoice) => {
    if (invoice.status === 'Paid') return;
    beginPayment([invoice]);
  };

  useEffect(() => {
    setPage(0);
  }, [query, site, status]);

  const filteredInvoices = useMemo(() => {
    let rows = [...allInvoices];

    if (query.trim()) {
      const normalized = query.trim().toLowerCase();
      rows = rows.filter(
        (invoice) =>
          invoice.invoiceNumber.toLowerCase().includes(normalized) ||
          invoice.site.toLowerCase().includes(normalized) ||
          invoice.amount.toLowerCase().includes(normalized) ||
          invoice.status.toLowerCase().includes(normalized) ||
          invoice.contract.toLowerCase().includes(normalized) ||
          invoice.dueDate.toLowerCase().includes(normalized),
      );
    }

    if (site) {
      rows = rows.filter((invoice) => invoice.site === site);
    }

    if (status) {
      rows = rows.filter((invoice) => invoice.status === status);
    }

    rows.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'dueDate') {
        aVal = parseInvoiceDate(aVal)?.getTime() ?? 0;
        bVal = parseInvoiceDate(bVal)?.getTime() ?? 0;
      }

      /* Amounts are strings like "$4,250.00", so comparing them directly sorts
         them as text — "$980.00" lands above "$4,250.00" because "9" beats "4".
         Noticed adding the Filters column beside it, which does sort numerically. */
      if (sortField === 'amount') {
        aVal = parseInvoiceAmount(aVal);
        bVal = parseInvoiceAmount(bVal);
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return rows;
  }, [allInvoices, query, site, status, sortField, sortDirection]);

  const pagedInvoices = filteredInvoices.slice(page * ROWS_PER_PAGE, page * ROWS_PER_PAGE + ROWS_PER_PAGE);
  const total = filteredInvoices.length;
  const from = total === 0 ? 0 : page * ROWS_PER_PAGE + 1;
  const to = Math.min((page + 1) * ROWS_PER_PAGE, total);
  const canPrev = page > 0;
  const canNext = (page + 1) * ROWS_PER_PAGE < total;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleToggleRow = (invoiceId) => {
    setSelectedIds((prev) =>
      prev.includes(invoiceId) ? prev.filter((id) => id !== invoiceId) : [...prev, invoiceId],
    );
  };

  const handleToggleAll = (checked) => {
    const pageIds = pagedInvoices.filter((invoice) => invoice.status !== 'Paid').map((invoice) => invoice.id);
    setSelectedIds((prev) => {
      if (checked) {
        return [...new Set([...prev, ...pageIds])];
      }
      return prev.filter((id) => !pageIds.includes(id));
    });
  };

  return (
    <PortalShell activeNav="invoice-payment" mainSx={{ pl: 0, pt: 0 }}>
      <Stack spacing={2.5}>
        <Box sx={{ mr: '-32px', width: 'calc(100% + 32px)' }}>
          {isBoardLayout ? (
            <InvoiceStatsRow cards={dashboardCards} stackedLayout />
          ) : (
            <InvoiceStatsSegmentRow
              segments={statusSegmentStats.segments}
              activeStatus={status}
              onSelectStatus={setStatus}
            />
          )}
        </Box>

        <Box sx={{ pl: '32px' }}>
          <Stack spacing={2.5}>
            <InvoicesToolbar
              query={query}
              onQueryChange={setQuery}
              site={site}
              onSiteChange={setSite}
              status={status}
              onStatusChange={setStatus}
              showPayNow={selectedIds.length > 0}
              onPayNow={openPaymentModalFromToolbar}
            />

            <Box
              sx={{
                pt: 0.5,
                maxHeight: isBoardLayout ? 'none' : 'calc(100vh - 280px)',
                overflowY: isBoardLayout ? 'visible' : 'auto',
                overflowX: 'hidden',
              }}
            >
              {filteredInvoices.length === 0 ? (
                <EmptyState
                  title="No invoices found"
                  description="Try adjusting your search or filters."
                />
              ) : isBoardLayout ? (
                <InvoiceBoardList
                  invoices={filteredInvoices}
                  selectedIds={selectedIds}
                  onToggleRow={handleToggleRow}
                  onViewInvoice={openInvoicePreview}
                />
              ) : (
                <>
                  <InvoicesTable
                    invoices={pagedInvoices}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                    selectedIds={selectedIds}
                    onToggleRow={handleToggleRow}
                    onToggleAll={handleToggleAll}
                    onViewInvoice={openInvoicePreview}
                    onViewInvoiceDocument={openInvoicePreview}
                    onPayInvoice={openPaymentModalForInvoice}
                  />

                  <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1.25} sx={{ pt: 2 }}>
                    <Typography variant="body2" sx={{ color: theme.palette.textSecondary2, fontSize: 14 }}>
                      {from}-{to} of {total}
                    </Typography>
                    <IconButton
                      size="small"
                      disabled={!canPrev}
                      onClick={() => setPage((p) => p - 1)}
                      sx={{
                        border: `1px solid ${theme.palette.borderSubtle2}`,
                        borderRadius: '50%',
                        width: 32,
                        height: 32,
                        color: theme.palette.textSecondary2,
                        '&.Mui-disabled': { opacity: 0.4 },
                      }}
                    >
                      <ChevronLeftIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      disabled={!canNext}
                      onClick={() => setPage((p) => p + 1)}
                      sx={{
                        border: `1px solid ${theme.palette.borderSubtle2}`,
                        borderRadius: '50%',
                        width: 32,
                        height: 32,
                        color: theme.palette.textSecondary2,
                        '&.Mui-disabled': { opacity: 0.4 },
                      }}
                    >
                      <ChevronRightIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Stack>
                </>
              )}
            </Box>
          </Stack>
        </Box>
      </Stack>

      <PaymentMethodModal
        open={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        invoices={invoicesForPayment}
        defaultTypeId={defaultMethod?.typeId}
        savedMethods={methods}
        defaultMethodId={defaultMethodId}
        onPayNow={(payload) => {
          payAtCheckout(payload);
          const settled = markInvoicesPaid(invoicesForPayment.map((invoice) => invoice.id));
          if (settled.length) {
            setLastPayment({
              amountLabel: formatInvoiceTotal(sumInvoiceAmounts(settled)),
              invoiceCount: settled.length,
            });
          }
        }}
        onPaymentComplete={() => {
          setPayModalOpen(false);
          setSelectedIds([]);
        }}
      />
      <InvoicePreviewDrawer
        open={previewDrawerOpen}
        invoice={previewInvoice}
        onClose={closeInvoicePreview}
        onPayNow={(invoice) => {
          closeInvoicePreview();
          openPaymentModalForInvoice(invoice);
        }}
      />

      <PaymentConfirmationToast
        open={Boolean(lastPayment) && !payModalOpen}
        amountLabel={lastPayment?.amountLabel}
        invoiceCount={lastPayment?.invoiceCount ?? 0}
        onClose={() => setLastPayment(null)}
      />
    </PortalShell>
  );
}
