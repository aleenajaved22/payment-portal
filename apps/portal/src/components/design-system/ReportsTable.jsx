import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { Checkbox } from './Checkbox';
import { NewSiteBadge } from './NewSiteBadge';
import { ReportTypeChip } from './ReportTypeChip';
import { formatInvoiceDueDate } from '../../data/mockInvoices';

export function ReportsTable({
  reports,
  sortField,
  sortDirection,
  onSort,
  onOpenReport,
  onDownload,
  selectedIds = [],
  onToggleRow,
  onToggleAll,
}) {
  const theme = useTheme();
  const rowHoverBackground = alpha(theme.palette.textPrimary, 0.02);
  const isInteractive = Boolean(onOpenReport);
  const selectionEnabled = Boolean(onToggleRow && onToggleAll);
  const allSelected = selectionEnabled && reports.length > 0 && reports.every((report) => selectedIds.includes(report.id));
  const someSelected =
    selectionEnabled && reports.some((report) => selectedIds.includes(report.id)) && !allSelected;

  const cellPaddingX = '24px';
  const checkboxColumnWidth = 56;

  const checkboxSx = {
    p: 0,
    width: 18,
    height: 18,
    color: theme.palette.textDisabled,
    '& .MuiSvgIcon-root': {
      fontSize: 18,
    },
    '&.Mui-checked': {
      color: theme.palette.primary.main,
    },
    '&.Mui-disabled': {
      color: theme.palette.action.disabled,
    },
  };

  const headerCellSx = {
    fontWeight: 500,
    fontSize: 13,
    color: theme.palette.textSecondary3,
    borderBottom: `1px solid ${theme.palette.borderSubtle1}`,
    py: 1.25,
    px: cellPaddingX,
    backgroundColor: theme.palette.surfaceWhite,
  };

  const sortLabelSx = {
    color: `${theme.palette.textSecondary3} !important`,
    '& .MuiTableSortLabel-icon': {
      color: `${theme.palette.textSecondary3} !important`,
      opacity: 1,
      fontSize: 16,
    },
  };

  return (
    /* The table keeps its columns and scrolls inside this box on a narrow
       screen. Without the explicit minWidth the fixed layout pushed the whole
       page sideways instead — 723px of document in a 375px viewport. */
    <TableContainer sx={{ width: '100%', maxWidth: '100%', overflowX: 'auto' }}>
      <Table sx={{ tableLayout: 'fixed', width: '100%', minWidth: selectionEnabled ? 876 : 820 }}>
        <TableHead>
          <TableRow>
            {selectionEnabled ? (
              <TableCell
                sx={{
                  ...headerCellSx,
                  width: checkboxColumnWidth,
                  minWidth: checkboxColumnWidth,
                  maxWidth: checkboxColumnWidth,
                  px: 2,
                  boxSizing: 'border-box',
                }}
              >
                <Checkbox
                  size="small"
                  disableRipple
                  checked={allSelected}
                  indeterminate={someSelected}
                  disabled={reports.length === 0}
                  onChange={(event) => onToggleAll?.(event.target.checked)}
                  inputProps={{ 'aria-label': 'Select all reports on this page' }}
                  sx={checkboxSx}
                />
              </TableCell>
            ) : null}
            <TableCell sx={{ ...headerCellSx, width: '24%' }} sortDirection={sortField === 'site' ? sortDirection : false}>
              <TableSortLabel
                active={sortField === 'site'}
                direction={sortField === 'site' ? sortDirection : 'desc'}
                onClick={() => onSort('site')}
                sx={sortLabelSx}
              >
                Site
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ ...headerCellSx, width: '16%' }} sortDirection={sortField === 'company' ? sortDirection : false}>
              <TableSortLabel
                active={sortField === 'company'}
                direction={sortField === 'company' ? sortDirection : 'desc'}
                onClick={() => onSort('company')}
                sx={sortLabelSx}
              >
                Company
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ ...headerCellSx, width: '18%' }}>Report Type</TableCell>
            <TableCell sx={{ ...headerCellSx, width: '18%' }} sortDirection={sortField === 'day' ? sortDirection : false}>
              <TableSortLabel
                active={sortField === 'day'}
                direction={sortField === 'day' ? sortDirection : 'desc'}
                onClick={() => onSort('day')}
                sx={sortLabelSx}
              >
                Day
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ ...headerCellSx, width: onDownload ? '16%' : '20%' }} sortDirection={sortField === 'date' ? sortDirection : false}>
              <TableSortLabel
                active={sortField === 'date'}
                direction={sortField === 'date' ? sortDirection : 'desc'}
                onClick={() => onSort('date')}
                sx={sortLabelSx}
              >
                Date
              </TableSortLabel>
            </TableCell>
            {onDownload ? (
              <TableCell sx={{ ...headerCellSx, width: '6%', position: 'relative' }} aria-label="Download">
                <Box
                  component="span"
                  sx={{
                    position: 'absolute',
                    width: '1px',
                    height: '1px',
                    p: 0,
                    m: '-1px',
                    overflow: 'hidden',
                    clip: 'rect(0, 0, 0, 0)',
                    whiteSpace: 'nowrap',
                    border: 0,
                  }}
                >
                  Download
                </Box>
              </TableCell>
            ) : null}
          </TableRow>
        </TableHead>
        <TableBody>
          {reports.map((report) => (
            <TableRow
              key={report.id}
              hover={false}
              onClick={isInteractive ? () => onOpenReport(report) : undefined}
              /* The row is the target, so it is also the tab stop and answers
                 Enter — a row you can click but not reach by keyboard is a row
                 half the people here cannot open. */
              tabIndex={isInteractive ? 0 : undefined}
              role={isInteractive ? 'button' : undefined}
              aria-label={isInteractive ? `Open ${report.reportType} for ${report.site}, ${report.date}` : undefined}
              onKeyDown={
                isInteractive
                  ? (event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        onOpenReport(report);
                      }
                    }
                  : undefined
              }
              sx={{
                transition: 'background-color 0.15s ease',
                cursor: isInteractive ? 'pointer' : 'default',
                '&:hover': {
                  backgroundColor: rowHoverBackground,
                },
                '&:hover td': {
                  backgroundColor: rowHoverBackground,
                },
                '& td': {
                  borderBottom: `1px solid ${theme.palette.borderSubtle1}`,
                  py: 2,
                  px: cellPaddingX,
                },
                '& td:first-of-type': selectionEnabled
                  ? {
                      width: checkboxColumnWidth,
                      minWidth: checkboxColumnWidth,
                      maxWidth: checkboxColumnWidth,
                      px: 2,
                      boxSizing: 'border-box',
                    }
                  : {},
                '&:last-child td': { borderBottom: 0 },
                '&:focus-visible': {
                  outline: `2px solid ${theme.palette.primary.main}`,
                  outlineOffset: '-2px',
                },
                // Keeps the row's own download control visible once the row is
                // hovered, matching the ghost-action pattern used elsewhere.
                '&:hover .report-row-download': { opacity: 1 },
              }}
            >
              {selectionEnabled ? (
                <TableCell onClick={(event) => event.stopPropagation()}>
                  <Checkbox
                    size="small"
                    disableRipple
                    checked={selectedIds.includes(report.id)}
                    onChange={() => onToggleRow?.(report.id)}
                    inputProps={{ 'aria-label': `Select report for ${report.site}, ${report.date}` }}
                    sx={checkboxSx}
                  />
                </TableCell>
              ) : null}
              <TableCell>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="body2" sx={{ color: theme.palette.textPrimary, fontWeight: 500, fontSize: 14 }}>
                    {report.site}
                  </Typography>
                  {report.isNew ? <NewSiteBadge /> : null}
                </Stack>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.textSecondary2,
                    fontSize: 14,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {report.company ?? '—'}
                </Typography>
              </TableCell>
              <TableCell>
                <ReportTypeChip type={report.reportType} />
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ color: theme.palette.textSecondary2, fontSize: 14 }}>
                  {report.day}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ color: theme.palette.textSecondary2, fontSize: 14 }}>
                  {formatInvoiceDueDate(report.date)}
                </Typography>
              </TableCell>
              {onDownload ? (
                <TableCell align="right">
                  <IconButton
                    className="report-row-download"
                    size="small"
                    aria-label={`Download ${report.reportType} for ${report.site}`}
                    /* Stops the row's own open handler: downloading and opening
                       are different intents and the smaller target must win. */
                    onClick={(event) => {
                      event.stopPropagation();
                      onDownload(report);
                    }}
                    sx={{
                      width: 30,
                      height: 30,
                      color: theme.palette.textSecondary3,
                      opacity: 0,
                      transition: 'opacity 0.15s ease, color 0.15s ease',
                      '&:hover': { backgroundColor: 'transparent', color: theme.palette.textPrimary },
                      '&:focus-visible': { opacity: 1 },
                      '@media (hover: none)': { opacity: 1 },
                    }}
                  >
                    <FileDownloadOutlinedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </TableCell>
              ) : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
