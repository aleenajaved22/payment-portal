import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { primitive } from '@signal/design-tokens/colors';
import { Button, Dialog } from './design-system';

/**
 * Shown when someone turns off a teammate's access toggle — matches the CBX
 * "Inactivate User" modal: warning icon, explicit consequence, blue confirm.
 */
export function InactivateUserDialog({ open, userName, onClose, onConfirm }) {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          p: 3,
          width: '100%',
          maxWidth: 503,
          boxShadow:
            '0px 20px 24px -4px rgba(16, 24, 40, 0.1), 0px 8px 8px -4px rgba(16, 24, 40, 0.04)',
        },
      }}
    >
      <Stack spacing={3} alignItems="stretch">
        <Stack spacing={2.5}>
          <Box
            aria-hidden
            sx={{
              width: 48,
              height: 48,
              borderRadius: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.palette.surfaceWarningSubtle,
              border: `8px solid ${primitive.orange[50]}`,
              boxSizing: 'border-box',
            }}
          >
            <WarningAmberOutlinedIcon sx={{ fontSize: 24, color: primitive.orange[700] }} />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: 700,
                lineHeight: '28px',
                color: theme.palette.textPrimary,
              }}
            >
              Inactivate User
            </Typography>
            <Typography
              sx={{
                mt: 0.5,
                fontSize: 14,
                fontWeight: 400,
                lineHeight: '20px',
                color: theme.palette.textPlaceholder,
              }}
            >
              {userName
                ? `Are you sure you want to inactivate ${userName}? Inactivating this user will remove their access to the customer portal.`
                : 'Are you sure you want to inactivate this user? Inactivating this user will remove their access to the customer portal.'}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1.5} justifyContent="flex-end">
          <Button variant="secondaryGrey" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            sx={{
              backgroundColor: primitive.blue[500],
              borderColor: primitive.blue[500],
              '&:hover': {
                backgroundColor: primitive.blue[700],
                borderColor: primitive.blue[700],
              },
            }}
          >
            Inactivate User
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}
