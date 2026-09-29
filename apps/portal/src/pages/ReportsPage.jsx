import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PortalShell } from '../components/PortalShell';
import { ReportsToolbar } from '../components/ReportsToolbar';
import { EmptyState, PageHeader, ReportsTable } from '../components/design-system';
import { useReports } from '../context/ReportsContext';
import {
  downloadReport,
  formatDateRange,
  getReportDateRange,
  getReportsSpan,
  isReportInRange,
} from '../data/reportFilters';

const ROWS_PER_PAGE = 8;

export function ReportsPage() {
  const theme = useTheme();
  const { reports, newCount, markReportRead } = useReports();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [site, setSite] = useState('');
  const [reportType, setReportType] = useState('');
  const [week, setWeek] = useState('');
  const [page, setPage] = useState(0);
  const [sortField, setSortField] = useState('day');
  const [sortDirection, setSortDirection] = useState('asc');

  const dateRange = useMemo(() => getReportDateRange(week), [week]);

  /**
   * The dashboard's report tile still hands a specific report over as
   * `?report=<id>`. With the detail drawer hidden there is nothing to open, so
   * following that link lands on the list and marks the report read — the param
   * is consumed immediately, so a refresh or a back gesture doesn't re-run it.
   */
  useEffect(() => {
    const requested = searchParams.get('report');
    if (!requested) return;
    const match = reports.find((report) => report.id === requested);
    if (match?.isNew) markReportRead(match.id);
    setSearchParams({}, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, reports]);

  /* Narrowing the list can strand the reader on a page that no longer exists —
     filter to one week from page 2 and the table comes back empty. */
  useEffect(() => {
    setPage(0);
  }, [query, site, reportType, week]);

  const filteredReports = useMemo(() => {
    let rows = [...reports];

    if (query.trim()) {
      const normalized = query.trim().toLowerCase();
      rows = rows.filter(
        (report) =>
          report.site.toLowerCase().includes(normalized) ||
          report.reportType.toLowerCase().includes(normalized) ||
          report.day.toLowerCase().includes(normalized) ||
          report.date.toLowerCase().includes(normalized),
      );
    }

    if (site) {
      rows = rows.filter((report) => report.site === site);
    }

    if (reportType) {
      rows = rows.filter((report) => report.reportType === reportType);
    }

    if (dateRange) {
      rows = rows.filter((report) => isReportInRange(report, dateRange));
    }

    rows.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return rows;
  }, [reports, query, site, reportType, dateRange, sortField, sortDirection]);

  /* The field states the applied window, or — with none applied — the span the
     list actually covers, so it always describes what is on screen. */
  const dateRangeLabel = formatDateRange(dateRange ?? getReportsSpan(filteredReports));

  const pagedReports = filteredReports.slice(page * ROWS_PER_PAGE, page * ROWS_PER_PAGE + ROWS_PER_PAGE);
  const total = filteredReports.length;
  const from = total === 0 ? 0 : page * ROWS_PER_PAGE + 1;
  const to = Math.min((page + 1) * ROWS_PER_PAGE, total);
  const canPrev = page > 0;
  const canNext = (page + 1) * ROWS_PER_PAGE < total;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <PortalShell activeNav="reports">
      <Stack spacing={2.5}>
        <PageHeader
          title="Reports"
          description={
            newCount > 0
              ? `Site summaries and incident reports across your locations. ${newCount} unread.`
              : 'Site summaries and incident reports across your locations.'
          }
        />
        <ReportsToolbar
          query={query}
          onQueryChange={setQuery}
          site={site}
          onSiteChange={setSite}
          reportType={reportType}
          onReportTypeChange={setReportType}
          week={week}
          onWeekChange={setWeek}
          dateRangeLabel={dateRangeLabel}
        />

        <Box sx={{ pt: 0.5 }}>
          {pagedReports.length === 0 ? (
            <EmptyState
              title="No reports found"
              description="Try adjusting your search or filters."
            />
          ) : (
            <>
              <ReportsTable
                reports={pagedReports}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                onDownload={downloadReport}
              />

              <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1.25} sx={{ pt: 2 }}>
                <Typography variant="body2" sx={{ color: theme.palette.textSecondary2, fontSize: 14 }}>
                  {from}-{to} of {total}
                </Typography>
                <IconButton
                  size="small"
                  disabled={!canPrev}
                  onClick={() => setPage((p) => p - 1)}
                  sx={{
                    border: `1px solid ${theme.palette.borderSubtle2}`,
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    color: theme.palette.textSecondary2,
                    '&.Mui-disabled': { opacity: 0.4 },
                  }}
                >
                  <ChevronLeftIcon sx={{ fontSize: 18 }} />
                </IconButton>
                <IconButton
                  size="small"
                  disabled={!canNext}
                  onClick={() => setPage((p) => p + 1)}
                  sx={{
                    border: `1px solid ${theme.palette.borderSubtle2}`,
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    color: theme.palette.textSecondary2,
                    '&.Mui-disabled': { opacity: 0.4 },
                  }}
                >
                  <ChevronRightIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Stack>
            </>
          )}
        </Box>
      </Stack>
    </PortalShell>
  );
}
