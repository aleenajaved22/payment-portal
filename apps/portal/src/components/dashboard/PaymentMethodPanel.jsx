import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import CreditCardOutlined from '@mui/icons-material/CreditCardOutlined';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { CardHeading, GridCell } from './DashboardGrid';
import { Button } from '../design-system';
import { PAYMENT_METHOD_CATEGORIES } from '../../data/paymentMethodCategories';

/**
 * The default payment method, drawn as the card itself.
 *
 * The cell around it stays Swiss like every other band; the card artwork is the
 * one object on this page allowed to look like a physical thing, because that is
 * what makes it recognisable at a glance — an owner scanning for "is my card
 * still good" finds the rectangle faster than a line of text.
 *
 * It is drawn at the real ISO/IEC 7810 ID-1 ratio (85.6 × 53.98 mm) so it reads
 * as a card rather than a tinted box, and a muted video sits behind the artwork,
 * clipped by the card's own corners. The video is decoration: it carries no
 * information, so it is hidden from assistive tech and dropped entirely when the
 * viewer asks for reduced motion.
 *
 * Only a credit card gets the artwork. Bank transfer, PayPal and the rest have
 * no card face to draw, so they fall back to a labelled tile rather than a
 * pretend card.
 */

const CARD_RATIO = '85.6 / 53.98';
/** Sized to sit comfortably in the cell rather than fill it edge to edge. */
const CARD_MAX_WIDTH = 336;
/** Lifts the card off the band without reading as a drop-shadowed UI card. */
const CARD_SHADOW = '0px 6px 16px -4px rgba(16, 24, 40, 0.14), 0px 2px 6px -2px rgba(16, 24, 40, 0.08)';
/**
 * Pale mint, close to the footage's dominant tone — the card falls back to this
 * while the video loads and under reduced motion, so the dark ink below stays
 * readable whether or not the video ever paints.
 */
const CARD_FALLBACK = '#A6D7BD';
/**
 * One ink for everything on the card. A second, lighter tone for the small caps
 * labels would drop under 4.5:1 over the footage's mid-green, so the hierarchy
 * is carried by size, weight and letter-spacing instead of by colour.
 */
const CARD_INK = '#0A3A26';
/** The footage plays back faster than real time so it reads as lively rather than idle. */
const CARD_VIDEO_SPEED = 1.5;

function formatExpiry(details = {}) {
  const { expiryMonth, expiryYear } = details;
  if (!expiryMonth || !expiryYear) return null;
  return `${expiryMonth} / ${String(expiryYear).slice(-2)}`;
}

function CardFace({ method }) {
  const details = method.details ?? {};
  const brand = details.brand ? String(details.brand).toUpperCase() : 'CARD';
  const expiry = formatExpiry(details);

  /* playbackRate isn't a DOM attribute, so it can't be set declaratively — a
     callback ref sets it as soon as the element exists, and 'loadedmetadata'
     re-applies it because some browsers reset the rate once metadata loads. */
  const setVideoSpeed = useCallback((node) => {
    if (!node) return;
    node.playbackRate = CARD_VIDEO_SPEED;
    node.addEventListener('loadedmetadata', () => {
      node.playbackRate = CARD_VIDEO_SPEED;
    });
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: CARD_MAX_WIDTH,
        aspectRatio: CARD_RATIO,
        borderRadius: '12px',
        overflow: 'hidden',
        // Deep emerald rather than black: it is what shows while the video loads
        // and what the card falls back to under reduced motion.
        backgroundColor: CARD_FALLBACK,
        boxShadow: CARD_SHADOW,
      }}
    >
      <Box
        component="video"
        ref={setVideoSpeed}
        src="/emerald.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          // Nothing sits on top of the footage and nothing dims it — this is the
          // source's own colour. The blur stays only because the source carries a
          // word across its middle, which has no business on a payment card; the
          // scale hides the blur's soft edges outside the card.
          //
          // NOTE: without dimming, white text over the source's pale corner falls
          // to roughly 1.3:1. That is a contrast failure, kept deliberately while
          // the colour is being judged.
          filter: 'blur(26px)',
          transform: 'scale(1.9)',
          '@media (prefers-reduced-motion: reduce)': { display: 'none' },
        }}
      />

      <Stack sx={{ position: 'relative', height: '100%', p: '18px 20px' }}>
        <Stack direction="row" alignItems="center" spacing={1.25}>
          <Box sx={{ width: 34, height: 26, borderRadius: '4px', backgroundColor: '#C7A253', flexShrink: 0 }} />
          <Box sx={{ flex: 1 }} />
          <Typography sx={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.06em', color: CARD_INK }}>
            {brand}
          </Typography>
        </Stack>

        <Box sx={{ flex: 1 }} />

        <Typography
          sx={{
            fontSize: 17,
            fontWeight: 500,
            letterSpacing: '0.08em',
            fontVariantNumeric: 'tabular-nums',
            color: CARD_INK,
          }}
        >
          •••• •••• •••• {details.last4 ?? '••••'}
        </Typography>

        <Stack direction="row" alignItems="flex-end" spacing={1.5} sx={{ mt: 1.5 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: CARD_INK, opacity: 0.75 }}>
              Card holder
            </Typography>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: CARD_INK }} noWrap>
              {details.nameOnCard ?? '—'}
            </Typography>
          </Box>
          {expiry ? (
            <Box sx={{ textAlign: 'right' }}>
              <Typography sx={{ fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: CARD_INK, opacity: 0.75 }}>
                Expires
              </Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: CARD_INK }}>
                {expiry}
              </Typography>
            </Box>
          ) : null}
        </Stack>
      </Stack>
    </Box>
  );
}

function MethodTile({ method }) {
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={{
        maxWidth: CARD_MAX_WIDTH,
        p: '16px',
        borderRadius: '8px',
        border: `1px solid ${theme.palette.borderSubtle1}`,
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: theme.palette.textSecondary2,
          backgroundColor: theme.palette.surfaceGreySubtle,
        }}
      >
        <CreditCardOutlined sx={{ fontSize: 18 }} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 500, color: theme.palette.textPrimary }} noWrap>
          {method.label}
        </Typography>
        {method.subtitle ? (
          <Typography sx={{ fontSize: 12, color: theme.palette.textSecondary3 }} noWrap>
            {method.subtitle}
          </Typography>
        ) : null}
      </Box>
    </Stack>
  );
}

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

      <Box sx={{ width: '100%', maxWidth: CARD_MAX_WIDTH, mx: 'auto' }}>
      {!method ? (
        <Stack spacing={1.5} sx={{ py: 1 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: theme.palette.textPrimary }}>
            No payment method saved
          </Typography>
          <Typography sx={{ fontSize: 13, color: theme.palette.textSecondary3 }}>
            Add one so plan charges can settle automatically.
          </Typography>
          <Button variant="primary" onClick={onManage} sx={{ alignSelf: 'flex-start' }}>
            Add a payment method
          </Button>
        </Stack>
      ) : (
        <>
          {method.typeId === 'credit-card' ? <CardFace method={method} /> : <MethodTile method={method} />}

        </>
      )}
      </Box>
    </GridCell>
  );
}
