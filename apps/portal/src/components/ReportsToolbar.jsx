import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { FilterSelect } from './FilterSelect';
import { ToolbarDateRangeField } from './ToolbarDateRangeField';
import { Button, Search } from './design-system';
import { toolbarSearchFieldSx, toolbarSearchIconSx } from './toolbarSearchFieldSx';
import {
  reportTypeFilterOptions,
  siteFilterOptions,
  weekFilterOptions,
} from '../data/mockReports';

const SEARCH_PLACEHOLDER = 'Search';

export function ReportsToolbar({
  query,
  onQueryChange,
  site,
  onSiteChange,
  reportType,
  onReportTypeChange,
  week,
  onWeekChange,
  dateRangeLabel,
  dateRange,
  selectedCount = 0,
  onBulkDownload,
}) {
  const theme = useTheme();

  return (
    <Stack
      direction={{ xs: 'column', lg: 'row' }}
      spacing={2}
      alignItems={{ xs: 'stretch', lg: 'center' }}
      justifyContent="space-between"
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 2, md: 1.5 }}
        alignItems={{ xs: 'stretch', md: 'center' }}
        sx={{ minWidth: 0, flexWrap: { md: 'nowrap' } }}
      >
        <Search
          placeholder={SEARCH_PLACEHOLDER}
          variant="outlined"
          size="small"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          sx={toolbarSearchFieldSx(theme, { placeholder: SEARCH_PLACEHOLDER, query, extraWidthPx: 80 })}
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
            options={siteFilterOptions}
            searchable
            searchPlaceholder="Search sites"
          />
          <FilterSelect
            label="Report Type"
            value={reportType}
            onChange={onReportTypeChange}
            options={reportTypeFilterOptions}
          />
          {/* Labelled by what it filters, not by its first option — "This Week"
              as the resting label read as an applied filter when none was. */}
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
        <Button
          variant="primary"
          onClick={onBulkDownload}
          disabled={selectedCount === 0}
          startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 18 }} />}
          sx={{ flexShrink: 0, whiteSpace: 'nowrap' }}
        >
          Download ({selectedCount})
        </Button>

        <ToolbarDateRangeField
          displayValue={dateRangeLabel}
          presetOptions={weekFilterOptions}
          activePreset={week}
          onPresetChange={onWeekChange}
          range={dateRange}
        />
      </Stack>
    </Stack>
  );
}
