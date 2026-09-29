import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { keyframes, useTheme } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Button } from './design-system';

/**
 * Ease-out, no overshoot. The previous curve bounced past 1.0 to 1.06, which is
 * the wrong register twice over: the house language is restrained, and the same
 * keyframe also plays on the declined state, where a spring animates the news
 * that someone's card was refused.
 */
const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';

/** Everything in this file is decoration; none of it survives this query. */
const REDUCED_MOTION = '@media (prefers-reduced-motion: reduce)';

const popIn = keyframes`
  0% { transform: scale(0.94); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
`;

const ringPulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(45, 165, 81, 0.5); }
  70% { box-shadow: 0 0 0 18px rgba(45, 165, 81, 0); }
  100% { box-shadow: 0 0 0 0 rgba(45, 165, 81, 0); }
`;

const checkDraw = keyframes`
  0% { transform: scale(0.7); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
`;

export function PaymentMethodModalProcessing({ message = 'Processing payment…' }) {
  const theme = useTheme();

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={2}
      sx={{ flex: 1, minHeight: 360, py: 4 }}
    >
      <CircularProgress size={36} sx={{ color: theme.palette.primary.main }} />
      <Typography
        component="h2"
        id="checkout-title"
        sx={{ fontSize: 16, fontWeight: 700, color: theme.palette.textPrimary }}
      >
        {message}
      </Typography>
      <Typography sx={{ fontSize: 14, color: theme.palette.textSecondary2, textAlign: 'center', maxWidth: 280 }}>
        Securing your payment. Please wait a moment.
      </Typography>
    </Stack>
  );
}

export function PaymentMethodModalSuccess({
  amountLabel,
  invoiceCount = 0,
  methodLabel,
  savedAsDefault = false,
  onDone,
}) {
  const theme = useTheme();

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={2}
      sx={{ flex: 1, minHeight: 360, py: 4, px: 2, textAlign: 'center' }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.palette.surfaceSuccessSubtle,
          animation: `${popIn} 0.34s ${EASE_OUT}, ${ringPulse} 1.4s ${EASE_OUT} 0.15s`,
          [REDUCED_MOTION]: { animation: 'none' },
        }}
      >
        <CheckIcon
          sx={{
            fontSize: 44,
            color: theme.palette.primary.main,
            animation: `${checkDraw} 0.3s ${EASE_OUT} 0.2s both`,
            [REDUCED_MOTION]: { animation: 'none' },
          }}
        />
      </Box>
      <Typography
        component="h2"
        id="checkout-title"
        sx={{ fontSize: 22, fontWeight: 700, lineHeight: '30px', color: theme.palette.textPrimary }}
      >
        Payment successful
      </Typography>

      {/* The amount carried at display size.
          This is the peak of the flow, and it used to be stated in 14px body
          text beside a receipt whose own subtotal was larger — the confirmation
          was the least substantial thing on the screen it exists for. */}
      {amountLabel ? (
        <Typography
          sx={{
            fontSize: 38,
            fontWeight: 700,
            lineHeight: '46px',
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
            color: theme.palette.textPrimary,
          }}
        >
          {amountLabel}
        </Typography>
      ) : null}

      {/* What it cleared and what it was charged to — the two things a customer
          would otherwise reopen the receipt to check. */}
      <Typography sx={{ fontSize: 14, color: theme.palette.textSecondary2, maxWidth: 360 }}>
        {invoiceCount > 0
          ? `Paid across ${invoiceCount === 1 ? '1 invoice' : `${invoiceCount} invoices`}`
          : 'Payment processed'}
        {methodLabel ? ` with ${methodLabel}` : ''}. A receipt is on its way to your email.
      </Typography>

      {savedAsDefault ? (
        <Typography sx={{ fontSize: 13, color: theme.palette.textSecondary2, maxWidth: 360 }}>
          Saved to your account as the default payment method.
        </Typography>
      ) : null}

      {onDone ? (
        /* Same height as the Pay button it replaces — the flow's last control
           should not be visibly smaller than its first. */
        <Button variant="primary" onClick={onDone} sx={{ mt: 1.5, minHeight: 44, px: 4, fontSize: 15 }}>
          Done
        </Button>
      ) : null}
    </Stack>
  );
}

/**
 * A decline is not an error page.
 *
 * Nothing went wrong with the portal, and nothing was charged — the issuer said
 * no. So this state states the reason in the issuer's terms, says plainly that
 * no money moved, and puts the two ways forward side by side: try the same
 * method again (issuers do approve on a second attempt), or go back and choose
 * another. The amount stays on the receipt beside it, unchanged, so the customer
 * can see the charge is still outstanding rather than in limbo.
 */
export function PaymentMethodModalDeclined({ failure, onRetry, onChooseAnother }) {
  const theme = useTheme();

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={1.5}
      sx={{ flex: 1, minHeight: 360, py: 4, px: 2, textAlign: 'center' }}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.palette.surfaceAlertSubtle,
          animation: `${popIn} 0.3s ${EASE_OUT}`,
          [REDUCED_MOTION]: { animation: 'none' },
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 38, color: theme.palette.textAlert }} />
      </Box>

      {/* Same step as the success heading: two sibling outcomes in the same slot
          had no reason to be 22 and 20. */}
      <Typography
        component="h2"
        id="checkout-title"
        sx={{ fontSize: 22, fontWeight: 700, lineHeight: '30px', color: theme.palette.textPrimary }}
      >
        {failure?.title ?? "We couldn't process that payment"}
      </Typography>
      <Typography sx={{ fontSize: 14, color: theme.palette.textSecondary2, maxWidth: 340 }}>
        {failure?.detail}
      </Typography>
      {/* The single most reassuring sentence in the flow; it was also the least
          legible thing on the screen. */}
      <Typography sx={{ fontSize: 14, fontWeight: 500, color: theme.palette.textSecondary2 }}>
        You have not been charged.
      </Typography>

      <Stack direction="row" spacing={1.25} sx={{ pt: 1.5 }}>
        <Button variant="secondaryGrey" onClick={onChooseAnother} sx={{ minHeight: 44, px: 3 }}>
          Use another method
        </Button>
        <Button variant="primary" onClick={onRetry} sx={{ minHeight: 44, px: 3 }}>
          Try again
        </Button>
      </Stack>
    </Stack>
  );
}
