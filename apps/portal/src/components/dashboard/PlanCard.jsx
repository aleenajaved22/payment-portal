import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import { PAGE_GUTTER } from './DashboardGrid';
import { Button } from '../design-system';

const DEEP_GREEN = '#05603a';
const ON_GREEN = 'rgba(255, 255, 255, 0.72)';
const ON_GREEN_FAINT = 'rgba(255, 255, 255, 0.45)';

const fmtMoney = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
const fmtDay = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const fmtLong = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

/* ------------------------------------------------------------------ */
/* Left face: the plan's identity — differs by contract type.          */
/* ------------------------------------------------------------------ */
function PlanFace({ subscription, paymentMethod }) {
  const isRecurring = subscription.planType === 'recurring';

  return (
    <Box
      sx={{
        flex: { xs: '1 1 auto', md: '0 0 38%' },
        backgroundColor: DEEP_GREEN,
        color: '#ffffff',
        pl: PAGE_GUTTER,
        pr: { xs: PAGE_GUTTER, md: '28px' },
        py: '28px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Typography sx={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: ON_GREEN }}>
          Your plan
        </Typography>
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <Box sx={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#7CE0A3' }} />
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#ffffff' }}>{subscription.status}</Typography>
        </Stack>
      </Stack>

      <Typography sx={{ mt: 1.5, fontSize: 20, fontWeight: 700, lineHeight: '26px', color: '#ffffff' }}>
        {isRecurring ? `${subscription.cadence} service` : 'On-demand service'}
      </Typography>

      {isRecurring ? (
        <>
          <Stack direction="row" alignItems="baseline" spacing={0.75} sx={{ mt: 1.5 }}>
            <Typography sx={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: '38px', color: '#ffffff' }}>
              {fmtMoney(subscription.pricePerCycle)}
            </Typography>
            <Typography sx={{ fontSize: 14, color: ON_GREEN }}>/ {subscription.cadenceNoun}</Typography>
          </Stack>
          {subscription.discountPercent > 0 ? (
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
              <Box sx={{ px: 1, py: '2px', borderRadius: '999px', backgroundColor: 'rgba(255, 255, 255, 0.16)', fontSize: 12, fontWeight: 600, color: '#ffffff' }}>
                Save {subscription.discountPercent}%
              </Box>
              <Typography sx={{ fontSize: 13, color: ON_GREEN_FAINT, textDecoration: 'line-through' }}>
                {fmtMoney(subscription.basePrice)}
              </Typography>
            </Stack>
          ) : null}
        </>
      ) : (
        <>
          <Stack direction="row" alignItems="baseline" spacing={0.75} sx={{ mt: 1.5 }}>
            <Typography sx={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: '38px', color: '#ffffff' }}>
              {fmtMoney(subscription.billedToDate)}
            </Typography>
            <Typography sx={{ fontSize: 14, color: ON_GREEN }}>billed to date</Typography>
          </Stack>
          <Box sx={{ mt: 1, px: 1, py: '2px', borderRadius: '999px', alignSelf: 'flex-start', backgroundColor: 'rgba(255, 255, 255, 0.16)', fontSize: 12, fontWeight: 600, color: '#ffffff' }}>
            Billed per service · no recurring charge
          </Box>
        </>
      )}

      <Box sx={{ flexGrow: 1, minHeight: 20 }} />

      {paymentMethod ? (
        <Stack direction="row" alignItems="center" spacing={1} sx={{ pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.14)' }}>
          <CreditCardOutlinedIcon sx={{ fontSize: 18, color: ON_GREEN }} />
          <Typography sx={{ fontSize: 13, color: '#ffffff', fontWeight: 500 }}>{paymentMethod}</Typography>
        </Stack>
      ) : null}
    </Box>
  );
}

/* Contract progress — shared footer for both variants. */
function ContractProgress({ subscription }) {
  const theme = useTheme();
  const { contractStart, contractEnd, contractProgress } = subscription;

  return (
    <Box sx={{ mt: 2.5, pt: 2.5, borderTop: `1px solid ${theme.palette.borderSubtle1}` }}>
      <Stack direction="row" alignItems="baseline" justifyContent="space-between" spacing={1} sx={{ mb: 1 }}>
        <Typography sx={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: theme.palette.textSecondary3 }}>
          Contract
        </Typography>
        <Typography sx={{ fontSize: 12, color: theme.palette.textSecondary3 }}>
          {Math.round(contractProgress * 100)}% elapsed
        </Typography>
      </Stack>
      <Box sx={{ height: 6, borderRadius: '999px', backgroundColor: theme.palette.surfaceGreySubtle, overflow: 'hidden' }}>
        <Box sx={{ width: `${contractProgress * 100}%`, height: '100%', backgroundColor: theme.palette.surfaceBrand, borderRadius: '999px' }} />
      </Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 0.75 }}>
        <Typography sx={{ fontSize: 12, color: theme.palette.textSecondary2 }}>{fmtLong(contractStart)}</Typography>
        <Typography sx={{ fontSize: 12, color: theme.palette.textSecondary2 }}>{fmtLong(contractEnd)}</Typography>
      </Stack>
    </Box>
  );
}

function RightHeader({ title, onManage }) {
  const theme = useTheme();
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{ mb: 2.5 }}>
      <Typography sx={{ fontSize: 16, fontWeight: 700, lineHeight: '20px', color: theme.palette.textPrimary }}>
        {title}
      </Typography>
      <Button variant="tertiaryGrey" size="small" onClick={onManage} sx={{ color: theme.palette.textBrand }}>
        Manage plan
      </Button>
    </Stack>
  );
}

/* ------------------------------------------------------------------ */
/* Recurring: the forward-looking payment schedule.                    */
/* ------------------------------------------------------------------ */
const NODE = 24;

function ScheduleTimeline({ schedule, paymentsMade, nextCharge }) {
  const theme = useTheme();
  const total = schedule.length;
  const paidFraction = total > 1 ? Math.max(0, paymentsMade - 1) / (total - 1) : paymentsMade ? 1 : 0;

  return (
    <Box sx={{ position: 'relative', mt: 1 }}>
      <Box sx={{ position: 'absolute', top: NODE / 2 - 1, left: NODE / 2, right: NODE / 2, height: 2, backgroundColor: theme.palette.borderSubtle2 }} />
      <Box sx={{ position: 'absolute', top: NODE / 2 - 1, left: NODE / 2, height: 2, width: `calc((100% - ${NODE}px) * ${paidFraction})`, backgroundColor: theme.palette.surfaceBrand }} />
      <Stack direction="row" justifyContent="space-between" sx={{ position: 'relative' }}>
        {schedule.map((entry) => {
          const isNext = nextCharge && entry.iso === nextCharge.iso;
          return (
            <Stack key={entry.iso} alignItems="center" spacing={0.75} sx={{ minWidth: 0 }}>
              <Box
                sx={{
                  width: NODE,
                  height: NODE,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: entry.paid ? theme.palette.surfaceBrand : theme.palette.surfaceWhite,
                  border: entry.paid ? 'none' : `2px solid ${isNext ? theme.palette.surfaceBrand : theme.palette.borderStrong1}`,
                  boxShadow: isNext ? `0 0 0 4px ${theme.palette.surfaceBrandSubtle}` : 'none',
                }}
              >
                {entry.paid ? (
                  <CheckRoundedIcon sx={{ fontSize: 15, color: '#ffffff' }} />
                ) : (
                  <Box sx={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: isNext ? theme.palette.surfaceBrand : theme.palette.borderStrong1 }} />
                )}
              </Box>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: isNext ? 600 : 500,
                  color: entry.paid ? theme.palette.textSecondary2 : isNext ? theme.palette.textPrimary : theme.palette.textSecondary3,
                }}
              >
                {fmtDay(entry.date)}
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
}

function BillingSchedule({ subscription, onManage }) {
  const theme = useTheme();
  const { schedule, paymentsMade, paymentsTotal, nextCharge } = subscription;

  return (
    <Box sx={{ flex: 1, minWidth: 0, pr: PAGE_GUTTER, pl: { xs: PAGE_GUTTER, md: '28px' }, py: '28px' }}>
      <RightHeader title="Billing schedule" onManage={onManage} />
      <ScheduleTimeline schedule={schedule} paymentsMade={paymentsMade} nextCharge={nextCharge} />
      <Typography sx={{ mt: 2, fontSize: 13, color: theme.palette.textSecondary2 }}>
        {nextCharge ? (
          <>
            Next payment{' '}
            <Box component="span" sx={{ fontWeight: 700, color: theme.palette.textPrimary }}>{fmtMoney(nextCharge.amount)}</Box>{' '}
            on{' '}
            <Box component="span" sx={{ fontWeight: 600, color: theme.palette.textPrimary }}>{fmtLong(nextCharge.date)}</Box>
          </>
        ) : (
          <Box component="span" sx={{ fontWeight: 600, color: theme.palette.textPrimary }}>All payments complete</Box>
        )}
        <Box component="span" sx={{ color: theme.palette.textSecondary3 }}>
          {'  ·  '}
          {paymentsMade} of {paymentsTotal} paid
        </Box>
      </Typography>
      <ContractProgress subscription={subscription} />
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Per-service: the backward-looking service activity.                 */
/* ------------------------------------------------------------------ */
function ServiceRow({ entry, isLast }) {
  const theme = useTheme();
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={{ py: 1, borderBottom: isLast ? 'none' : `1px solid ${theme.palette.borderSubtle1}` }}
    >
      <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: theme.palette.surfaceBrand, flexShrink: 0 }} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: theme.palette.textPrimary }}>
          {fmtLong(entry.date)}
        </Typography>
        <Typography sx={{ fontSize: 12, color: theme.palette.textSecondary3 }}>
          Filter replacement · {entry.filters} filters
        </Typography>
      </Box>
      <Typography sx={{ fontSize: 14, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: theme.palette.textPrimary, flexShrink: 0 }}>
        {fmtMoney(entry.amount)}
      </Typography>
    </Stack>
  );
}

function ServiceActivity({ subscription, onManage }) {
  const theme = useTheme();
  const { serviceHistory, servicesCount, billedToDate } = subscription;

  return (
    <Box sx={{ flex: 1, minWidth: 0, pr: PAGE_GUTTER, pl: { xs: PAGE_GUTTER, md: '28px' }, py: '28px' }}>
      <RightHeader title="Recent services" onManage={onManage} />
      {serviceHistory.length ? (
        <>
          <Stack>
            {serviceHistory.map((entry, index) => (
              <ServiceRow key={entry.iso} entry={entry} isLast={index === serviceHistory.length - 1} />
            ))}
          </Stack>
          <Typography sx={{ mt: 1.5, fontSize: 13, color: theme.palette.textSecondary2 }}>
            <Box component="span" sx={{ fontWeight: 700, color: theme.palette.textPrimary }}>{servicesCount}</Box> services
            {'  ·  '}
            <Box component="span" sx={{ fontWeight: 700, color: theme.palette.textPrimary }}>{fmtMoney(billedToDate)}</Box> billed this contract
          </Typography>
        </>
      ) : (
        <Typography sx={{ fontSize: 13, color: theme.palette.textSecondary3 }}>No services completed yet.</Typography>
      )}
      <ContractProgress subscription={subscription} />
    </Box>
  );
}

/**
 * The plan hero — a full-bleed band split into the plan's identity (deep-green
 * face) and its billing detail. Recurring contracts show a forward payment
 * schedule; per-service contracts show what's been done and billed. Everything
 * shown is contract data; nothing is invented.
 */
export function PlanCard({ subscription, paymentMethod, onManage }) {
  const theme = useTheme();
  const isRecurring = subscription.planType === 'recurring';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'stretch',
        borderBottom: `1px solid ${theme.palette.borderSubtle1}`,
      }}
    >
      <PlanFace subscription={subscription} paymentMethod={paymentMethod} />
      {isRecurring ? (
        <BillingSchedule subscription={subscription} onManage={onManage} />
      ) : (
        <ServiceActivity subscription={subscription} onManage={onManage} />
      )}
    </Box>
  );
}
