import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReplayIcon from '@mui/icons-material/Replay';
import { alpha, useTheme } from '@mui/material/styles';
import { Button } from '@signal/ui';
import { Checkbox } from './Checkbox';
import { ContractChip } from './ContractChip';
import { SiteNameChip } from './SiteNameChip';
import { InvoiceStatusChip } from './InvoiceStatusChip';
import { InvoiceViewIconButton } from '../InvoiceViewIconButton';
import { formatInvoiceDueDate } from '../../data/mockInvoices';

export function InvoicesTable({
  invoices,
  sortField,
  sortDirection,
  onSort,
  selectedIds = [],
  onToggleRow,
  onToggleAll,
  onViewInvoice,
  onViewInvoiceDocument,
  onPayInvoice,
}) {
  const theme = useTheme();
  const rowHoverBackground = alpha(theme.palette.textPrimary, 0.035);
  const cellPaddingX = '24px';
  const bodyCellPy = 2;
  const checkboxColumnWidth = 64;
  const invoiceColumnWidth = 154;
  const siteColumnMinWidth = 182;
  const scrollColumnMinWidth = 154;
  const contractColumnMinWidth = 172;
  const statusColumnMinWidth = 220;
  const actionsColumnWidth = 132;
  const payNowSlotWidth = 72;
  const tableMinWidth =
    checkboxColumnWidth +
    invoiceColumnWidth +
    siteColumnMinWidth +
    scrollColumnMinWidth +
    contractColumnMinWidth +
    scrollColumnMinWidth * 3 +
    statusColumnMinWidth +
    actionsColumnWidth;

  const invoiceColumnSx = {
    width: invoiceColumnWidth,
    minWidth: invoiceColumnWidth,
    maxWidth: invoiceColumnWidth,
    boxSizing: 'border-box',
  };

  const siteColumnSx = {
    width: siteColumnMinWidth,
    minWidth: siteColumnMinWidth,
    maxWidth: siteColumnMinWidth,
    boxSizing: 'border-box',
    overflow: 'hidden',
  };

  const scrollColumnSx = {
    width: scrollColumnMinWidth,
    minWidth: scrollColumnMinWidth,
    maxWidth: scrollColumnMinWidth,
    boxSizing: 'border-box',
  };

  const amountCellSx = {
    ...scrollColumnSx,
    whiteSpace: 'nowrap',
  };

  const statusCellSx = {
    width: statusColumnMinWidth,
    minWidth: statusColumnMinWidth,
    maxWidth: statusColumnMinWidth,
    boxSizing: 'border-box',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  };

  const filtersCellSx = {
    ...scrollColumnSx,
    whiteSpace: 'nowrap',
    fontVariantNumeric: 'tabular-nums',
  };

  const contractColumnSx = {
    width: contractColumnMinWidth,
    minWidth: contractColumnMinWidth,
    maxWidth: contractColumnMinWidth,
    boxSizing: 'border-box',
    overflow: 'hidden',
  };

  const clipBodyCellSx = {
    overflow: 'hidden',
    maxWidth: '100%',
  };

  const isInvoiceSelectable = (invoice) => invoice.status !== 'Paid';
  const selectableInvoices = invoices.filter(isInvoiceSelectable);
  const allSelected =
    selectableInvoices.length > 0 &&
    selectableInvoices.every((invoice) => selectedIds.includes(invoice.id));
  const someSelected =
    selectableInvoices.some((invoice) => selectedIds.includes(invoice.id)) && !allSelected;

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
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    '& .MuiTableSortLabel-icon': {
      color: `${theme.palette.textSecondary3} !important`,
      opacity: 1,
      fontSize: 16,
    },
  };

  const checkboxHeaderCellSx = {
    ...headerCellSx,
    pl: cellPaddingX,
    pr: cellPaddingX,
    width: checkboxColumnWidth,
    minWidth: checkboxColumnWidth,
    maxWidth: checkboxColumnWidth,
    boxSizing: 'border-box',
  };

  const checkboxBodyCellSx = {
    pl: cellPaddingX,
    pr: cellPaddingX,
    py: bodyCellPy,
    width: checkboxColumnWidth,
    minWidth: checkboxColumnWidth,
    maxWidth: checkboxColumnWidth,
    boxSizing: 'border-box',
    borderBottom: `1px solid ${theme.palette.borderSubtle1}`,
  };

  const checkboxSx = {
    p: 0,
    width: 18,
    height: 18,
    '& .MuiSvgIcon-root': {
      fontSize: 18,
    },
    '&.Mui-disabled': {
      color: theme.palette.action.disabled,
    },
  };

  const primaryCellTextSx = {
    color: theme.palette.textPrimary,
    fontWeight: 600,
    fontSize: 14,
    lineHeight: 1.43,
    m: 0,
  };

  const secondaryCellTextSx = {
    color: theme.palette.textSecondary2,
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 1.43,
    m: 0,
  };

  const stickyInvoiceDividerSx = {
    borderRight: `1px solid ${theme.palette.borderSubtle1}`,
    boxShadow: '4px 0 10px -2px rgba(16, 24, 40, 0.1)',
  };

  const stickyCheckboxHeaderSx = {
    ...checkboxHeaderCellSx,
    position: 'sticky',
    left: 0,
    zIndex: 5,
    backgroundColor: theme.palette.surfaceWhite,
  };

  const stickyCheckboxBodySx = {
    ...checkboxBodyCellSx,
    position: 'sticky',
    left: 0,
    zIndex: 2,
    backgroundColor: theme.palette.surfaceWhite,
    'tbody tr:hover &': {
      backgroundColor: rowHoverBackground,
    },
  };

  const stickyInvoiceHeaderSx = {
    ...headerCellSx,
    ...invoiceColumnSx,
    position: 'sticky',
    left: checkboxColumnWidth,
    zIndex: 6,
    ...stickyInvoiceDividerSx,
  };

  const stickyInvoiceBodySx = {
    ...invoiceColumnSx,
    position: 'sticky',
    left: checkboxColumnWidth,
    zIndex: 5,
    px: cellPaddingX,
    py: bodyCellPy,
    borderBottom: `1px solid ${theme.palette.borderSubtle1}`,
    backgroundColor: theme.palette.surfaceWhite,
    ...stickyInvoiceDividerSx,
    'tbody tr:hover &': {
      backgroundColor: rowHoverBackground,
    },
  };

  const stickyRightEdgeShadow = '-4px 0 10px -2px rgba(16, 24, 40, 0.1)';

  const stickyActionsHeaderSx = {
    ...headerCellSx,
    position: 'sticky',
    right: 0,
    zIndex: 4,
    width: actionsColumnWidth,
    minWidth: actionsColumnWidth,
    maxWidth: actionsColumnWidth,
    boxSizing: 'border-box',
    px: 1.5,
    borderLeft: `1px solid ${theme.palette.borderSubtle1}`,
    boxShadow: stickyRightEdgeShadow,
  };

  const stickyActionsBodySx = {
    position: 'sticky',
    right: 0,
    zIndex: 5,
    width: actionsColumnWidth,
    minWidth: actionsColumnWidth,
    maxWidth: actionsColumnWidth,
    boxSizing: 'border-box',
    px: 1,
    py: bodyCellPy,
    textAlign: 'right',
    verticalAlign: 'middle',
    overflow: 'hidden',
    borderBottom: `1px solid ${theme.palette.borderSubtle1}`,
    backgroundColor: theme.palette.surfaceWhite,
    borderLeft: `1px solid ${theme.palette.borderSubtle1}`,
    boxShadow: stickyRightEdgeShadow,
    'tbody tr:hover &': {
      backgroundColor: rowHoverBackground,
    },
  };

  const payNowHoverRowSx = {
    '& .invoice-table-pay-now': {
      width: payNowSlotWidth,
      minWidth: payNowSlotWidth,
      maxWidth: payNowSlotWidth,
      opacity: 0,
      visibility: 'hidden',
      overflow: 'hidden',
      pointerEvents: 'none',
      flexShrink: 0,
      transition: 'opacity 0.15s ease, visibility 0.15s ease',
    },
    '&:hover .invoice-table-pay-now, &:focus-within .invoice-table-pay-now': {
      opacity: 1,
      visibility: 'visible',
      pointerEvents: 'auto',
    },
    '@media (hover: none)': {
      '& .invoice-table-pay-now': {
        opacity: 1,
        visibility: 'visible',
        pointerEvents: 'auto',
      },
    },
  };

  const isPayableInvoice = (invoice) =>
    invoice.status === 'Pending' || invoice.status === 'Overdue' || invoice.status === 'Payment Failed';

  return (
    <TableContainer
      sx={{
        overflowX: 'auto',
        overflowY: 'visible',
        width: '100%',
        maxWidth: '100%',
        backgroundColor: theme.palette.surfaceWhite,
        WebkitOverflowScrolling: 'touch',
        isolation: 'isolate',
      }}
    >
      <Table sx={{ tableLayout: 'fixed', width: tableMinWidth, minWidth: tableMinWidth }}>
        <colgroup>
          <col style={{ width: checkboxColumnWidth }} />
          <col style={{ width: invoiceColumnWidth }} />
          <col style={{ width: siteColumnMinWidth }} />
          <col style={{ width: scrollColumnMinWidth }} />
          <col style={{ width: contractColumnMinWidth }} />
          <col style={{ width: scrollColumnMinWidth }} />
          <col style={{ width: scrollColumnMinWidth }} />
          <col style={{ width: statusColumnMinWidth }} />
          <col style={{ width: scrollColumnMinWidth }} />
          <col style={{ width: actionsColumnWidth }} />
        </colgroup>
        <TableHead>
          <TableRow>
            <TableCell sx={stickyCheckboxHeaderSx}>
              <Checkbox
                size="small"
                disableRipple
                checked={allSelected}
                indeterminate={someSelected}
                disabled={selectableInvoices.length === 0}
                onChange={(event) => onToggleAll?.(event.target.checked)}
                inputProps={{ 'aria-label': 'Select all invoices' }}
                sx={checkboxSx}
              />
            </TableCell>
            <TableCell sx={stickyInvoiceHeaderSx} sortDirection={sortField === 'invoiceNumber' ? sortDirection : false}>
              <TableSortLabel
                active={sortField === 'invoiceNumber'}
                direction={sortField === 'invoiceNumber' ? sortDirection : 'desc'}
                onClick={() => onSort('invoiceNumber')}
                sx={sortLabelSx}
              >
                Invoice Number
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ ...headerCellSx, ...siteColumnSx }} sortDirection={sortField === 'site' ? sortDirection : false}>
              <TableSortLabel
                active={sortField === 'site'}
                direction={sortField === 'site' ? sortDirection : 'desc'}
                onClick={() => onSort('site')}
                sx={sortLabelSx}
              >
                Site Name
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ ...headerCellSx, ...scrollColumnSx }} sortDirection={sortField === 'company' ? sortDirection : false}>
              <TableSortLabel
                active={sortField === 'company'}
                direction={sortField === 'company' ? sortDirection : 'desc'}
                onClick={() => onSort('company')}
                sx={sortLabelSx}
              >
                Company
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ ...headerCellSx, ...contractColumnSx }} sortDirection={sortField === 'contract' ? sortDirection : false}>
              <TableSortLabel
                active={sortField === 'contract'}
                direction={sortField === 'contract' ? sortDirection : 'desc'}
                onClick={() => onSort('contract')}
                sx={sortLabelSx}
              >
                Contract
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ ...headerCellSx, ...filtersCellSx }} sortDirection={sortField === 'filterCount' ? sortDirection : false}>
              <TableSortLabel
                active={sortField === 'filterCount'}
                direction={sortField === 'filterCount' ? sortDirection : 'desc'}
                onClick={() => onSort('filterCount')}
                sx={sortLabelSx}
              >
                Filters
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ ...headerCellSx, ...amountCellSx }} sortDirection={sortField === 'amount' ? sortDirection : false}>
              <TableSortLabel
                active={sortField === 'amount'}
                direction={sortField === 'amount' ? sortDirection : 'desc'}
                onClick={() => onSort('amount')}
                sx={sortLabelSx}
              >
                Amount
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ ...headerCellSx, ...statusCellSx }} sortDirection={sortField === 'status' ? sortDirection : false}>
              <TableSortLabel
                active={sortField === 'status'}
                direction={sortField === 'status' ? sortDirection : 'desc'}
                onClick={() => onSort('status')}
                sx={sortLabelSx}
              >
                Status
              </TableSortLabel>
            </TableCell>
            <TableCell
              sx={{ ...headerCellSx, ...scrollColumnSx, whiteSpace: 'nowrap' }}
              sortDirection={sortField === 'dueDate' ? sortDirection : false}
            >
              <TableSortLabel
                active={sortField === 'dueDate'}
                direction={sortField === 'dueDate' ? sortDirection : 'desc'}
                onClick={() => onSort('dueDate')}
                sx={sortLabelSx}
              >
                Due Date
              </TableSortLabel>
            </TableCell>
            <TableCell sx={stickyActionsHeaderSx} aria-label="Actions" />
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow
              key={invoice.id}
              onClick={() => {
                if (isPayableInvoice(invoice)) {
                  onViewInvoice?.(invoice);
                }
              }}
              sx={{
                transition: 'background-color 0.15s ease',
                cursor: isPayableInvoice(invoice) ? 'pointer' : 'default',
                ...(isPayableInvoice(invoice) ? payNowHoverRowSx : {}),
                '&:hover': {
                  backgroundColor: rowHoverBackground,
                },
                '&:hover td': {
                  backgroundColor: rowHoverBackground,
                },
                '& td': {
                  borderBottom: `1px solid ${theme.palette.borderSubtle1}`,
                  py: bodyCellPy,
                  overflow: 'hidden',
                },
                '& td:not(:first-of-type):not(:nth-of-type(2)):not(:last-of-type)': {
                  px: cellPaddingX,
                },
                '&:last-child td': { borderBottom: 0 },
              }}
            >
              <TableCell sx={stickyCheckboxBodySx} onClick={(event) => event.stopPropagation()}>
                <Checkbox
                  size="small"
                  disableRipple
                  checked={selectedIds.includes(invoice.id)}
                  disabled={!isInvoiceSelectable(invoice)}
                  onChange={() => onToggleRow?.(invoice.id)}
                  inputProps={{
                    'aria-label': `Select invoice ${invoice.invoiceNumber}`,
                  }}
                  sx={checkboxSx}
                />
              </TableCell>
              <TableCell sx={stickyInvoiceBodySx}>
                <Typography variant="body2" sx={primaryCellTextSx}>
                  {invoice.invoiceNumber}
                </Typography>
              </TableCell>
              <TableCell sx={{ verticalAlign: 'middle', ...siteColumnSx, ...clipBodyCellSx, px: cellPaddingX, py: bodyCellPy }}>
                <Box sx={{ maxWidth: '100%', overflow: 'hidden' }}>
                  <SiteNameChip label={invoice.site} />
                </Box>
              </TableCell>
              <TableCell sx={{ ...scrollColumnSx, ...clipBodyCellSx }}>
                <Typography
                  variant="body2"
                  sx={{ ...secondaryCellTextSx, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                >
                  {invoice.company ?? '—'}
                </Typography>
              </TableCell>
              <TableCell sx={{ verticalAlign: 'middle', ...contractColumnSx, ...clipBodyCellSx }}>
                <Box sx={{ maxWidth: '100%', overflow: 'hidden' }}>
                  <ContractChip label={invoice.contract} />
                </Box>
              </TableCell>
              <TableCell sx={{ ...filtersCellSx, ...clipBodyCellSx }}>
                <Typography variant="body2" sx={{ ...secondaryCellTextSx, fontVariantNumeric: 'tabular-nums' }}>
                  {invoice.filterCount ?? '—'}
                </Typography>
              </TableCell>
              <TableCell sx={amountCellSx}>
                <Typography variant="body2" sx={secondaryCellTextSx}>
                  {invoice.amount}
                </Typography>
              </TableCell>
              <TableCell sx={{ verticalAlign: 'middle', ...statusCellSx, ...clipBodyCellSx }}>
                <Stack direction="row" alignItems="center" spacing={0.25} sx={{ flexWrap: 'nowrap', maxWidth: '100%', overflow: 'hidden' }}>
                  <InvoiceStatusChip status={invoice.status} />
                  {invoice.status === 'Payment Failed' ? (
                    <IconButton
                      size="small"
                      aria-label={`Retry payment for ${invoice.invoiceNumber}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        onPayInvoice?.(invoice);
                      }}
                      sx={{
                        width: 28,
                        height: 28,
                        p: 0.5,
                        flexShrink: 0,
                        borderRadius: 0,
                        color: theme.palette.error.main,
                        '&:hover': {
                          backgroundColor: 'transparent',
                          color: theme.palette.error.dark,
                        },
                      }}
                    >
                      <ReplayIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  ) : null}
                </Stack>
              </TableCell>
              <TableCell sx={{ ...scrollColumnSx, ...clipBodyCellSx, whiteSpace: 'nowrap' }}>
                <Typography
                  variant="body2"
                  sx={{
                    ...secondaryCellTextSx,
                    ...(invoice.status === 'Overdue'
                      ? { color: theme.palette.error.main, fontWeight: 500 }
                      : {}),
                  }}
                >
                  {formatInvoiceDueDate(invoice.dueDate)}
                </Typography>
              </TableCell>
              <TableCell sx={stickyActionsBodySx} onClick={(event) => event.stopPropagation()}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-end"
                  spacing={0.25}
                  sx={{ width: '100%', minWidth: 0, overflow: 'hidden', flexWrap: 'nowrap' }}
                >
                  {isPayableInvoice(invoice) ? (
                    <Button
                      className="invoice-table-pay-now"
                      variant="onlyText"
                      onClick={() => onPayInvoice?.(invoice)}
                      endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                      sx={{
                        minWidth: 0,
                        height: 'auto',
                        py: 0.5,
                        px: 0,
                        fontSize: 13,
                        fontWeight: 600,
                        lineHeight: 1.25,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        flexShrink: 0,
                        border: 'none',
                        boxShadow: 'none',
                        '& .MuiButton-endIcon': { ml: 0.25, color: 'inherit' },
                        '&:hover': {
                          backgroundColor: 'transparent',
                          boxShadow: 'none',
                        },
                      }}
                    >
                      Pay now
                    </Button>
                  ) : null}
                  <InvoiceViewIconButton
                    label={`View invoice PDF ${invoice.invoiceNumber}`}
                    onClick={() => (onViewInvoiceDocument ?? onViewInvoice)?.(invoice)}
                  />
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
