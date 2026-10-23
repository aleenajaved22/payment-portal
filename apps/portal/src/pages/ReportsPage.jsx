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
import { ReportDetailDrawer } from '../components/ReportDetailDrawer';
import { ReportsToolbar } from '../components/ReportsToolbar';
import { EmptyState, ReportsTable } from '../components/design-system';
import { useReports } from '../context/ReportsContext';
import { parseInvoiceDate } from '../data/mockInvoices';
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
  const { reports, markReportRead } = useReports();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [site, setSite] = useState('');
  const [reportType, setReportType] = useState('');
  const [week, setWeek] = useState('This Week');
  const [page, setPage] = useState(0);
  const [sortField, setSortField] = useState('day');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedIds, setSelectedIds] = useState([]);
  const [drawerReport, setDrawerReport] = useState(null);

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
          (report.company ?? '').toLowerCase().includes(normalized) ||
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
      if (a.isNew !== b.isNew) {
        return a.isNew ? -1 : 1;
      }
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (sortField === 'date') {
        aVal = parseInvoiceDate(aVal)?.getTime() ?? 0;
        bVal = parseInvoiceDate(bVal)?.getTime() ?? 0;
      } else if (sortField === 'company') {
        aVal = (aVal ?? '').toLowerCase();
        bVal = (bVal ?? '').toLowerCase();
      } else if (typeof aVal === 'string' && typeof bVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
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

  const handleToggleRow = (reportId) => {
    setSelectedIds((prev) =>
      prev.includes(reportId) ? prev.filter((id) => id !== reportId) : [...prev, reportId],
    );
  };

  const handleToggleAll = (checked) => {
    const pageIds = pagedReports.map((report) => report.id);
    setSelectedIds((prev) => {
      if (checked) {
        return [...new Set([...prev, ...pageIds])];
      }
      return prev.filter((id) => !pageIds.includes(id));
    });
  };

  const handleBulkDownload = () => {
    reports
      .filter((report) => selectedIds.includes(report.id))
      .forEach((report) => downloadReport(report));
  };

  const openReportDrawer = (report) => {
    if (report?.isNew) markReportRead(report.id);
    setDrawerReport(report);
  };

  const closeReportDrawer = () => setDrawerReport(null);

  return (
    <PortalShell activeNav="reports">
      <Stack spacing={2.5}>
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
          dateRange={dateRange}
          selectedCount={selectedIds.length}
          onBulkDownload={handleBulkDownload}
        />

        <Box sx={{ pt: 0.5, width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
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
                onOpenReport={openReportDrawer}
                onDownload={downloadReport}
                selectedIds={selectedIds}
                onToggleRow={handleToggleRow}
                onToggleAll={handleToggleAll}
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

      <ReportDetailDrawer
        open={Boolean(drawerReport)}
        report={drawerReport}
        onClose={closeReportDrawer}
        onDownload={downloadReport}
      />
    </PortalShell>
  );
}
