import Box from '@mui/material/Box';
import Grow from '@mui/material/Grow';
import Slide from '@mui/material/Slide';
import Snackbar from '@mui/material/Snackbar';
import useMediaQuery from '@mui/material/useMediaQuery';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { Button } from './design-system';

/**
 * What the page says after the dialog has gone.
 *
 * The success screen inside checkout is read and dismissed; this is the trace it
 * leaves on the page behind it, so the customer can look back a moment later and
 * confirm what happened without reopening anything. It also bridges the two
 * screens: paying from the dashboard settles invoices that live on the Payments
 * page, and the link is how you go and see them.
 *
 * Bottom-left rather than centre: the dashboard's own actions sit top-right, and
 * a confirmation should not cover the totals it just changed.
 */
export function PaymentConfirmationToast({ open, amountLabel, invoiceCount, onClose, onViewInvoices }) {
  const theme = useTheme();
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  return (
    <Snackbar
      open={open}
      onClose={(_event, reason) => {
        // Clicking the page shouldn't dismiss it — the customer is likely
        // clicking the very rows this is describing.
        if (reason === 'clickaway') return;
        onClose();
      }}
      /* No auto-hide: the toast carries an action, and a control that times out
         while focus is still elsewhere on the page is unreachable by keyboard
         within the window it exists (WCAG 2.2.1). It closes when dismissed, when
         its link is followed, or when the next payment starts. */
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      TransitionComponent={reducedMotion ? Grow : Slide}
      TransitionProps={reducedMotion ? { timeout: 0 } : { direction: 'up' }}
      sx={{ maxWidth: 420 }}
    >
      <Stack
        direction="row"
        alignItems="flex-start"
        spacing={1.5}
        sx={{
          px: 2,
          py: 1.75,
          borderRadius: '12px',
          border: `1px solid ${theme.palette.borderSubtle1}`,
          backgroundColor: theme.palette.surfaceWhite,
          boxShadow: '0px 12px 24px -6px rgba(16, 24, 40, 0.16), 0px 4px 8px -2px rgba(16, 24, 40, 0.06)',
        }}
      >
        <Box sx={{ flexShrink: 0, mt: '1px', color: theme.palette.primary.main }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 22 }} />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: theme.palette.textPrimary }}>
            {amountLabel} paid
          </Typography>
          {/* Said "paid" twice across two lines; the second line now spends
              itself on where to look instead of restating the first. */}
          <Typography sx={{ mt: '2px', fontSize: 13, color: theme.palette.textSecondary2 }}>
            {invoiceCount === 1 ? '1 invoice is' : `${invoiceCount} invoices are`} settled. You'll find
            {invoiceCount === 1 ? ' it' : ' them'} under Payments.
          </Typography>
          {onViewInvoices ? (
            <Button
              variant="onlyText"
              onClick={() => {
                onClose();
                onViewInvoices();
              }}
              sx={{ mt: 0.5, px: 0, minWidth: 'auto', fontSize: 14, color: theme.palette.textBrandOnSubtle }}
            >
              View invoices
            </Button>
          ) : null}
        </Box>

        <IconButton
          onClick={onClose}
          aria-label="Dismiss"
          size="small"
          sx={{
            flexShrink: 0,
            mt: -1,
            mr: -1.25,
            // 40px hit area around an 18px glyph — the visual weight stays small
            // while the target stops being a 28px pinprick on a touch screen.
            width: 40,
            height: 40,
            color: theme.palette.textSecondary2,
          }}
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Stack>
    </Snackbar>
  );
}
