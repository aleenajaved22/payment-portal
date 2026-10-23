import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { FilterSelect } from './FilterSelect';
import { ToolbarDateRangeField } from './ToolbarDateRangeField';
import { Button, Search } from './design-system';
import { toolbarSearchFieldSx, toolbarSearchIconSx } from './toolbarSearchFieldSx';
import {
  invoiceSiteFilterOptions,
  invoiceStatusFilterOptionDescriptions,
  invoiceStatusFilterOptions,
} from '../data/mockInvoices';
import { weekFilterOptions } from '../data/mockReports';

const SEARCH_PLACEHOLDER = 'Search by invoice no.';

export function InvoicesToolbar({
  query,
  onQueryChange,
  site,
  onSiteChange,
  status,
  onStatusChange,
  week,
  onWeekChange,
  dateRangeLabel,
  dateRange,
  showPayNow = false,
  onPayNow,
}) {
  const theme = useTheme();

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
        spacing={{ xs: 2, md: 1.5 }}
        alignItems={{ xs: 'stretch', md: 'center' }}
        sx={{ minWidth: 0, flexWrap: { md: 'nowrap' } }}
      >
        <Search
          placeholder="Search by invoice no."
          variant="outlined"
          size="small"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          sx={toolbarSearchFieldSx(theme, { placeholder: SEARCH_PLACEHOLDER, query })}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon sx={toolbarSearchIconSx(theme)} />
              </InputAdornment>
            ),
          }}
        />

        <Stack direction="row" spacing={0.5} flexWrap="wrap" alignItems="center" sx={{ flexShrink: 0 }}>
          <FilterSelect
            label="Sites"
            value={site}
            onChange={onSiteChange}
            options={invoiceSiteFilterOptions}
            searchable
            searchPlaceholder="Search sites"
          />
          <FilterSelect
            label="Status"
            value={status}
            onChange={onStatusChange}
            options={invoiceStatusFilterOptions}
            optionDescriptions={invoiceStatusFilterOptionDescriptions}
            clearFirstOption={false}
          />
          <FilterSelect
            label="Date range"
            value={week}
            onChange={onWeekChange}
            options={weekFilterOptions}
            clearFirstOption={false}
          />
        </Stack>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={1} sx={{ flexShrink: 0 }}>
        {/* Always present, but inert until the customer selects invoices to pay. */}
        <Button
          variant="primary"
          onClick={onPayNow}
          disabled={!showPayNow}
          endIcon={<ArrowForwardIcon sx={{ fontSize: 18 }} />}
          sx={{
            minWidth: 105,
            '& .MuiButton-endIcon': { ml: 0.75 },
          }}
        >
          Pay Now
        </Button>

        <ToolbarDateRangeField
          displayValue={dateRangeLabel}
          ariaLabel="Due date range in view"
          presetOptions={weekFilterOptions}
          activePreset={week || null}
          onPresetChange={onWeekChange}
          range={dateRange}
        />
      </Stack>
    </Stack>
  );
}
