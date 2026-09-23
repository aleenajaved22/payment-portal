import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { CardArrow, CardBand, DashboardCard } from './DashboardGrid';
import { formatInvoiceTotal } from '../../data/mockInvoices';

/**
 * The glance row: the figures that answer "how am I doing" before the customer
 * reads anything else.
 *
 * Every card has the same anatomy — a headline figure, then a footer whose label
 * and value describe exactly what the bar underneath is measuring. That rule is
 * what keeps the bars honest: a ratio with no denominator in the data does not
 * get invented, the card is dropped instead. It is why the plan cards change
 * shape with the contract type and vanish for contracts that cannot support
 * them.
 *
 * A card only shows its open arrow when it has somewhere to go; the plan figures
 * have no contract route yet, so they read as figures rather than links.
 */

/**
 * Bar fill + footer text colour per tone, from the DS semantic ramps.
 *
 * The footer uses textBrandHover (#027A48) rather than textSuccess (#2E964B) for
 * the success tone: at 13px the lighter green only reaches 3.8:1 on white, short
 * of the 4.5:1 AA floor.
 */
function useTones() {
  const theme = useTheme();
  return {
    alert: { fill: theme.palette.surfaceAlertStrong, text: theme.palette.textAlert },
    success: { fill: theme.palette.surfaceSuccessStrong, text: theme.palette.textBrandHover },
    neutral: { fill: theme.palette.borderStrong1, text: theme.palette.textPrimary },
  };
}

function formatCardDate(value) {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) return null;
  return value.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function toPercent(ratio) {
  return Math.round(Math.min(1, Math.max(0, ratio || 0)) * 100);
}

function StatCard({ card, onOpen }) {
  const theme = useTheme();
  const tones = useTones();
  const tone = tones[card.tone] ?? tones.neutral;

  return (
    <DashboardCard sx={{ minHeight: 172 }}>
      <Stack direction="row" alignItems="flex-start" spacing={1.25}>
        <Typography
          sx={{
            flex: 1,
            minWidth: 0,
            fontSize: 14,
            fontWeight: 500,
            lineHeight: '20px',
            color: theme.palette.textSecondary2,
          }}
        >
          {card.title}
        </Typography>
        <CardArrow
          label={`Open ${card.title}`}
          onClick={card.target && onOpen ? () => onOpen(card.target) : null}
        />
      </Stack>

      <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap' }}>
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
          {card.value}
        </Typography>
        {card.unit ? (
          <Typography sx={{ fontSize: 13, lineHeight: '20px', color: theme.palette.textSecondary3 }}>
            {card.unit}
          </Typography>
        ) : null}
      </Stack>

      <Box sx={{ flex: 1, minHeight: 20 }} />

      <Stack direction="row" alignItems="baseline" spacing={1.25} sx={{ mb: 1 }}>
        <Typography sx={{ flex: 1, minWidth: 0, fontSize: 13, lineHeight: '20px', color: theme.palette.textSecondary2 }}>
          {card.footLabel}
        </Typography>
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 600,
            lineHeight: '20px',
            fontVariantNumeric: 'tabular-nums',
            color: tone.text,
          }}
        >
          {card.footValue}
        </Typography>
      </Stack>

      <Box
        role="img"
        aria-label={`${card.footLabel}: ${toPercent(card.ratio)}%`}
        sx={{ height: 8, borderRadius: '999px', backgroundColor: theme.palette.surfaceGreySubtle, overflow: 'hidden' }}
      >
        <Box sx={{ height: '100%', width: `${toPercent(card.ratio)}%`, backgroundColor: tone.fill }} />
      </Box>
    </DashboardCard>
  );
}

/**
 * Money figures come from the company-wide invoice totals, so they hold at any
 * site scope. The plan figures come from the selected site's contract, which is
 * why they change shape with the contract type: a recurring plan has a schedule
 * and a list price to compare against, a per-service one has neither and reports
 * what it has actually delivered instead.
 */
export function buildStatCards(totals, subscription) {
  const settledRatio = totals.totalBilled > 0 ? totals.paid / totals.totalBilled : 0;

  const cards = [
    {
      key: 'outstanding',
      title: 'Outstanding',
      value: formatInvoiceTotal(totals.outstanding),
      unit: totals.outstandingCount === 1 ? 'across 1 invoice' : `across ${totals.outstandingCount} invoices`,
      footLabel: 'Overdue',
      footValue: formatInvoiceTotal(totals.overdue),
      ratio: totals.outstanding > 0 ? totals.overdue / totals.outstanding : 0,
      tone: 'alert',
      target: 'payments',
    },
    {
      key: 'paid',
      title: 'Paid to date',
      value: formatInvoiceTotal(totals.paid),
      unit: `of ${formatInvoiceTotal(totals.totalBilled)} billed`,
      footLabel: 'Settled',
      footValue: `${toPercent(settledRatio)}%`,
      ratio: settledRatio,
      tone: 'success',
      target: 'payments',
    },
  ];

  if (!subscription) return cards;

  if (subscription.planType === 'recurring') {
    const { nextCharge, paymentsMade, paymentsTotal, pricePerCycle, basePrice, discountPercent } = subscription;

    cards.push({
      key: 'next-charge',
      title: 'Next charge',
      value: nextCharge ? formatInvoiceTotal(nextCharge.amount) : '—',
      unit: nextCharge ? formatCardDate(nextCharge.date) : 'Nothing scheduled',
      footLabel: `${subscription.cadence} plan`,
      footValue: `Payment ${paymentsMade} of ${paymentsTotal}`,
      ratio: paymentsTotal > 0 ? paymentsMade / paymentsTotal : 0,
      tone: 'neutral',
    });

    if (discountPercent > 0) {
      cards.push({
        key: 'discount',
        title: 'Plan discount',
        value: `${discountPercent}%`,
        unit: 'below list price',
        footLabel: 'You pay',
        footValue: `${formatInvoiceTotal(pricePerCycle)} of ${formatInvoiceTotal(basePrice)}`,
        ratio: basePrice > 0 ? pricePerCycle / basePrice : 0,
        tone: 'success',
      });
    }

    return cards;
  }

  // Per-service: no schedule and no list price, so report delivery instead.
  const { billedToDate, servicesCount, lastService, serviceHistory, contractProgress } = subscription;
  const totalFilters = (serviceHistory ?? []).reduce((sum, entry) => sum + (entry.filters ?? 0), 0);

  cards.push({
    key: 'billed-to-date',
    title: 'Billed to date',
    value: formatInvoiceTotal(billedToDate),
    unit: servicesCount === 1 ? 'over 1 service' : `over ${servicesCount} services`,
    footLabel: 'Contract term',
    footValue: `${toPercent(contractProgress)}% elapsed`,
    ratio: contractProgress,
    tone: 'neutral',
  });

  if (lastService && totalFilters > 0) {
    cards.push({
      key: 'last-service',
      title: 'Last service',
      value: formatInvoiceTotal(lastService.amount),
      unit: formatCardDate(lastService.date),
      footLabel: 'Filters replaced',
      footValue: `${lastService.filters} of ${totalFilters}`,
      ratio: lastService.filters / totalFilters,
      tone: 'success',
    });
  }

  return cards;
}

export function DashboardStatCards({ totals, subscription, onOpen }) {
  const cards = buildStatCards(totals, subscription);

  return (
    <CardBand columns={cards.length} sx={{ pb: 0 }}>
      {cards.map((card) => (
        <StatCard key={card.key} card={card} onOpen={onOpen} />
      ))}
    </CardBand>
  );
}
