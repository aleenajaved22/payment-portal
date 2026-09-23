import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { FilterSelect } from './FilterSelect';
import { Button, Search } from './design-system';
import { invoiceSiteFilterOptions, invoiceStatusFilterOptions } from '../data/mockInvoices';

const SEARCH_PLACEHOLDER = 'Search by invoice no.';

export function InvoicesToolbar({
  query,
  onQueryChange,
  site,
  onSiteChange,
  status,
  onStatusChange,
  showPayNow = false,
  onPayNow,
}) {
  const theme = useTheme();
  const searchWidthCh = Math.max(SEARCH_PLACEHOLDER.length, query.length);

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2.5}
      alignItems={{ xs: 'stretch', md: 'center' }}
      justifyContent="space-between"
      sx={{ width: '100%' }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 2, md: 1 }}
        alignItems={{ xs: 'stretch', md: 'center' }}
      >
        <Search
          placeholder="Search by invoice no."
          variant="outlined"
          size="small"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          sx={{
            width: {
              xs: '100%',
              md: `calc(${searchWidthCh}ch + 2.75rem)`,
            },
            flexShrink: 0,
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
              backgroundColor: theme.palette.surfaceWhite,
              height: 36,
            },
            '& .MuiOutlinedInput-input': {
              minWidth: `${searchWidthCh}ch`,
              fontSize: 14,
              fontWeight: 500,
            },
            '& .MuiOutlinedInput-root .MuiInputBase-input::placeholder': {
              fontSize: 14,
              fontWeight: 500,
              lineHeight: '20px',
              color: '#6a6a70',
              opacity: 1,
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.borderSubtle2,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon sx={{ fontSize: 18, color: theme.palette.textSecondary2 }} />
              </InputAdornment>
            ),
          }}
        />

        <Stack direction="row" spacing={0.5} flexWrap="wrap" alignItems="center">
          <FilterSelect label="Sites" value={site} onChange={onSiteChange} options={invoiceSiteFilterOptions} />
          <FilterSelect
            label="Status"
            value={status}
            onChange={onStatusChange}
            options={invoiceStatusFilterOptions}
          />
        </Stack>
      </Stack>

      {/* Always present, but inert until the customer selects invoices to pay. */}
      <Button
        variant="primary"
        onClick={onPayNow}
        disabled={!showPayNow}
        endIcon={<ArrowForwardIcon sx={{ fontSize: 18 }} />}
        sx={{
          alignSelf: { xs: 'flex-start', md: 'center' },
          minWidth: 105,
          '& .MuiButton-endIcon': { ml: 0.75 },
        }}
      >
        Pay Now
      </Button>
    </Stack>
  );
}
