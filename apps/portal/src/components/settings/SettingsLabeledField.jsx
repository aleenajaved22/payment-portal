import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { settingsFieldLabelSx } from './settingsFieldStyles';

export function SettingsLabeledField({ label, children }) {
  const theme = useTheme();

  return (
    <Stack spacing={0.75} sx={{ width: '100%', minWidth: 0 }}>
      <Typography component="label" sx={settingsFieldLabelSx(theme)}>
        {label}
      </Typography>
      {children}
    </Stack>
  );
}
