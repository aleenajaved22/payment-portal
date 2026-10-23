import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PortalShell } from '../components/PortalShell';
import { PaymentMethodsPanel } from '../components/settings/PaymentMethodsPanel';
import { SettingsProfilePanel } from '../components/settings/SettingsProfilePanel';
import { SETTINGS_NAV_ITEMS, SettingsSideNav } from '../components/settings/SettingsSideNav';
import { useAuth } from '../auth/AuthContext';

const AVATAR_DEFAULT =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&crop=face';

const SETTINGS_LAYOUT_MAX_WIDTH = 1104;

function splitDisplayName(fullName) {
  const parts = String(fullName || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return { firstName: '', lastName: '' };
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

function settingsTabFromPath(pathname) {
  return pathname.startsWith('/settings/payment-methods')
    ? SETTINGS_NAV_ITEMS[1].value
    : SETTINGS_NAV_ITEMS[0].value;
}

export function SettingsPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = settingsTabFromPath(location.pathname);
  const isProfileTab = activeTab === SETTINGS_NAV_ITEMS[0].value;

  const { session, updateSessionProfile } = useAuth();
  const avatarObjectUrlRef = useRef(null);
  const derived = useMemo(() => splitDisplayName(session?.name), [session?.name]);

  const [firstName, setFirstName] = useState(derived.firstName);
  const [lastName, setLastName] = useState(derived.lastName);

  useEffect(() => {
    setFirstName(derived.firstName);
    setLastName(derived.lastName);
  }, [derived.firstName, derived.lastName]);
  const [email] = useState(session?.email ?? '');
  const [phone, setPhone] = useState('123 456 7899');
  const [avatarSrc, setAvatarSrc] = useState(AVATAR_DEFAULT);

  const handlePhotoSelect = (file) => {
    if (!file?.type.startsWith('image/')) return;
    if (avatarObjectUrlRef.current) URL.revokeObjectURL(avatarObjectUrlRef.current);
    const url = URL.createObjectURL(file);
    avatarObjectUrlRef.current = url;
    setAvatarSrc(url);
  };

  const handleSave = () => {
    const name = [firstName, lastName].map((part) => part.trim()).filter(Boolean).join(' ');
    if (name) updateSessionProfile({ name });
  };

  return (
    <PortalShell activeNav={false} mainSx={{ pb: 4, backgroundColor: theme.palette.surfaceWhite }}>
      <Box sx={{ width: '100%', maxWidth: SETTINGS_LAYOUT_MAX_WIDTH, mx: 'auto' }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 2.5, md: 4 }}
          alignItems={{ xs: 'stretch', md: 'flex-start' }}
        >
          <SettingsSideNav activeValue={activeTab} onSelect={(path) => navigate(path)} />

          <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
            {isProfileTab ? (
              <SettingsProfilePanel
                firstName={firstName}
                lastName={lastName}
                onFirstNameChange={setFirstName}
                onLastNameChange={setLastName}
                email={email}
                phone={phone}
                onPhoneChange={setPhone}
                avatarSrc={avatarSrc}
                onSelectPhoto={handlePhotoSelect}
                onSave={handleSave}
              />
            ) : (
              <PaymentMethodsPanel />
            )}
          </Box>
        </Stack>
      </Box>
    </PortalShell>
  );
}
