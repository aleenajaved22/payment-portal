import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { PAGE_GUTTER } from './DashboardGrid';

function SummaryField({ label, value, showDivider }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minWidth: 0,
        px: PAGE_GUTTER,
        py: '20px',
        borderRight: showDivider ? `1px solid ${theme.palette.borderSubtle1}` : 'none',
        boxSizing: 'border-box',
      }}
    >
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 500,
          lineHeight: '16px',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: theme.palette.textSecondary3,
        }}
      >
        {label}
      </Typography>
      <Typography
        noWrap
        title={value}
        sx={{
          mt: 0.5,
          fontSize: 14,
          fontWeight: 700,
          lineHeight: '20px',
          color: theme.palette.textPrimary,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

/** Four-up contract context — equal columns via grid, not content-sized flex. */
export function ContractSummaryRow({ contractId, companyName, site, nextService }) {
  const theme = useTheme();
  const fields = [
    { label: 'Contract ID', value: contractId },
    { label: 'Company Name', value: companyName },
    { label: 'Site', value: site },
    { label: 'Next Service', value: nextService },
  ];

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: theme.palette.surfaceWhite,
        borderBottom: `1px solid ${theme.palette.borderSubtle1}`,
      }}
    >
      <Box
        sx={{
          display: 'grid',
          width: '100%',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        }}
      >
        {fields.map((field, index) => (
          <SummaryField
            key={field.label}
            label={field.label}
            value={field.value}
            showDivider={index < fields.length - 1}
          />
        ))}
      </Box>
    </Box>
  );
}
