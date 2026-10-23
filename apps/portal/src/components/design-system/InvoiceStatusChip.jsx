import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { alpha } from '@mui/material/styles';
import { Chip } from '@signal/ui';
import { INVOICE_STATUS_COLORS } from '../../data/invoiceStatusColors';

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

function statusChipSx(dot, halo) {
  return {
    backgroundColor: `${halo} !important`,
    color: `${dot} !important`,
    '&.MuiChip-filled, &.MuiChip-filledDefault, &.MuiChip-filledWarning, &.MuiChip-colorWarning, &.MuiChip-filledError, &.MuiChip-colorError, &.MuiChip-filledSuccess, &.MuiChip-colorSuccess':
      {
        backgroundColor: `${halo} !important`,
        color: `${dot} !important`,
      },
    '& .MuiChip-label': {
      color: `${dot} !important`,
      fontWeight: '500 !important',
    },
  };
}

function paymentFailedLabel(status, dot, failureReason) {
  return (
    <Stack direction="row" alignItems="center" spacing={0.25} component="span" sx={{ minWidth: 0 }}>
      <Box component="span" sx={{ lineHeight: '18px' }}>
        {status}
      </Box>
      {failureReason ? (
        <Tooltip
          title={failureReason}
          placement="top"
          describeChild
          slotProps={{
            tooltip: {
              sx: { maxWidth: 320, whiteSpace: 'normal', lineHeight: 1.4 },
            },
          }}
        >
          <IconButton
            size="small"
            aria-label="Why payment failed"
            onClick={(event) => event.stopPropagation()}
            onMouseDown={(event) => event.stopPropagation()}
            sx={{
              width: 22,
              height: 22,
              p: 0,
              ml: 0.125,
              flexShrink: 0,
              borderRadius: '4px',
              color: dot,
              '& .MuiSvgIcon-root': {
                fontSize: '16px !important',
              },
              '&:hover': {
                backgroundColor: alpha(dot, 0.12),
                color: dot,
              },
            }}
          >
            <InfoOutlinedIcon />
          </IconButton>
        </Tooltip>
      ) : null}
    </Stack>
  );
}

export function InvoiceStatusChip({ status, failureReason }) {
  const colors = INVOICE_STATUS_COLORS[status];
  const showFailureInfo = status === 'Payment Failed' && Boolean(failureReason);

  if (colors) {
    const chipSx = {
      ...STATUS_CHIP_SX,
      ...statusChipSx(colors.dot, colors.halo),
      ...(showFailureInfo
        ? {
            pr: '6px !important',
            '& .MuiChip-label': {
              display: 'inline-flex',
              alignItems: 'center',
              lineHeight: '18px',
            },
          }
        : null),
    };
    const label = showFailureInfo
      ? paymentFailedLabel(status, colors.dot, failureReason)
      : status;

    return <Chip label={label} size="small" sx={chipSx} />;
  }

  return <Chip label={status} size="small" color="info" sx={STATUS_CHIP_SX} />;
}
