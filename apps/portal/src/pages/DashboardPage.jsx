import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PortalShell } from '../components/PortalShell';
import { FilterSelect } from '../components/FilterSelect';
import { DemoControls } from '../components/DemoControls';
import { PaymentConfirmationToast } from '../components/PaymentConfirmationToast';
import { PaymentMethodModal } from '../components/PaymentMethodModal';
import { GridRow, PAGE_GUTTER } from '../components/dashboard/DashboardGrid';
import { FilterMixPanel } from '../components/dashboard/FilterMixPanel';
import { PaymentMethodPanel } from '../components/dashboard/PaymentMethodPanel';
import { OutstandingPanel } from '../components/dashboard/OutstandingPanel';
import { ReportsPanel } from '../components/dashboard/ReportsPanel';
import { useAuth } from '../auth/AuthContext';
import { useInvoices } from '../context/InvoicesContext';
import { usePaymentMethods } from '../context/PaymentMethodsContext';
import { useReports } from '../context/ReportsContext';
import { downloadReport } from '../data/reportFilters';
import { formatInvoiceTotal, invoiceSiteFilterOptions, sumInvoiceAmounts } from '../data/mockInvoices';
import { getLastPayment, getMoneyTotals, getUnpaidInvoicesSorted } from '../data/dashboardMetrics';
import { getFilterMix } from '../data/filterUsage';
import { getSubscription } from '../data/subscriptionMock';

/**
 * Newest first, full stop. The panel is about recency, so "new" is a badge on a
 * report rather than a reason to lift it above a more recent one; source order
 * only breaks ties between unparseable dates.
 */
function getRecentReports(reports, limit = 4) {
  return reports
    .map((report, index) => ({ report, index, time: Date.parse(report.date) }))
    .sort((a, b) => {
      if (Number.isNaN(a.time) || Number.isNaN(b.time)) return a.index - b.index;
      return b.time - a.time;
    })
    .slice(0, limit)
    .map((entry) => entry.report);
}

export function DashboardPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { session } = useAuth();
  const { defaultMethod, defaultMethodId, methods, setDefaultPaymentMethod, payAtCheckout, syncFromStorage } =
    usePaymentMethods();
  const { invoices: allInvoices, markInvoicesPaid } = useInvoices();
  const { reports: allReports, newCount: unreadReports } = useReports();
  const [site, setSite] = useState('');
  /* Demo-only: lets whoever is presenting flip the Outstanding panel to its
     empty state on demand, without needing to clear real invoice data. The
     control for it lives in [DemoControls], out of the product's own chrome. */
  const [demoShowEmptyOutstanding, setDemoShowEmptyOutstanding] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [invoicesForPayment, setInvoicesForPayment] = useState([]);
  /** Survives the dialog closing, which is the point of it. */
  const [lastPayment, setLastPayment] = useState(null);

  const subscription = useMemo(() => getSubscription(site), [site]);

  const scopedInvoices = useMemo(
    () => (site ? allInvoices.filter((invoice) => invoice.site === site) : allInvoices),
    [allInvoices, site],
  );
  const scopedReports = useMemo(
    () => (site ? allReports.filter((report) => report.site === site) : allReports),
    [allReports, site],
  );

  const totals = useMemo(() => getMoneyTotals(scopedInvoices), [scopedInvoices]);
  const unpaidInvoices = useMemo(() => getUnpaidInvoicesSorted(scopedInvoices), [scopedInvoices]);
  const outstandingTotals = demoShowEmptyOutstanding ? { outstanding: 0, overdue: 0, pending: 0 } : totals;
  const outstandingInvoices = demoShowEmptyOutstanding ? [] : unpaidInvoices;
  /* Named for what it is, to keep it clear of `lastPayment` above — that one is
     the toast's transient copy, this one is derived from the invoices and is
     what the empty state reports. */
  const lastSettlement = useMemo(() => getLastPayment(scopedInvoices), [scopedInvoices]);
  const filterMix = useMemo(() => getFilterMix(site), [site]);
  const recentReports = useMemo(() => getRecentReports(scopedReports, 1), [scopedReports]);
  /* Scoped like everything else on this dashboard: with a site selected the
     count must describe that site, not the estate. */
  const newReports = site ? scopedReports.filter((report) => report.isNew).length : unreadReports;

  const firstName = (session?.name ?? 'there').split(' ')[0];
  const goToPayments = () => navigate('/invoice-payment');
  const goToReports = () => navigate('/reports');
  /* Hands the specific report over to the Reports page, which owns the drawer
     and the read state — the dashboard tile shouldn't grow a second copy of
     either just to open one report. */
  const openReport = (report) => navigate(`/reports?report=${encodeURIComponent(report.id)}`);

  /** "Pay all" and each row's "Pay" go straight to checkout, not the invoice
   *  list — the dashboard already told them what's owed, so tapping Pay
   *  shouldn't be a detour back through the table to find it again. */
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
  const payAllOutstanding = () => beginPayment(outstandingInvoices);

  return (
    <PortalShell activeNav="dashboard" mainSx={{ px: 0, pt: 0, pb: 0 }}>
      {/* Greeting band — full-bleed, padding lives inside. */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          px: PAGE_GUTTER,
          py: '24px',
          borderBottom: `1px solid ${theme.palette.borderSubtle1}`,
        }}
      >
        <Box>
          <Typography
            component="h1"
            sx={{ fontSize: 22, fontWeight: 700, lineHeight: '30px', color: theme.palette.textPrimary }}
          >
            Hi {firstName}, welcome back 👋
          </Typography>
          <Typography sx={{ mt: 0.25, fontSize: 14, color: theme.palette.textSecondary2 }}>
            Here's what needs your attention today.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              border: `1px solid ${theme.palette.borderSubtle1}`,
              borderRadius: '8px',
              backgroundColor: theme.palette.surfaceWhite,
            }}
          >
            <FilterSelect label="All sites" value={site} onChange={setSite} options={invoiceSiteFilterOptions} />
          </Box>
        </Box>
      </Box>

      {/* Two columns, not two bands: the money is one continuous surface, so it
          runs the full height beside a stack of the three supporting panels. */}
      <GridRow last>
        <OutstandingPanel
          flex={1.7}
          totals={outstandingTotals}
          invoices={outstandingInvoices}
          site={site}
          lastPayment={lastSettlement}
          onViewAll={goToPayments}
          onPay={(invoice) => beginPayment([invoice])}
          onPayAll={payAllOutstanding}
          onGoToPayments={goToPayments}
        />

        <Box sx={{ flex: { xs: '1 1 auto', md: '1 1 0' }, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          {/* GridCell's `flex: 1 1 0` is meant for dividing a row into columns.
              In this column it becomes vertical stretch, so the three panels
              were splitting whatever height the Outstanding list dictated —
              which left a list of bars with 51px of nothing under the last one,
              reading as a row that failed to render. The first two panels hug
              their content; the slack collects once, at the foot of the column,
              inside Reports, where trailing space reads as room for more. */}
          <PaymentMethodPanel
            last
            method={defaultMethod}
            methods={methods}
            onSelectMethod={setDefaultPaymentMethod}
            onManage={() => navigate('/payment-methods')}
            sx={{ flex: '0 0 auto', borderBottom: `1px solid ${theme.palette.borderSubtle1}` }}
          />
          <FilterMixPanel
            last
            mix={filterMix}
            visits={subscription?.servicesCount ?? null}
            sx={{ flex: '0 0 auto', borderBottom: `1px solid ${theme.palette.borderSubtle1}` }}
          />
          <ReportsPanel
            last
            compact
            reports={recentReports}
            newCount={newReports}
            onViewAll={goToReports}
            onOpen={openReport}
            onDownload={downloadReport}
          />
        </Box>
      </GridRow>

      <PaymentMethodModal
        open={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        invoices={invoicesForPayment}
        defaultTypeId={defaultMethod?.typeId}
        savedMethods={methods}
        defaultMethodId={defaultMethodId}
        onPayNow={(payload) => {
          payAtCheckout(payload);
          /* Settling happens the moment the charge is authorised, not when the
             dialog is dismissed: the numbers behind the success screen should
             already be right if the customer closes it early. */
          const settled = markInvoicesPaid(invoicesForPayment.map((invoice) => invoice.id));
          if (settled.length) {
            setLastPayment({
              amountLabel: formatInvoiceTotal(sumInvoiceAmounts(settled)),
              invoiceCount: settled.length,
            });
          }
        }}
        onPaymentComplete={() => setPayModalOpen(false)}
      />

      <DemoControls
        items={[
          {
            id: 'empty-outstanding',
            label: 'Empty state',
            hint: 'Show Outstanding with nothing due',
            checked: demoShowEmptyOutstanding,
            onChange: setDemoShowEmptyOutstanding,
          },
        ]}
      />

      <PaymentConfirmationToast
        open={Boolean(lastPayment) && !payModalOpen}
        amountLabel={lastPayment?.amountLabel}
        invoiceCount={lastPayment?.invoiceCount ?? 0}
        onClose={() => setLastPayment(null)}
        onViewInvoices={goToPayments}
      />
    </PortalShell>
  );
}
