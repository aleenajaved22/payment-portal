import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { alpha, useTheme } from '@mui/material/styles';
import { Button } from '@signal/ui';
import { Checkbox } from './Checkbox';
import { ContractChip } from './ContractChip';
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
  const actionsColumnWidth = 70;
  // Filters sits between Contract and Amount: what the visit replaced, then
  // what it cost.
  const dataColumnCount = 7;
  const fixedColumnsWidth = checkboxColumnWidth + actionsColumnWidth;
  const equalDataColumnWidth = `calc((100% - ${fixedColumnsWidth}px) / ${dataColumnCount})`;
  const tableMinWidth = 1200;

  const equalDataColumnSx = {
    width: equalDataColumnWidth,
    minWidth: equalDataColumnWidth,
    maxWidth: equalDataColumnWidth,
    boxSizing: 'border-box',
  };

  const amountCellSx = {
    ...equalDataColumnSx,
    whiteSpace: 'nowrap',
  };

  const statusCellSx = {
    ...equalDataColumnSx,
    whiteSpace: 'nowrap',
  };

  /* A count, so it is tabular and ranged right — the eye compares the column
     rather than reading each figure. */
  const filtersCellSx = {
    ...equalDataColumnSx,
    whiteSpace: 'nowrap',
    textAlign: 'right',
    fontVariantNumeric: 'tabular-nums',
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

  const stickyEdgeShadow = '4px 0 8px -4px rgba(16, 24, 40, 0.08)';

  const stickyCheckboxHeaderSx = {
    ...checkboxHeaderCellSx,
    position: 'sticky',
    left: 0,
    zIndex: 3,
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
    ...equalDataColumnSx,
    position: 'sticky',
    left: checkboxColumnWidth,
    zIndex: 3,
    boxShadow: stickyEdgeShadow,
  };

  const stickyInvoiceBodySx = {
    ...equalDataColumnSx,
    position: 'sticky',
    left: checkboxColumnWidth,
    zIndex: 2,
    px: cellPaddingX,
    py: bodyCellPy,
    borderBottom: `1px solid ${theme.palette.borderSubtle1}`,
    backgroundColor: theme.palette.surfaceWhite,
    boxShadow: stickyEdgeShadow,
    'tbody tr:hover &': {
      backgroundColor: rowHoverBackground,
    },
  };

  const stickyRightEdgeShadow = '-4px 0 8px -4px rgba(16, 24, 40, 0.08)';

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
    boxShadow: stickyRightEdgeShadow,
  };

  const stickyActionsBodySx = {
    position: 'sticky',
    right: 0,
    zIndex: 2,
    width: actionsColumnWidth,
    minWidth: actionsColumnWidth,
    maxWidth: actionsColumnWidth,
    boxSizing: 'border-box',
    px: 1.5,
    py: bodyCellPy,
    textAlign: 'right',
    verticalAlign: 'middle',
    overflow: 'visible',
    borderBottom: `1px solid ${theme.palette.borderSubtle1}`,
    backgroundColor: theme.palette.surfaceWhite,
    boxShadow: stickyRightEdgeShadow,
    'tbody tr:hover &': {
      backgroundColor: rowHoverBackground,
    },
  };

  const payNowHoverRowSx = {
    '& .invoice-table-pay-now': {
      maxWidth: 0,
      opacity: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      paddingLeft: 0,
      paddingRight: 0,
      minWidth: 0,
      transition: 'opacity 0.15s ease, max-width 0.2s ease, padding 0.2s ease',
    },
    '&:hover .invoice-table-pay-now, &:focus-within .invoice-table-pay-now': {
      maxWidth: 120,
      opacity: 1,
      pointerEvents: 'auto',
      paddingLeft: '6px',
      paddingRight: '6px',
    },
    '@media (hover: none)': {
      '& .invoice-table-pay-now': {
        maxWidth: 120,
        opacity: 1,
        pointerEvents: 'auto',
        paddingLeft: '6px',
        paddingRight: '6px',
      },
    },
  };

  const isPayableInvoice = (invoice) =>
    invoice.status === 'Pending' || invoice.status === 'Overdue';

  return (
    <TableContainer sx={{ overflowX: 'auto', maxWidth: '100%' }}>
      <Table sx={{ tableLayout: 'fixed', width: '100%', minWidth: tableMinWidth }}>
        <colgroup>
          <col style={{ width: checkboxColumnWidth }} />
          {Array.from({ length: dataColumnCount }, (_, index) => (
            <col key={`data-col-${index}`} style={{ width: equalDataColumnWidth }} />
          ))}
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
            <TableCell sx={{ ...headerCellSx, ...equalDataColumnSx }} sortDirection={sortField === 'site' ? sortDirection : false}>
              <TableSortLabel
                active={sortField === 'site'}
                direction={sortField === 'site' ? sortDirection : 'desc'}
                onClick={() => onSort('site')}
                sx={sortLabelSx}
              >
                Site Name
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ ...headerCellSx, ...equalDataColumnSx }} sortDirection={sortField === 'contract' ? sortDirection : false}>
              <TableSortLabel
                active={sortField === 'contract'}
                direction={sortField === 'contract' ? sortDirection : 'desc'}
                onClick={() => onSort('contract')}
                sx={sortLabelSx}
              >
                Contract
              </TableSortLabel>
            </TableCell>
            <TableCell
              sx={{ ...headerCellSx, ...filtersCellSx }}
              sortDirection={sortField === 'filterCount' ? sortDirection : false}
            >
              <TableSortLabel
                active={sortField === 'filterCount'}
                direction={sortField === 'filterCount' ? sortDirection : 'desc'}
                onClick={() => onSort('filterCount')}
                sx={sortLabelSx}
              >
                Filters
              </TableSortLabel>
            </TableCell>
            <TableCell
              sx={{ ...headerCellSx, ...amountCellSx }}
              sortDirection={sortField === 'amount' ? sortDirection : false}
            >
              <TableSortLabel
                active={sortField === 'amount'}
                direction={sortField === 'amount' ? sortDirection : 'desc'}
                onClick={() => onSort('amount')}
                sx={sortLabelSx}
              >
                Amount
              </TableSortLabel>
            </TableCell>
            <TableCell
              sx={{ ...headerCellSx, ...statusCellSx }}
              sortDirection={sortField === 'status' ? sortDirection : false}
            >
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
              sx={{ ...headerCellSx, ...equalDataColumnSx, whiteSpace: 'nowrap' }}
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
              <TableCell sx={equalDataColumnSx}>
                <Typography variant="body2" sx={{ ...secondaryCellTextSx, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {invoice.site}
                </Typography>
              </TableCell>
              <TableCell sx={{ verticalAlign: 'middle', ...equalDataColumnSx }}>
                <ContractChip label={invoice.contract} />
              </TableCell>
              <TableCell sx={filtersCellSx}>
                <Typography
                  variant="body2"
                  sx={{ ...secondaryCellTextSx, fontVariantNumeric: 'tabular-nums' }}
                >
                  {invoice.filterCount ?? '—'}
                </Typography>
              </TableCell>
              <TableCell sx={amountCellSx}>
                <Typography variant="body2" sx={secondaryCellTextSx}>
                  {invoice.amount}
                </Typography>
              </TableCell>
              <TableCell sx={{ verticalAlign: 'middle', ...statusCellSx }}>
                <InvoiceStatusChip status={invoice.status} />
              </TableCell>
              <TableCell sx={{ ...equalDataColumnSx, whiteSpace: 'nowrap' }}>
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
              <TableCell
                sx={stickyActionsBodySx}
                onClick={(event) => event.stopPropagation()}
              >
                <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0.75}>
                  {isPayableInvoice(invoice) ? (
                    <Button
                      className="invoice-table-pay-now"
                      variant="onlyText"
                      onClick={() => onPayInvoice?.(invoice)}
                      endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                      sx={{
                        minWidth: 'auto',
                        height: 'auto',
                        py: 0.5,
                        fontSize: 13,
                        fontWeight: 600,
                        lineHeight: 1.25,
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        border: 'none',
                        boxShadow: 'none',
                        '& .MuiButton-endIcon': { ml: 0.5, color: 'inherit' },
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
