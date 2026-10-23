import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { SettingsFormRow } from './SettingsFormRow';

export function SettingsPasswordCard({ onUpdatePassword }) {
  const theme = useTheme();

  return (
    <SettingsFormRow label="Account Password">
      <Box
        component="button"
        type="button"
        onClick={onUpdatePassword}
        sx={{
          border: 0,
          background: 'none',
          p: 0,
          cursor: 'pointer',
          font: 'inherit',
          fontSize: 14,
          fontWeight: 500,
          lineHeight: '20px',
          color: theme.palette.textBrand,
          textAlign: 'left',
          '&:hover': { textDecoration: 'underline' },
        }}
      >
        Update Password
      </Box>
    </SettingsFormRow>
  );
}
