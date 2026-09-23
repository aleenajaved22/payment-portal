import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PortalShell } from '../components/PortalShell';
import { FilterSelect } from '../components/FilterSelect';
import { PaymentMethodModal } from '../components/PaymentMethodModal';
import { GridRow, PAGE_GUTTER } from '../components/dashboard/DashboardGrid';
import { FilterMixPanel } from '../components/dashboard/FilterMixPanel';
import { PaymentMethodPanel } from '../components/dashboard/PaymentMethodPanel';
import { OutstandingPanel } from '../components/dashboard/OutstandingPanel';
import { ReportsPanel } from '../components/dashboard/ReportsPanel';
import { useAuth } from '../auth/AuthContext';
import { usePaymentMethods } from '../context/PaymentMethodsContext';
import { invoiceSiteFilterOptions, mockInvoices } from '../data/mockInvoices';
import { mockReports } from '../data/mockReports';
import { getMoneyTotals, getUnpaidInvoicesSorted } from '../data/dashboardMetrics';
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

/** Sample export for the mock. Real report files would replace this blob. */
function downloadReport(report) {
  const safe = (value) => String(value).replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '');
  const filename = `${safe(report.reportType)}_${safe(report.site)}_${safe(report.date)}.txt`;
  const body =
    `FilterGo — ${report.reportType}\n` +
    `Site: ${report.site}\n` +
    `Date: ${report.date}\n\n` +
    `This is a sample export for the customer portal demo.\n`;
  const url = URL.createObjectURL(new Blob([body], { type: 'text/plain' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function DashboardPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { session } = useAuth();
  const { defaultMethod, methods, setDefaultPaymentMethod, payAtCheckout, syncFromStorage } = usePaymentMethods();
  const [site, setSite] = useState('');
  /* Demo-only: lets whoever is presenting flip the Outstanding panel to its
     empty state on demand, without needing to clear real invoice data. */
  const [demoShowEmptyOutstanding, setDemoShowEmptyOutstanding] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [invoicesForPayment, setInvoicesForPayment] = useState([]);

  const subscription = useMemo(() => getSubscription(site), [site]);

  const scopedInvoices = useMemo(
    () => (site ? mockInvoices.filter((invoice) => invoice.site === site) : mockInvoices),
    [site],
  );
  const scopedReports = useMemo(
    () => (site ? mockReports.filter((report) => report.site === site) : mockReports),
    [site],
  );

  const totals = useMemo(() => getMoneyTotals(scopedInvoices), [scopedInvoices]);
  const unpaidInvoices = useMemo(() => getUnpaidInvoicesSorted(scopedInvoices), [scopedInvoices]);
  const outstandingTotals = demoShowEmptyOutstanding ? { outstanding: 0, overdue: 0, pending: 0 } : totals;
  const outstandingInvoices = demoShowEmptyOutstanding ? [] : unpaidInvoices;
  const filterMix = useMemo(() => getFilterMix(site), [site]);
  const recentReports = useMemo(() => getRecentReports(scopedReports, 1), [scopedReports]);
  const newReports = scopedReports.filter((report) => report.isNew).length;

  const firstName = (session?.name ?? 'there').split(' ')[0];
  const goToPayments = () => navigate('/invoice-payment');
  const goToReports = () => navigate('/reports');

  /** "Pay all" and each row's "Pay" go straight to checkout, not the invoice
   *  list — the dashboard already told them what's owed, so tapping Pay
   *  shouldn't be a detour back through the table to find it again. */
  const beginPayment = (invoices) => {
    if (!invoices.length) return;
    syncFromStorage();
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
          <FormControlLabel
            sx={{ mr: 0, '& .MuiFormControlLabel-label': { fontSize: 13, color: theme.palette.textSecondary2 } }}
            control={
              <Switch
                size="small"
                checked={demoShowEmptyOutstanding}
                onChange={(event) => setDemoShowEmptyOutstanding(event.target.checked)}
              />
            }
            label="Empty state"
          />
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
          onPay={(invoice) => beginPayment([invoice])}
          onPayAll={payAllOutstanding}
        />

        <Box sx={{ flex: { xs: '1 1 auto', md: '1 1 0' }, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <PaymentMethodPanel
            last
            method={defaultMethod}
            methods={methods}
            onSelectMethod={setDefaultPaymentMethod}
            onManage={() => navigate('/payment-methods')}
            sx={{ borderBottom: `1px solid ${theme.palette.borderSubtle1}` }}
          />
          <FilterMixPanel
            last
            mix={filterMix}
            visits={subscription?.servicesCount ?? null}
            sx={{ borderBottom: `1px solid ${theme.palette.borderSubtle1}` }}
          />
          <ReportsPanel
            last
            compact
            reports={recentReports}
            newCount={newReports}
            onViewAll={goToReports}
            onOpen={goToReports}
            onDownload={downloadReport}
          />
        </Box>
      </GridRow>

      <PaymentMethodModal
        open={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        invoices={invoicesForPayment}
        defaultTypeId={defaultMethod?.typeId}
        onPayNow={(payload) => {
          payAtCheckout(payload);
        }}
        onPaymentComplete={() => setPayModalOpen(false)}
      />
    </PortalShell>
  );
}
