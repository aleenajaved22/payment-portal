import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PortalShell } from '../components/PortalShell';
import { SettingsFormRow } from '../components/settings/SettingsFormRow';
import { SettingsPasswordCard } from '../components/settings/SettingsPasswordCard';
import { SettingsPhotoField } from '../components/settings/SettingsPhotoField';
import { settingsDisabledFieldSx, settingsFieldInputSx } from '../components/settings/settingsFieldStyles';
import { Button, TextField } from '../components/design-system';
import { useAuth } from '../auth/AuthContext';

const AVATAR_DEFAULT =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&crop=face';

const SETTINGS_CONTENT_MAX_WIDTH = 952;

function splitDisplayName(fullName) {
  const parts = String(fullName || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return { firstName: '', lastName: '' };
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

export function SettingsPage() {
  const theme = useTheme();
  const navigate = useNavigate();
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
  const [hasCustomPhoto, setHasCustomPhoto] = useState(false);

  const fieldSx = settingsFieldInputSx(theme);

  const handlePhotoSelect = (file) => {
    if (!file?.type.startsWith('image/')) return;
    if (avatarObjectUrlRef.current) URL.revokeObjectURL(avatarObjectUrlRef.current);
    const url = URL.createObjectURL(file);
    avatarObjectUrlRef.current = url;
    setAvatarSrc(url);
    setHasCustomPhoto(true);
  };

  const handlePhotoDelete = () => {
    if (avatarObjectUrlRef.current) {
      URL.revokeObjectURL(avatarObjectUrlRef.current);
      avatarObjectUrlRef.current = null;
    }
    setAvatarSrc(AVATAR_DEFAULT);
    setHasCustomPhoto(false);
  };

  const handleCancel = () => {
    setFirstName(derived.firstName);
    setLastName(derived.lastName);
    navigate(-1);
  };

  const handleUpdate = () => {
    const name = [firstName, lastName].map((part) => part.trim()).filter(Boolean).join(' ');
    if (name) updateSessionProfile({ name });
  };

  return (
    <PortalShell activeNav={false} mainSx={{ pb: 0 }}>
      <Box sx={{ width: '100%', maxWidth: SETTINGS_CONTENT_MAX_WIDTH, mx: 'auto', pb: 10 }}>
        <Stack spacing={3}>
          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 700, lineHeight: '24px', color: theme.palette.textPrimary }}>
              Personal info
            </Typography>
            <Typography sx={{ fontSize: 14, lineHeight: '20px', color: theme.palette.textSecondary3, mt: 0.5 }}>
              Update your photo and personal details here.
            </Typography>
          </Box>

          <Stack spacing={2.5}>
            <SettingsFormRow label="Your photo">
              <SettingsPhotoField
                avatarSrc={avatarSrc}
                hasCustomPhoto={hasCustomPhoto}
                onSelectFile={handlePhotoSelect}
                onDeletePhoto={handlePhotoDelete}
              />
            </SettingsFormRow>

            <SettingsFormRow label="Name">
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                <TextField
                  fullWidth
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  sx={fieldSx}
                />
                <TextField
                  fullWidth
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  sx={fieldSx}
                />
              </Stack>
            </SettingsFormRow>

            <SettingsFormRow label="Email address">
              <TextField fullWidth value={email} disabled sx={settingsDisabledFieldSx(theme)} />
            </SettingsFormRow>

            <SettingsFormRow label="Phone">
              <TextField fullWidth value={phone} onChange={(e) => setPhone(e.target.value)} sx={fieldSx} />
            </SettingsFormRow>

            <SettingsPasswordCard onUpdatePassword={() => {}} />
          </Stack>
        </Stack>
      </Box>

      <Box
        component="footer"
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: theme.zIndex.appBar - 1,
          px: '32px',
          boxSizing: 'border-box',
          pointerEvents: 'none',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: SETTINGS_CONTENT_MAX_WIDTH,
            mx: 'auto',
            pt: 2,
            pb: 2,
            backgroundColor: theme.palette.surfaceWhite,
            borderTop: `1px solid ${theme.palette.borderSubtle1}`,
            pointerEvents: 'auto',
          }}
        >
          <Stack direction="row" spacing={1.5} justifyContent="flex-end">
            <Button variant="secondaryGrey" onClick={handleCancel} sx={{ height: 36, px: 2 }}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdate} sx={{ height: 36, px: 2 }}>
              Update
            </Button>
          </Stack>
        </Box>
      </Box>
    </PortalShell>
  );
}
