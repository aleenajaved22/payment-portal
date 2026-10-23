import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { TextField } from '../design-system';
import { SettingsLabeledField } from './SettingsLabeledField';
import { settingsFieldInputSx } from './settingsFieldStyles';

export function SettingsPasswordCard({ onUpdatePassword }) {
  const theme = useTheme();
  const fieldSx = settingsFieldInputSx(theme);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleBlur = () => {
    if (!currentPassword && !newPassword && !confirmPassword) return;
    onUpdatePassword?.({ currentPassword, newPassword, confirmPassword });
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography sx={{ fontSize: 16, fontWeight: 700, lineHeight: '24px', color: theme.palette.textPrimary }}>
          Change password
        </Typography>
        <Typography sx={{ fontSize: 14, lineHeight: '20px', color: theme.palette.textSecondary3, mt: 0.5 }}>
          Set a new password for your account.
        </Typography>
      </Box>

      <Stack spacing={2.5}>
        <SettingsLabeledField label="Current password">
          <TextField
            fullWidth
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            onBlur={handleBlur}
            placeholder="Enter current password"
            sx={fieldSx}
          />
        </SettingsLabeledField>
        <SettingsLabeledField label="New password">
          <TextField
            fullWidth
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            onBlur={handleBlur}
            placeholder="Enter new password"
            sx={fieldSx}
          />
        </SettingsLabeledField>
        <SettingsLabeledField label="Confirm password">
          <TextField
            fullWidth
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={handleBlur}
            placeholder="Confirm new password"
            sx={fieldSx}
          />
        </SettingsLabeledField>
      </Stack>
    </Stack>
  );
}
