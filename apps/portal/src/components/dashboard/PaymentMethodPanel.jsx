import { useState } from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { CardHeading, GridCell } from './DashboardGrid';
import { FACE_MAX_WIDTH, PaymentMethodArtwork } from './PaymentMethodArtwork';
import { Button } from '../design-system';
import { PAYMENT_METHOD_CATEGORIES } from '../../data/paymentMethodCategories';

/**
 * The account's active payment method.
 *
 * The cell stays Swiss like every other band; the artwork inside it is the one
 * object on this page allowed to look like a physical thing, because that is
 * what makes it recognisable at a glance — an owner scanning for "what will be
 * charged" finds the rectangle faster than a line of text. Each type draws its
 * own; see [PaymentMethodArtwork].
 */

function typeTitle(typeId) {
  return PAYMENT_METHOD_CATEGORIES.find((category) => category.typeId === typeId)?.title ?? 'Payment method';
}

/**
 * Switcher for which saved method is active, with Manage as its last entry.
 *
 * Selecting here changes the default the account charges against, so the menu
 * carries the consequence rather than a settings page: the change is the point,
 * and Manage is the way out to everything else.
 */
function MethodMenu({ methods, activeId, onSelect, onManage }) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const close = () => setAnchorEl(null);

  return (
    <>
      <Button
        variant="tertiaryGrey"
        size="small"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        aria-haspopup="menu"
        aria-expanded={open ? 'true' : undefined}
        endIcon={<UnfoldMoreIcon sx={{ fontSize: 15 }} />}
        sx={{
          color: theme.palette.textBrand,
          minWidth: 'auto',
          px: 0.75,
          py: 0.25,
          fontSize: 13,
          lineHeight: '18px',
          '& .MuiButton-endIcon': { ml: 0.5 },
        }}
      >
        Change
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { mt: 0.5, minWidth: 264, borderRadius: '8px' } } }}
      >
        {methods.map((entry) => {
          const isActive = entry.id === activeId;
          return (
            <MenuItem
              key={entry.id}
              selected={isActive}
              onClick={() => {
                onSelect(entry.id);
                close();
              }}
              sx={{ py: 1, alignItems: 'flex-start' }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 500, color: theme.palette.textPrimary }} noWrap>
                  {typeTitle(entry.typeId)}
                </Typography>
                <Typography sx={{ fontSize: 12, color: theme.palette.textSecondary3 }} noWrap>
                  {[entry.label, entry.subtitle].filter(Boolean).join(' · ')}
                </Typography>
              </Box>
              {isActive ? (
                <CheckIcon sx={{ ml: 1.5, fontSize: 18, color: theme.palette.textBrand, flexShrink: 0 }} />
              ) : null}
            </MenuItem>
          );
        })}

        <MenuItem
          onClick={() => {
            close();
            onManage();
          }}
          sx={{ py: 1.25, gap: 1.25, mt: 0.5 }}
        >
          <SettingsOutlinedIcon sx={{ fontSize: 18, color: theme.palette.textSecondary2 }} />
          <Typography sx={{ fontSize: 13, fontWeight: 500, color: theme.palette.textPrimary }}>
            Manage payment methods
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
}

export function PaymentMethodPanel({
  method,
  methods = [],
  onSelectMethod,
  onManage,
  flex = 1,
  last = false,
  sx,
}) {
  const theme = useTheme();
  const methodCount = methods.length;

  return (
    <GridCell flex={flex} last={last} sx={sx}>
      <CardHeading
        title="Active Payment Method"
        action={
          methodCount > 0 ? (
            <MethodMenu
              methods={methods}
              activeId={method?.id}
              onSelect={onSelectMethod}
              onManage={onManage}
            />
          ) : null
        }
      />

      <Box sx={{ width: '100%', maxWidth: FACE_MAX_WIDTH, mx: 'auto' }}>
        {!method ? (
          <Stack spacing={1.5} sx={{ py: 1 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: theme.palette.textPrimary }}>
              No payment method saved
            </Typography>
            <Typography sx={{ fontSize: 13, color: theme.palette.textSecondary2 }}>
              Add one so plan charges can settle automatically.
            </Typography>
            <Button variant="primary" onClick={onManage} sx={{ alignSelf: 'flex-start' }}>
              Add a payment method
            </Button>
          </Stack>
        ) : (
          <PaymentMethodArtwork method={method} />
        )}
      </Box>
    </GridCell>
  );
}
