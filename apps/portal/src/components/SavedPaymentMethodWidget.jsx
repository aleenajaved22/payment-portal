import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import { useNavigate } from 'react-router-dom';
import { getPaymentMethodType } from '../data/paymentMethodCategories';
import { PAYMENT_METHOD_TYPES } from './payment-method-logos';
import { Button } from './design-system';

export function SavedPaymentMethodWidget({ paymentMethod, onAddPaymentMethod }) {
  const theme = useTheme();
  const navigate = useNavigate();

  if (!paymentMethod) {
    return (
      <Box
        sx={{
          border: `1px dashed ${theme.palette.borderSubtle2}`,
          borderRadius: '12px',
          px: 2.5,
          py: 2,
          backgroundColor: theme.palette.surfaceGreySubtle,
        }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" spacing={2}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.palette.surfaceWhite,
                border: `1px solid ${theme.palette.borderSubtle1}`,
              }}
            >
              <CreditCardOutlinedIcon sx={{ color: theme.palette.textSecondary2 }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>No payment method on file</Typography>
              <Typography sx={{ fontSize: 13, color: theme.palette.textSecondary3 }}>
                Add a card or wallet to pay invoices faster.
              </Typography>
            </Box>
          </Stack>
          <Button variant="secondaryGrey" onClick={onAddPaymentMethod} sx={{ minWidth: 160 }}>
            Add payment method
          </Button>
        </Stack>
      </Box>
    );
  }

  const type = getPaymentMethodType(paymentMethod.typeId, PAYMENT_METHOD_TYPES);
  const Logo = type?.Logo;

  return (
    <Box
      sx={{
        position: 'relative',
        border: `1px solid ${theme.palette.borderSubtle1}`,
        borderRadius: '12px',
        px: 2.5,
        py: 2,
        backgroundColor: theme.palette.surfaceWhite,
        transition: 'box-shadow 0.2s, border-color 0.2s',
        '&:hover': {
          borderColor: theme.palette.borderSubtle2,
          boxShadow: '0 4px 12px rgba(16, 24, 40, 0.08)',
          '& .change-card-btn': { opacity: 1, pointerEvents: 'auto' },
        },
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box sx={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {Logo ? <Logo /> : null}
          </Box>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 500, color: theme.palette.textSecondary3, mb: 0.25 }}>
              Payment method for invoices
            </Typography>
            <Typography sx={{ fontSize: 15, fontWeight: 600 }}>{paymentMethod.label}</Typography>
            <Typography sx={{ fontSize: 13, color: theme.palette.textSecondary2 }}>{paymentMethod.subtitle}</Typography>
          </Box>
        </Stack>
        <Button
          className="change-card-btn"
          variant="tertiaryGrey"
          onClick={() => navigate('/settings/payment-methods')}
          sx={{
            minWidth: 120,
            opacity: { xs: 1, sm: 0 },
            pointerEvents: { xs: 'auto', sm: 'none' },
            transition: 'opacity 0.2s',
          }}
        >
          Change card
        </Button>
      </Stack>
    </Box>
  );
}
