import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { Button, TextField } from '../design-system';
import { SettingsLabeledField } from './SettingsLabeledField';
import { SettingsPasswordCard } from './SettingsPasswordCard';
import { SettingsPhotoField } from './SettingsPhotoField';
import { settingsDisabledFieldSx, settingsFieldInputSx } from './settingsFieldStyles';

const ROLE_LABEL = 'Admin';

export function SettingsProfilePanel({
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
  email,
  phone,
  onPhoneChange,
  avatarSrc,
  onSelectPhoto,
  onSave,
}) {
  const theme = useTheme();
  const fieldSx = settingsFieldInputSx(theme);
  const displayName = [firstName, lastName].map((part) => part.trim()).filter(Boolean).join(' ') || 'User';

  return (
    <Stack spacing={0} divider={<Divider sx={{ borderColor: theme.palette.borderSubtle1, my: 3 }} />}>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', sm: 'flex-start' }}
          justifyContent="space-between"
        >
          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 700, lineHeight: '24px', color: theme.palette.textPrimary }}>
              Profile information
            </Typography>
            <Typography sx={{ fontSize: 14, lineHeight: '20px', color: theme.palette.textSecondary3, mt: 0.5 }}>
              Update your personal details and photo.
            </Typography>
          </Box>
          <Button variant="primary" onClick={onSave} sx={{ height: 36, px: 2, flexShrink: 0 }}>
            Save changes
          </Button>
        </Stack>

        <SettingsPhotoField
          avatarSrc={avatarSrc}
          displayName={displayName}
          roleLabel={ROLE_LABEL}
          onSelectFile={onSelectPhoto}
        />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2.5,
            width: '100%',
          }}
        >
          <SettingsLabeledField label="Name">
            <TextField
              fullWidth
              value={firstName}
              onChange={(e) => onFirstNameChange(e.target.value)}
              placeholder="First name"
              sx={fieldSx}
            />
          </SettingsLabeledField>
          <SettingsLabeledField label="Last Name">
            <TextField
              fullWidth
              value={lastName}
              onChange={(e) => onLastNameChange(e.target.value)}
              placeholder="Last name"
              sx={fieldSx}
            />
          </SettingsLabeledField>

          <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
            <SettingsLabeledField label="Email address">
              <TextField fullWidth value={email} disabled sx={settingsDisabledFieldSx(theme)} />
            </SettingsLabeledField>
          </Box>

          <SettingsLabeledField label="Phone number">
            <TextField fullWidth value={phone} onChange={(e) => onPhoneChange(e.target.value)} sx={fieldSx} />
          </SettingsLabeledField>
          <SettingsLabeledField label="Role">
            <TextField fullWidth value={ROLE_LABEL} disabled sx={settingsDisabledFieldSx(theme)} />
          </SettingsLabeledField>
        </Box>
      </Stack>

      <SettingsPasswordCard onUpdatePassword={() => {}} />
    </Stack>
  );
}
