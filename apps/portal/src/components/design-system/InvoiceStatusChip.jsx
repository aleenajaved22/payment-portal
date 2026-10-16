import { primitive, semantic } from '@signal/design-tokens/colors';
import { Chip } from '@signal/ui';

const STATUS_COLOR = {
  Paid: 'success',
  Pending: 'warning',
  Overdue: 'error',
  'Payment Failed': 'error',
};

const STATUS_CHIP_SX = {
  height: 'auto',
  minHeight: 26,
  width: 'max-content',
  maxWidth: 'none',
  flexShrink: 0,
  pl: '10px !important',
  pr: '10px !important',
  py: '4px !important',
  gap: 0,
  textTransform: 'none',
  '& .MuiChip-label': {
    pl: '0 !important',
    pr: '0 !important',
    py: 0,
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'visible',
  },
};

/** Darker warning label on warningSubtle — meets WCAG AA vs #DC6803 on #FEF0C7 (~3:1). */
const PENDING_CHIP_SX = {
  backgroundColor: `${semantic.surface.warningSubtle} !important`,
  color: `${primitive.orange[800]} !important`,
  '&.MuiChip-filledWarning': {
    backgroundColor: `${semantic.surface.warningSubtle} !important`,
    color: `${primitive.orange[800]} !important`,
  },
  '& .MuiChip-label': {
    color: `${primitive.orange[800]} !important`,
  },
};

export function InvoiceStatusChip({ status }) {
  const chipColor = STATUS_COLOR[status] || 'info';
  const sx = {
    ...STATUS_CHIP_SX,
    ...(status === 'Pending' ? PENDING_CHIP_SX : {}),
  };

  return <Chip label={status} size="small" color={chipColor} sx={sx} />;
}
