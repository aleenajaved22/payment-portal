import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useMemo, useState } from 'react';
import { semantic } from '@signal/design-tokens/colors';
import { Checkbox } from './design-system/Checkbox';
import { ContractChip } from './design-system/ContractChip';
import { InvoiceViewIconButton } from './InvoiceViewIconButton';
import { INVOICE_OVERDUE_ORANGE, INVOICE_PAID_DOT, INVOICE_PAID_HALO } from '../data/invoiceStatusColors';
import { formatInvoiceDueDate } from '../data/mockInvoices';

const BOARD_SECTIONS = [
  {
    status: 'Overdue',
    title: 'OVERDUE',
    badgeBg: semantic.surface.alertSubtle,
    badgeColor: semantic.text.alert,
  },
  {
    status: 'Pending',
    title: 'PENDING',
    badgeBg: semantic.surface.warningSubtle,
    badgeColor: semantic.status.onSubtle.warning,
  },
  {
    status: 'Paid',
    title: 'PAID',
    badgeBg: INVOICE_PAID_HALO,
    badgeColor: INVOICE_PAID_DOT,
  },
];

const checkboxSx = {
  p: 0,
  width: 16,
  height: 16,
  '& .MuiSvgIcon-root': { fontSize: 16 },
};

function LabeledField({ label, value, size = 'md', valueSx = {} }) {
  const theme = useTheme();
  const fontSize = size === 'sm' ? 13 : 14;

  return (
    <Typography sx={{ fontSize, lineHeight: 1.4, color: theme.palette.textPrimary }}>
      <Box component="span" sx={{ color: theme.palette.textSecondary3, fontWeight: 400 }}>
        {label}:{' '}
      </Box>
      <Box component="span" sx={{ fontWeight: 500, ...valueSx }}>
        {value}
      </Box>
    </Typography>
  );
}

function InvoiceBoardRow({ invoice, selected, onToggle, onOpen, showDivider = true }) {
  const theme = useTheme();
  const isSelectable = invoice.status !== 'Paid';
  const isPaid = invoice.status === 'Paid';
  const isClickable =
    invoice.status === 'Pending' || invoice.status === 'Overdue' || isPaid;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        px: 2,
        py: 1.25,
        backgroundColor: theme.palette.surfaceWhite,
        borderBottom: showDivider ? `1px solid ${theme.palette.borderSubtle1}` : 'none',
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'background-color 0.15s ease',
        '&:hover': isClickable
          ? { backgroundColor: theme.palette.surfaceGreySubtle }
          : {},
      }}
      onClick={() => {
        if (isClickable) onOpen?.(invoice);
      }}
    >
      <Box onClick={(event) => event.stopPropagation()}>
        <Checkbox
          size="small"
          disableRipple
          checked={selected}
          disabled={!isSelectable}
          onChange={() => onToggle?.(invoice.id)}
          inputProps={{ 'aria-label': `Select invoice ${invoice.invoiceNumber}` }}
          sx={{
            ...checkboxSx,
            '&.Mui-disabled': { color: theme.palette.action.disabled },
          }}
        />
      </Box>

      <Box sx={{ flex: 1, minWidth: 140 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 600, color: theme.palette.textPrimary, lineHeight: 1.3 }}>
          {invoice.amount}
        </Typography>
        <Box sx={{ mt: 0.25 }}>
          <LabeledField
            label="Invoice No"
            value={invoice.invoiceNumber}
            size="sm"
            valueSx={{ color: theme.palette.textSecondary2, fontWeight: 400 }}
          />
        </Box>
      </Box>

      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ flexShrink: 0, display: { xs: 'none', md: 'flex' } }}
      >
        <LabeledField label="Site" value={invoice.site} />
        <Box sx={{ minWidth: 160, maxWidth: 200 }}>
          <ContractChip label={invoice.contract} />
        </Box>
        <LabeledField
          label="Due Date"
          value={formatInvoiceDueDate(invoice.dueDate)}
          valueSx={
            invoice.status === 'Overdue'
              ? { color: INVOICE_OVERDUE_ORANGE, fontWeight: 500 }
              : { color: theme.palette.textSecondary2, fontWeight: 400 }
          }
        />
      </Stack>

      {isPaid ? (
        <Box
          sx={{ flexShrink: 0, display: { xs: 'none', md: 'block' } }}
          onClick={(event) => event.stopPropagation()}
        >
          <InvoiceViewIconButton
            label={`View invoice ${invoice.invoiceNumber}`}
            onClick={() => onOpen?.(invoice)}
          />
        </Box>
      ) : null}

      <Stack spacing={0.25} sx={{ display: { xs: 'flex', md: 'none' }, flex: 1, minWidth: 0, alignItems: 'flex-end' }}>
        <LabeledField label="Site" value={invoice.site} size="sm" />
        <LabeledField
          label="Due Date"
          value={formatInvoiceDueDate(invoice.dueDate)}
          size="sm"
          valueSx={
            invoice.status === 'Overdue'
              ? { color: INVOICE_OVERDUE_ORANGE, fontWeight: 500 }
              : { color: theme.palette.textSecondary3, fontWeight: 400 }
          }
        />
      </Stack>
    </Box>
  );
}

function InvoiceBoardSection({ section, invoices, selectedIds, onToggleRow, onViewInvoice }) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(true);

  if (invoices.length === 0) return null;

  const invoiceCountLabel = `${invoices.length} INVOICE${invoices.length === 1 ? '' : 'S'}`;

  return (
    <Box sx={{ mb: 2.5 }}>
      <Stack direction="row" alignItems="center" sx={{ mb: expanded ? 0.75 : 0 }}>
        <Box
          component="button"
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            px: 1.25,
            py: 0.5,
            borderRadius: '9999px',
            border: `1px solid ${theme.palette.borderSubtle1}`,
            backgroundColor: section.badgeBg,
            cursor: 'pointer',
            font: 'inherit',
          }}
        >
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: section.badgeColor,
            }}
          >
            {section.title}
          </Typography>
          <Box
            aria-hidden
            sx={{
              width: '1px',
              height: 14,
              flexShrink: 0,
              backgroundColor: theme.palette.borderSubtle1,
            }}
          />
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.08em',
              color: theme.palette.textSecondary3,
            }}
          >
            {invoiceCountLabel}
          </Typography>
          <ChevronRightIcon
            sx={{
              fontSize: 18,
              color: section.badgeColor,
              transition: 'transform 0.2s ease',
              transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
            }}
          />
        </Box>
      </Stack>

      {expanded
        ? invoices.map((invoice, index) => (
            <InvoiceBoardRow
              key={invoice.id}
              invoice={invoice}
              selected={selectedIds.includes(invoice.id)}
              onToggle={onToggleRow}
              onOpen={onViewInvoice}
              showDivider={index < invoices.length - 1}
            />
          ))
        : null}
    </Box>
  );
}

export function InvoiceBoardList({ invoices, selectedIds, onToggleRow, onViewInvoice }) {
  const theme = useTheme();

  const byStatus = useMemo(() => {
    const map = { Overdue: [], Pending: [], Paid: [] };
    invoices.forEach((invoice) => {
      if (map[invoice.status]) map[invoice.status].push(invoice);
    });
    return map;
  }, [invoices]);

  const hasAny = BOARD_SECTIONS.some((section) => byStatus[section.status]?.length > 0);

  if (!hasAny) {
    return (
      <Typography sx={{ fontSize: 14, color: theme.palette.textSecondary3, py: 4, textAlign: 'center' }}>
        No invoices match your filters.
      </Typography>
    );
  }

  return (
    <Box>
      {BOARD_SECTIONS.map((section) => (
        <InvoiceBoardSection
          key={section.status}
          section={section}
          invoices={byStatus[section.status] ?? []}
          selectedIds={selectedIds}
          onToggleRow={onToggleRow}
          onViewInvoice={onViewInvoice}
        />
      ))}
    </Box>
  );
}
