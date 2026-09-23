import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { CardHeading, GridCell } from './DashboardGrid';
import { formatInvoiceTotal } from '../../data/mockInvoices';

/**
 * Outstanding money, split by how urgent it is and then listed by site.
 *
 * The bar answers "how much of this is already late" — overdue against pending,
 * which is the only split a customer acts on differently. Its key sits beside the
 * title rather than under the bar, so the bar itself needs no labels and the site
 * list starts higher up the card.
 *
 * Each row carries days rather than a percentage. A share of the total tells the
 * customer nothing they can act on; "52 days late" tells them which invoice is
 * about to become a problem.
 */

const SEGMENT_GAP = '3px';

/** The colour key, sat beside the title so the bar below needs no labels. */
function BarLegend({ items }) {
  const theme = useTheme();
  return (
    <Stack direction="row" alignItems="center" spacing={1.5}>
      {items.map((item) => (
        <Stack key={item.key} direction="row" alignItems="center" spacing={0.75}>
          <Box sx={{ width: 9, height: 9, borderRadius: '2px', flexShrink: 0, backgroundColor: item.fill }} />
          <Typography sx={{ fontSize: 12, lineHeight: '18px', color: theme.palette.textSecondary3 }}>
            {item.label}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

function formatDays(entry) {
  if (entry.days === null || entry.days === undefined) return null;
  if (entry.overdue) {
    const late = Math.abs(entry.days);
    return late === 0 ? 'Due today' : `${late}d late`;
  }
  if (entry.days === 0) return 'Due today';
  return `in ${entry.days}d`;
}

export function OutstandingBySitePanel({ sites, total, overdue = 0, pending = 0, flex = 1, last = false }) {
  const theme = useTheme();
  const hasOutstanding = total > 0 && sites.length > 0;

  const toneFor = (entry) =>
    entry.overdue
      ? { fill: theme.palette.surfaceAlertStrong, text: theme.palette.textAlert }
      : { fill: theme.palette.surfaceWarningStrong, text: theme.palette.textSecondary2 };

  const legendItems = [
    { key: 'overdue', label: 'Overdue', value: overdue, fill: theme.palette.surfaceAlertStrong },
    { key: 'pending', label: 'Pending', value: pending, fill: theme.palette.surfaceWarningStrong },
  ].filter((item) => item.value > 0);

  return (
    <GridCell flex={flex} last={last}>
      <CardHeading
        title="Outstanding by site"
        action={hasOutstanding ? <BarLegend items={legendItems} /> : null}
      />

      {!hasOutstanding ? (
        <Stack spacing={0.5} sx={{ py: 2 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: theme.palette.textPrimary }}>
            Nothing outstanding
          </Typography>
          <Typography sx={{ fontSize: 13, color: theme.palette.textSecondary3 }}>Every site is paid up.</Typography>
        </Stack>
      ) : (
        <>
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
            {formatInvoiceTotal(total)}
          </Typography>

          <Box sx={{ display: 'flex', gap: SEGMENT_GAP, height: 10, mt: 1.5 }}>
            {overdue > 0 ? (
              <Box
                title={`Overdue: ${formatInvoiceTotal(overdue)}`}
                sx={{
                  flexGrow: overdue,
                  flexBasis: 0,
                  borderRadius: '999px',
                  backgroundColor: theme.palette.surfaceAlertStrong,
                }}
              />
            ) : null}
            {pending > 0 ? (
              <Box
                title={`Pending: ${formatInvoiceTotal(pending)}`}
                sx={{
                  flexGrow: pending,
                  flexBasis: 0,
                  borderRadius: '999px',
                  backgroundColor: theme.palette.surfaceWarningStrong,
                }}
              />
            ) : null}
          </Box>

          <Stack sx={{ mt: 2.25 }}>
            {sites.map((entry, index) => (
              <Stack
                key={entry.site}
                direction="row"
                alignItems="center"
                spacing={1.25}
                sx={{
                  py: 1.125,
                  borderTop: index === 0 ? 'none' : `1px solid ${theme.palette.borderSubtle1}`,
                }}
              >
                <Box
                  sx={{
                    width: 9,
                    height: 9,
                    borderRadius: '50%',
                    flexShrink: 0,
                    backgroundColor: toneFor(entry).fill,
                  }}
                />
                <Typography sx={{ flex: 1, minWidth: 0, fontSize: 14, color: theme.palette.textPrimary }} noWrap>
                  {entry.site}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 500,
                    fontVariantNumeric: 'tabular-nums',
                    color: toneFor(entry).text,
                  }}
                >
                  {formatDays(entry)}
                </Typography>
                <Typography
                  sx={{
                    width: 92,
                    textAlign: 'right',
                    fontSize: 14,
                    fontWeight: 600,
                    fontVariantNumeric: 'tabular-nums',
                    color: theme.palette.textPrimary,
                  }}
                >
                  {formatInvoiceTotal(entry.amount)}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </>
      )}
    </GridCell>
  );
}
