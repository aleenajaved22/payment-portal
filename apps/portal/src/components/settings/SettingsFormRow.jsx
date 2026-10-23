import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

export function SettingsFormRow({ label, hint, children }) {
  const theme = useTheme();

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={{ xs: 1.5, md: 4 }}
      alignItems="flex-start"
      sx={{ width: '100%' }}
    >
      <Box sx={{ width: { md: 280 }, flexShrink: 0 }}>
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 500,
            lineHeight: '20px',
            color: theme.palette.textSecondary2,
          }}
        >
          {label}
        </Typography>
        {hint ? (
          <Typography sx={{ fontSize: 14, lineHeight: '20px', color: theme.palette.textSecondary3 }}>{hint}</Typography>
        ) : null}
      </Box>
      <Box sx={{ flex: 1, width: '100%', maxWidth: { md: 640 } }}>{children}</Box>
    </Stack>
  );
}
