import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';

export const SETTINGS_NAV_ITEMS = [
  { value: 'profile', label: 'Profile Settings', path: '/settings', Icon: PersonOutlinedIcon },
  { value: 'payment-methods', label: 'Payment Methods', path: '/settings/payment-methods', Icon: CreditCardOutlinedIcon },
];

const NAV_WIDTH = 220;

function NavItem({ item, selected, onSelect }) {
  const theme = useTheme();
  const Icon = item.Icon;

  return (
    <Box
      component="button"
      type="button"
      onClick={() => onSelect(item.path)}
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        border: 0,
        borderRadius: '8px',
        px: 1.75,
        py: 1,
        minHeight: 40,
        cursor: 'pointer',
        textAlign: 'left',
        font: 'inherit',
        backgroundColor: selected ? theme.palette.surfaceBrandSubtle : 'transparent',
        color: selected ? theme.palette.textBrand : theme.palette.textSecondary2,
        '&:hover': {
          backgroundColor: selected ? theme.palette.surfaceBrandSubtle : theme.palette.surfaceGreySubtle,
        },
      }}
    >
      <Icon sx={{ fontSize: 20, flexShrink: 0 }} />
      <Typography sx={{ fontSize: 14, fontWeight: 500, lineHeight: '20px' }}>{item.label}</Typography>
    </Box>
  );
}

export function SettingsSideNav({ activeValue, onSelect }) {
  return (
    <Box
      component="nav"
      aria-label="Settings sections"
      sx={{
        width: { xs: '100%', md: NAV_WIDTH },
        flexShrink: 0,
      }}
    >
      <Stack spacing={0.5} sx={{ width: '100%' }}>
        {SETTINGS_NAV_ITEMS.map((item) => (
          <NavItem key={item.value} item={item} selected={activeValue === item.value} onSelect={onSelect} />
        ))}
      </Stack>
    </Box>
  );
}
