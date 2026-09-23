import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { CardHeading, GridCell } from './DashboardGrid';
import { Button } from '../design-system';
import { formatInvoiceDueDate, formatInvoiceTotal } from '../../data/mockInvoices';

/**
 * Everything owed, and the means to clear it — one surface instead of two.
 *
 * This used to be split between a per-site breakdown and a separate list of
 * invoices to pay, which restated the same balance twice within a screen's
 * height. Merged, the figure is stated once: the total, the overdue-against-
 * pending bar beneath it, then the individual invoices that make it up.
 *
 * Rows are per invoice rather than per site, because an invoice is the thing a
 * customer actually pays. The site leads each row since that is how an owner of
 * several locations thinks about the debt, and the invoice number sits beneath
 * it as the reference they will quote.
 */

const SEGMENT_GAP = '3px';

/**
 * The colour key, beside the title, so the bar itself needs no labels.
 * A circle, not a rounded square — the same shape InvoiceRow uses for its
 * status dot, so the same red and amber read as one vocabulary wherever
 * they show up on this panel rather than two slightly different shapes.
 */
function BarLegend({ items }) {
  const theme = useTheme();
  return (
    <Stack direction="row" alignItems="center" spacing={1.5}>
      {items.map((item) => (
        <Stack key={item.key} direction="row" alignItems="center" spacing={0.75}>
          <Box sx={{ width: 9, height: 9, borderRadius: '50%', flexShrink: 0, backgroundColor: item.fill }} />
          <Typography sx={{ fontSize: 12, lineHeight: '18px', color: theme.palette.textSecondary3 }}>
            {item.label}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

function InvoiceRow({ invoice, onPay, isLast }) {
  const theme = useTheme();
  const days = invoice.daysToDue;
  const isOverdue = invoice.status === 'Overdue';
  const tone = isOverdue
    ? { dot: theme.palette.surfaceAlertStrong, text: theme.palette.textAlert }
    : { dot: theme.palette.surfaceWarningStrong, text: theme.palette.textSecondary2 };

  let timing = null;
  if (days !== null && days !== undefined) {
    if (days < 0) timing = `${Math.abs(days)}d`;
    else if (days === 0) timing = 'Today';
    else timing = `${days}d`;
  }

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={{ py: 1.25, borderBottom: isLast ? 'none' : `1px solid ${theme.palette.borderSubtle1}` }}
    >
      <Box sx={{ width: 9, height: 9, borderRadius: '50%', flexShrink: 0, backgroundColor: tone.dot }} />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 500, color: theme.palette.textPrimary }} noWrap>
          {invoice.site}
        </Typography>
        <Typography sx={{ mt: '1px', fontSize: 12, color: theme.palette.textSecondary3 }} noWrap>
          {invoice.invoiceNumber} · due {formatInvoiceDueDate(invoice.dueDate)}
        </Typography>
      </Box>

      <Typography
        sx={{ fontSize: 12, fontWeight: 500, fontVariantNumeric: 'tabular-nums', color: tone.text, flexShrink: 0 }}
      >
        {timing}
      </Typography>

      <Typography
        sx={{
          width: 96,
          textAlign: 'right',
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
 * Nothing owed reads as good news, not a blank panel — the gust clip and the
 * line beneath it carry that, and the link stays because the panel is still
 * the place to check in on payments even when none are due right now.
 */
function EmptyOutstanding({ onGoToPayments }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 320,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <Box
        component="video"
        src="/gusty.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        sx={{ width: 220, height: 220, objectFit: 'contain' }}
      />
      <Typography sx={{ mt: 1, fontSize: 15, fontWeight: 600, color: theme.palette.textPrimary }}>
        You're all caught up
      </Typography>
      <Typography sx={{ mt: 0.5, fontSize: 13, color: theme.palette.textSecondary3 }}>
        No invoices are awaiting payment.
      </Typography>
      <Button
        variant="onlyText"
        onClick={onGoToPayments}
        endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
        sx={{ mt: 2, color: theme.palette.textBrand }}
      >
        Go to Payments
      </Button>
    </Box>
  );
}

export function OutstandingPanel({ totals, invoices, onPay, onPayAll, flex = 1, last = false }) {
  const theme = useTheme();
  const hasOutstanding = totals.outstanding > 0;

  const legendItems = [
    { key: 'overdue', label: 'Overdue', value: totals.overdue, fill: theme.palette.surfaceAlertStrong },
    { key: 'pending', label: 'Pending', value: totals.pending, fill: theme.palette.surfaceWarningStrong },
  ].filter((item) => item.value > 0);

  return (
    <GridCell flex={flex} last={last} sx={{ display: 'flex', flexDirection: 'column' }}>
      <CardHeading
        title="Outstanding"
        action={
          hasOutstanding ? (
            <Button variant="primary" onClick={onPayAll}>
              Pay all
            </Button>
          ) : null
        }
      />

      {!hasOutstanding ? (
        <EmptyOutstanding onGoToPayments={onPayAll} />
      ) : (
        <>
          {/* The legend sits on the baseline directly above the bar it explains,
              which leaves the top-right corner to the one action on the card. */}
          <Stack direction="row" alignItems="flex-end" justifyContent="space-between" spacing={2}>
            <Typography
              sx={{
                fontSize: 30,
                fontWeight: 700,
                lineHeight: '38px',
                letterSpacing: '-0.02em',
                fontVariantNumeric: 'tabular-nums',
                color: theme.palette.textPrimary,
              }}
            >
              {formatInvoiceTotal(totals.outstanding)}
            </Typography>
            <Box sx={{ flexShrink: 0, pb: '6px' }}>
              <BarLegend items={legendItems} />
            </Box>
          </Stack>

          {/* The track is the full billed amount; the fill is only what's still
              owed. Paid doesn't get a segment of its own — it's just the empty
              rest of the line, the same way a loading bar reads "done" as gap. */}
          <Box
            sx={{
              position: 'relative',
              height: 10,
              mt: 1.5,
              borderRadius: '999px',
              backgroundColor: theme.palette.borderSubtle1,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: SEGMENT_GAP,
                height: '100%',
                width: totals.totalBilled > 0 ? `${(totals.outstanding / totals.totalBilled) * 100}%` : '0%',
              }}
            >
              {/* Each segment rounds only the corners facing outward — the far
                  left of whichever segment leads, the far right of whichever
                  trails. Matching radii on both sides of the gap would draw
                  two capsules meeting nose-to-nose instead of one shape with
                  a clean break in it. */}
              {totals.overdue > 0 ? (
                <Box
                  title={`Overdue: ${formatInvoiceTotal(totals.overdue)}`}
                  sx={{
                    flexGrow: totals.overdue,
                    flexBasis: 0,
                    borderTopLeftRadius: '999px',
                    borderBottomLeftRadius: '999px',
                    borderTopRightRadius: totals.pending > 0 ? 0 : '999px',
                    borderBottomRightRadius: totals.pending > 0 ? 0 : '999px',
                    backgroundColor: theme.palette.surfaceAlertStrong,
                  }}
                />
              ) : null}
              {totals.pending > 0 ? (
                <Box
                  title={`Pending: ${formatInvoiceTotal(totals.pending)}`}
                  sx={{
                    flexGrow: totals.pending,
                    flexBasis: 0,
                    borderTopLeftRadius: totals.overdue > 0 ? 0 : '999px',
                    borderBottomLeftRadius: totals.overdue > 0 ? 0 : '999px',
                    borderTopRightRadius: '999px',
                    borderBottomRightRadius: '999px',
                    backgroundColor: theme.palette.surfaceWarningStrong,
                  }}
                />
              ) : null}
            </Box>
          </Box>

          <Stack sx={{ mt: 2.25 }}>
            {invoices.map((invoice, index) => (
              <InvoiceRow
                key={invoice.id}
                invoice={invoice}
                onPay={onPay}
                isLast={index === invoices.length - 1}
              />
            ))}
          </Stack>
        </>
      )}
    </GridCell>
  );
}
