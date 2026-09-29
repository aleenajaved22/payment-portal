import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { FilterSelect } from './FilterSelect';
import { Search, TextField } from './design-system';
import {
  reportTypeFilterOptions,
  siteFilterOptions,
  weekFilterOptions,
} from '../data/mockReports';

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
}) {
  const theme = useTheme();

  return (
    <Stack
      direction={{ xs: 'column', lg: 'row' }}
      spacing={2}
      alignItems={{ xs: 'stretch', lg: 'center' }}
      justifyContent="space-between"
    >
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 2, md: 1 }} alignItems={{ xs: 'stretch', md: 'center' }}>
        <Search
          placeholder="Search reports"
          variant="outlined"
          size="small"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          sx={{
            // The theme forces minWidth:220 on text fields; anything narrower
            // overflows its wrapper and collides with the filter beside it.
            width: { xs: '100%', md: 240 },
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
              backgroundColor: theme.palette.surfaceWhite,
              height: 36,
            },
            '& .MuiOutlinedInput-input': {
              fontSize: 14,
              fontWeight: 500,
            },
            // Theme ships the placeholder at 16px/400 #cccccc — 1.61:1 on white,
            // below WCAG AA. Matches the invoices toolbar: filter type scale,
            // grey.500 for 5.37:1. Needs the more specific selector to win.
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
          <FilterSelect label="Sites" value={site} onChange={onSiteChange} options={siteFilterOptions} />
          <FilterSelect
            label="Report Type"
            value={reportType}
            onChange={onReportTypeChange}
            options={reportTypeFilterOptions}
          />
          {/* Labelled by what it filters, not by its first option — "This Week"
              as the resting label read as an applied filter when none was. */}
          <FilterSelect label="Date range" value={week} onChange={onWeekChange} options={weekFilterOptions} />
        </Stack>
      </Stack>

      {/* Reads out the window actually in force — the select above sets it, and
          with nothing selected it states the span of the reports on screen. */}
      <TextField
        variant="outlined"
        size="small"
        value={dateRangeLabel ?? ''}
        inputProps={{ 'aria-label': 'Date range in view' }}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              <CalendarTodayOutlinedIcon sx={{ fontSize: 18, color: theme.palette.textSecondary3 }} />
            </InputAdornment>
          ),
        }}
        sx={{
          width: { xs: '100%', lg: 260 },
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: theme.palette.surfaceWhite,
            height: 36,
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.borderSubtle2,
          },
          '& .MuiOutlinedInput-input': {
            fontSize: 14,
            color: theme.palette.textPrimary,
          },
        }}
      />
    </Stack>
  );
}
