import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { SignalLogo } from './SignalLogo';
import { UserAccountMenu } from './UserAccountMenu';
import { Tab, Tabs } from './design-system';

const NAV_ITEMS = [
  { label: 'Dashboard', value: 'dashboard', path: '/dashboard' },
  { label: 'Reports', value: 'reports', path: '/reports' },
  { label: 'Payments', value: 'invoice-payment', path: '/invoice-payment' },
];

export function PortalShell({ activeNav = 'reports', banner, mainSx, children }) {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', m: 0, backgroundColor: theme.palette.surfaceWhite }}>
      <Box
        component="header"
        sx={{
          backgroundColor: theme.palette.surfaceWhite,
          px: '32px',
          py: '20px',
          borderBottom: `1px solid ${theme.palette.borderSubtle1}`,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: '100%', position: 'relative' }}
        >
          <Box sx={{ zIndex: 1 }}>
            <SignalLogo width={86} height={24} />
          </Box>

          <Box
            sx={{
              position: { xs: 'static', md: 'absolute' },
              left: { md: '50%' },
              transform: { md: 'translateX(-50%)' },
              mt: { xs: 1, md: 0 },
            }}
          >
            <Tabs
              value={activeNav}
              onChange={(_, value) => {
                const item = NAV_ITEMS.find((nav) => nav.value === value);
                if (item) navigate(item.path);
              }}
              sx={{
                minHeight: 34,
                '& .MuiTabs-flexContainer': { gap: 0.5 },
                '& .MuiTabs-indicator': { display: 'none' },
                '& .MuiTab-root': {
                  minHeight: 34,
                  px: 1.75,
                  py: 0.5,
                  minWidth: 'auto',
                  textTransform: 'none',
                  fontSize: 14,
                  fontWeight: 500,
                  color: theme.palette.textSecondary2,
                  borderRadius: '8px',
                },
                '& .Mui-selected': {
                  color: `${theme.palette.textBrand} !important`,
                  backgroundColor: theme.palette.surfaceBrandSubtle,
                },
              }}
            >
              {NAV_ITEMS.map((item) => (
                <Tab key={item.value} label={item.label} value={item.value} disableRipple />
              ))}
            </Tabs>
          </Box>

          <UserAccountMenu />
        </Stack>
      </Box>

      {banner}

      <Box
        component="main"
        sx={{
          width: '100%',
          px: '32px',
          pt: banner ? 0 : 3,
          pb: 2,
          m: 0,
          backgroundColor: theme.palette.surfaceWhite,
          ...mainSx,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
