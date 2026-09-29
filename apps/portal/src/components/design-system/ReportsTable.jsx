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
import { useTheme } from '@mui/material/styles';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import { NewSiteBadge } from './NewSiteBadge';
import { ReportTypeChip } from './ReportTypeChip';

export function ReportsTable({ reports, sortField, sortDirection, onSort, onOpenReport, onDownload }) {
  const theme = useTheme();
  const isInteractive = Boolean(onOpenReport);

  const cellPaddingX = '24px';

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
      <Table sx={{ tableLayout: 'fixed', minWidth: 680 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ ...headerCellSx, width: '34%' }}>Site</TableCell>
            <TableCell sx={{ ...headerCellSx, width: '22%' }}>Report Type</TableCell>
            <TableCell sx={{ ...headerCellSx, width: '22%' }} sortDirection={sortField === 'day' ? sortDirection : false}>
              <TableSortLabel
                active={sortField === 'day'}
                direction={sortField === 'day' ? sortDirection : 'desc'}
                onClick={() => onSort('day')}
                sx={sortLabelSx}
              >
                Day
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ ...headerCellSx, width: onDownload ? '18%' : '22%' }} sortDirection={sortField === 'date' ? sortDirection : false}>
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
              <TableCell sx={{ ...headerCellSx, width: '6%' }}>
                <Box component="span" sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
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
              hover={isInteractive}
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
                cursor: isInteractive ? 'pointer' : 'default',
                '& td': {
                  borderBottom: `1px solid ${theme.palette.borderSubtle1}`,
                  py: 2,
                  px: cellPaddingX,
                },
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
              <TableCell>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="body2" sx={{ color: theme.palette.textPrimary, fontWeight: 500, fontSize: 14 }}>
                    {report.site}
                  </Typography>
                  {report.isNew ? <NewSiteBadge /> : null}
                </Stack>
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
                  {report.date}
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
                    <DownloadOutlinedIcon sx={{ fontSize: 18 }} />
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
