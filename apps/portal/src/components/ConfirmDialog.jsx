import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Button, Dialog } from './design-system';

/**
 * The portal's one confirmation dialog.
 *
 * Destructive actions — removing a saved card, revoking a teammate — used to
 * fire on the first click with nothing in between. This is the pause, and it is
 * deliberately small: an icon that carries the tone, a title that names the
 * specific thing rather than "Are you sure?", the consequence in one line, and
 * the two ways out.
 *
 * The confirm button repeats the verb ("Remove card", not "Confirm"), so the
 * commitment is legible from the button alone — the place a hurried reader
 * actually looks.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  consequence,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'danger',
  icon,
  onConfirm,
  onClose,
}) {
  const theme = useTheme();
  const isDanger = tone === 'danger';

  const accent = isDanger
    ? { fg: theme.palette.textAlert, bg: theme.palette.surfaceAlertSubtle }
    : { fg: theme.palette.textBrand, bg: theme.palette.surfaceBrandSubtle };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { borderRadius: '16px', p: 3, width: '100%', maxWidth: 420 } }}
    >
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Box
          aria-hidden
          sx={{
            flexShrink: 0,
            width: 40,
            height: 40,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: accent.fg,
            backgroundColor: accent.bg,
          }}
        >
          {icon ?? (isDanger ? <DeleteOutlineIcon sx={{ fontSize: 20 }} /> : <ErrorOutlineIcon sx={{ fontSize: 20 }} />)}
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 700, lineHeight: '24px', color: theme.palette.textPrimary }}>
            {title}
          </Typography>
          {description ? (
            <Typography sx={{ mt: 0.5, fontSize: 14, lineHeight: '20px', color: theme.palette.textSecondary2 }}>
              {description}
            </Typography>
          ) : null}
          {/* The knock-on effect, when there is one — e.g. which card takes over
              as default. Tinted so it reads as a consequence, not more prose. */}
          {consequence ? (
            <Typography
              sx={{
                mt: 1.5,
                px: 1.25,
                py: 1,
                borderRadius: '8px',
                fontSize: 13,
                lineHeight: '18px',
                color: theme.palette.textSecondary2,
                backgroundColor: theme.palette.surfaceGreySubtle,
              }}
            >
              {consequence}
            </Typography>
          ) : null}
        </Box>
      </Stack>

      <Stack direction="row" spacing={1.25} justifyContent="flex-end" sx={{ mt: 3 }}>
        <Button variant="secondaryGrey" onClick={onClose}>
          {cancelLabel}
        </Button>
        <Button
          variant="primary"
          onClick={onConfirm}
          sx={
            isDanger
              ? {
                  backgroundColor: theme.palette.textAlert,
                  '&:hover': { backgroundColor: '#9A1D14' },
                }
              : undefined
          }
        >
          {confirmLabel}
        </Button>
      </Stack>
    </Dialog>
  );
}
