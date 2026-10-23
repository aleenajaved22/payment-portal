import { useTheme } from '@mui/material/styles';
import { Chip } from '@signal/ui';

/** Grey pill for site names in tables — same treatment as ContractChip. */
export function SiteNameChip({ label }) {
  const theme = useTheme();

  return (
    <Chip
      label={label}
      size="small"
      sx={{
        height: 24,
        width: 'max-content',
        maxWidth: 'none',
        textTransform: 'none',
        pl: '10px !important',
        pr: '10px !important',
        py: '2px !important',
        gap: 0,
        backgroundColor: theme.palette.surfaceGreySubtle,
        color: theme.palette.textSecondary2,
        fontSize: 14,
        fontWeight: 400,
        lineHeight: 'normal',
        borderRadius: '100px',
        '& .MuiChip-label': {
          pl: '0 !important',
          pr: '0 !important',
          py: 0,
          textTransform: 'none',
          whiteSpace: 'nowrap',
          overflow: 'visible',
        },
      }}
    />
  );
}
