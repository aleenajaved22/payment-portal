import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { GridCell } from './DashboardGrid';
import { InvoiceStatusChip } from '../design-system/InvoiceStatusChip';
import { Button } from '../design-system';
import { formatInvoiceDueDate, formatInvoiceTotal } from '../../data/mockInvoices';

const SECTION_HEADING_SX = {
  fontSize: 16,
  fontWeight: 700,
  lineHeight: '20px',
};

/**
 * A slim two-tone meter of the outstanding balance, split Overdue (urgent) vs
 * Due soon. It shows how much of what's owed needs attention now and leaves out
 * the settled "paid" amount, which is done and not something a customer acts on.
 */
function DueMeter({ totals }) {
  const theme = useTheme();
  if (totals.outstanding <= 0) return null;

  const segments = [
    {
      key: 'overdue',
      label: 'Overdue',
      value: totals.overdue,
      color: theme.palette.surfaceAlertStrong,
      amountColor: theme.palette.textAlert,
    },
    {
      key: 'pending',
      label: 'Due soon',
      value: totals.pending,
      color: theme.palette.surfaceWarningStrong,
      amountColor: theme.palette.textPrimary,
    },
  ];
  const total = totals.outstanding || 1;

  return (
    <Box sx={{ mt: 2.5 }}>
      <Box
        sx={{
          display: 'flex',
          height: 8,
          borderRadius: '999px',
          overflow: 'hidden',
          backgroundColor: theme.palette.surfaceGreySubtle,
        }}
      >
        {segments.map((segment) =>
          segment.value > 0 ? (
            <Box
              key={segment.key}
              sx={{ width: `${(segment.value / total) * 100}%`, backgroundColor: segment.color }}
              title={`${segment.label}: ${formatInvoiceTotal(segment.value)}`}
            />
          ) : null,
        )}
      </Box>

      <Stack direction="row" spacing={2.5} sx={{ mt: 1.25, flexWrap: 'wrap' }}>
        {segments.map((segment) => (
          <Stack key={segment.key} direction="row" alignItems="center" spacing={0.75}>
            <Box sx={{ width: 8, height: 8, borderRadius: '2px', backgroundColor: segment.color, flexShrink: 0 }} />
            <Typography sx={{ fontSize: 12, color: theme.palette.textSecondary3 }}>{segment.label}</Typography>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 600,
                fontVariantNumeric: 'tabular-nums',
                color: segment.amountColor,
              }}
            >
              {formatInvoiceTotal(segment.value)}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}

function InvoiceRow({ invoice, onPay, isLast }) {
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={{ py: 1.25, borderBottom: isLast ? 'none' : `1px solid ${theme.palette.borderSubtle1}` }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: theme.palette.textPrimary }} noWrap>
            {invoice.invoiceNumber}
          </Typography>
          <InvoiceStatusChip status={invoice.status} />
        </Stack>
        <Typography sx={{ mt: 0.25, fontSize: 12, color: theme.palette.textSecondary3 }} noWrap>
          {invoice.site} · due {formatInvoiceDueDate(invoice.dueDate)}
        </Typography>
      </Box>
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 600,
          fontVariantNumeric: 'tabular-nums',
          color: theme.palette.textPrimary,
          flexShrink: 0,
        }}
      >
        {invoice.amount}
      </Typography>
      <Button
        variant="tertiaryGrey"
        size="small"
        onClick={() => onPay(invoice)}
        sx={{ flexShrink: 0, minWidth: 'auto', px: 1.5, color: theme.palette.textBrand }}
      >
        Pay
      </Button>
    </Stack>
  );
}

/**
 * The billing job in one place: the outstanding total with overdue called out and
 * a payment-volume bar for scale, then the invoices that still need paying with a
 * Pay on each. Both the "what do I owe" glance and the "let me pay it" action.
 */
export function BillingPanel({ totals, invoices, onPay, onPayAll, flex = 1, last = false }) {
  const theme = useTheme();
  const hasOutstanding = totals.outstanding > 0;

  return (
    <GridCell flex={flex} last={last}>
      {/* Outstanding headline */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
        spacing={2}
      >
        <Box>
          <Typography sx={{ ...SECTION_HEADING_SX, color: theme.palette.textPrimary }}>Outstanding balance</Typography>
          <Typography
            sx={{
              mt: 0.75,
              fontSize: 30,
              fontWeight: 700,
              lineHeight: '36px',
              letterSpacing: '-0.02em',
              fontVariantNumeric: 'tabular-nums',
              color: theme.palette.textPrimary,
            }}
          >
            {formatInvoiceTotal(totals.outstanding)}
          </Typography>
        </Box>
        {hasOutstanding ? (
          <Button variant="primary" onClick={onPayAll} sx={{ flexShrink: 0 }}>
            Pay all
          </Button>
        ) : null}
      </Stack>

      <DueMeter totals={totals} />

      {/* Invoices to pay */}
      <Box sx={{ mt: 2.5, pt: 2, borderTop: `1px solid ${theme.palette.borderSubtle1}` }}>
        <Typography sx={{ ...SECTION_HEADING_SX, mb: 1, color: theme.palette.textPrimary }}>
          Invoices to pay{invoices.length ? ` · ${invoices.length}` : ''}
        </Typography>

        {invoices.length === 0 ? (
          <Stack spacing={0.5} sx={{ py: 2 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: theme.palette.textPrimary }}>
              You're all caught up
            </Typography>
            <Typography sx={{ fontSize: 13, color: theme.palette.textSecondary3 }}>
              No invoices are awaiting payment.
            </Typography>
          </Stack>
        ) : (
          <Stack>
            {invoices.map((invoice, index) => (
              <InvoiceRow
                key={invoice.id}
                invoice={invoice}
                onPay={onPay}
                isLast={index === invoices.length - 1}
              />
            ))}
          </Stack>
        )}
      </Box>
    </GridCell>
  );
}
