import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const AVATAR_SRC =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=face';

function MenuRow({ icon, label, onClick, trailing, showChevron = true, labelColor }) {
  const theme = useTheme();

  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        border: 0,
        background: 'none',
        cursor: onClick ? 'pointer' : 'default',
        p: 0,
        textAlign: 'left',
        font: 'inherit',
      }}
    >
      <Box sx={{ color: theme.palette.textSecondary2, display: 'flex', width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </Box>
      <Typography
        sx={{
          flex: 1,
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: '0.25px',
          color: labelColor ?? theme.palette.textSecondary2,
        }}
      >
        {label}
      </Typography>
      {trailing}
      {showChevron ? (
        <ChevronRightIcon sx={{ fontSize: 20, color: theme.palette.textSecondary3, flexShrink: 0 }} />
      ) : null}
    </Box>
  );
}

export function UserAccountMenu() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { session, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const displayName = session?.name || 'User';
  const roleLabel = 'Admin';

  const close = () => setAnchorEl(null);

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ zIndex: 1, cursor: 'pointer' }}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar sx={{ width: 32, height: 32 }} alt={displayName} src={AVATAR_SRC} />
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Stack direction="row" alignItems="center" spacing={0.25}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.textPrimary, lineHeight: 1.2 }}>
              {displayName}
            </Typography>
            <KeyboardArrowDownIcon sx={{ color: theme.palette.textSecondary2, fontSize: 18 }} />
          </Stack>
          <Typography variant="caption" sx={{ color: theme.palette.textSecondary3, display: 'block', mt: -0.25 }}>
            Admin
          </Typography>
        </Box>
      </Stack>

      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              mt: 0,
              width: 309,
              maxWidth: 'calc(100vw - 24px)',
              borderRadius: '8px',
              border: `1px solid ${theme.palette.borderSubtle1}`,
              boxShadow:
                '0px 12px 16px -4px rgba(16, 24, 40, 0.1), 0px 4px 6px -2px rgba(16, 24, 40, 0.05)',
              overflow: 'hidden',
            },
          },
          list: {
            sx: { p: 0 },
          },
        }}
      >
        <Box
          sx={{
            backgroundColor: theme.palette.surfaceBrandSubtle ?? '#E5F6FF',
            px: 2,
            py: 1,
            borderBottom: `1px solid ${theme.palette.borderSubtle1}`,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar sx={{ width: 48, height: 48 }} alt={displayName} src={AVATAR_SRC} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 500, letterSpacing: '0.25px', color: theme.palette.textSecondary2 }}>
                {displayName}
              </Typography>
              <Typography sx={{ fontSize: 12, color: '#86868B', lineHeight: 1.4 }}>{roleLabel}</Typography>
            </Box>
            <UnfoldMoreIcon sx={{ fontSize: 18, color: theme.palette.primary.main, flexShrink: 0 }} />
          </Stack>
        </Box>

        <Stack spacing={2.25} sx={{ px: '14px', py: 2 }}>
          <Stack sx={{ gap: '4px' }}>
            <MenuRow
              icon={<CreditCardOutlinedIcon sx={{ fontSize: 20 }} />}
              label="Card Management"
              onClick={() => {
                close();
                navigate('/payment-methods');
              }}
            />
            <Divider sx={{ borderColor: theme.palette.borderSubtle1 }} />
            <MenuRow
              icon={<PersonOutlinedIcon sx={{ fontSize: 20 }} />}
              label="User Management"
              onClick={() => {
                close();
                navigate('/users');
              }}
            />
          </Stack>

          <Divider sx={{ borderColor: theme.palette.borderSubtle1 }} />

          <MenuRow
            icon={<LogoutOutlinedIcon sx={{ fontSize: 20, color: '#B32318' }} />}
            label="Logout"
            labelColor="#B32318"
            showChevron={false}
            onClick={() => {
              close();
              logout();
              navigate('/login');
            }}
          />
        </Stack>
      </Menu>
    </>
  );
}
