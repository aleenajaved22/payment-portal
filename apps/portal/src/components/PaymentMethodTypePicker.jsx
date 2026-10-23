import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { PAYMENT_METHOD_LOGO_SIZE, PaymentMethodLogoIcon } from './payment-method-logos';

export function PaymentMethodTypePicker({ methods, selectedId, onSelect, sx }) {
  const theme = useTheme();
  const accentColor = theme.palette.primary.main;
  const mutedColor = theme.palette.textSecondary3;

  return (
    <Stack
      direction="row"
      spacing={1.25}
      flexWrap="wrap"
      sx={{ mb: 2, width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start', ...sx }}
    >
      {methods.map(({ id, label, Logo, preserveLogoColor, listLogoSize }) => {
        const isSelected = selectedId === id;
        const muteLogo = !isSelected && !preserveLogoColor;
        const iconSize = listLogoSize ?? PAYMENT_METHOD_LOGO_SIZE;

        return (
          <Box
            key={id}
            component="button"
            type="button"
            onClick={() => onSelect(id)}
            sx={{
              flex: '1 1 0',
              minWidth: { xs: 'calc(50% - 5px)', sm: 148 },
              maxWidth: '100%',
              height: 48,
              m: 0,
              px: 1.5,
              py: 1,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: 1,
              boxSizing: 'border-box',
              border: `1px solid ${isSelected ? accentColor : theme.palette.borderSubtle1}`,
              borderRadius: '12px',
              backgroundColor: theme.palette.surfaceWhite,
              cursor: 'pointer',
              textAlign: 'left',
              font: 'inherit',
              transition: 'border-color 0.15s ease, color 0.15s ease',
              '&:hover': {
                borderColor: isSelected ? accentColor : theme.palette.borderSubtle2,
              },
            }}
          >
            <Box
              sx={{
                flexShrink: 0,
                width: iconSize,
                height: iconSize,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isSelected ? accentColor : mutedColor,
                filter: muteLogo ? 'grayscale(1)' : 'none',
                opacity: isSelected ? 1 : muteLogo ? 0.7 : 1,
              }}
            >
              <PaymentMethodLogoIcon Logo={Logo} size={iconSize} />
            </Box>
            <Typography
              noWrap
              sx={{
                fontSize: 14,
                fontWeight: isSelected ? 600 : 500,
                lineHeight: '18px',
                color: isSelected ? accentColor : mutedColor,
                flex: 1,
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {label}
            </Typography>
          </Box>
        );
      })}
    </Stack>
  );
}
