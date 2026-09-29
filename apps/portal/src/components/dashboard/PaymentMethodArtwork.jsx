import { useCallback } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import { PaymentMethodLogoIcon } from '../payment-method-logos';
import { PaypalLogo, VenmoLogo, ZelleLogo } from '../payment-method-logos';

/**
 * The active payment method, drawn as the thing it actually is.
 *
 * Only the credit card used to get artwork; everything else fell back to one
 * grey tile with a generic card glyph on it, so a PayPal account and a bank
 * account were indistinguishable at a glance and both were mislabelled by the
 * icon. This file gives each type its own face.
 *
 * They are a family, not five separate designs. Every face is the same object:
 * the real ISO/IEC 7810 ID-1 rectangle (85.6 × 53.98 mm), the same radius, the
 * same shadow, the same padding, and the same three zones —
 *
 *   top     a mark in a fixed 36 × 28 slot, and the type named in small caps
 *   middle  the one identifier you would read out loud, at 17px
 *   bottom  up to two label-over-value pairs, the second right-aligned
 *
 * — so what changes between them is the surface and the content, never the
 * structure. The card has a gold chip in that top slot; the cheque has a bank
 * glyph; the wallets have their logo on a white tile. Same position, same size,
 * different object.
 *
 * Why these particular surfaces:
 *
 *   credit card   the card, because that is what is in the wallet
 *   bank account  a cheque, because the routing and account numbers people type
 *                 are the ones they read off the bottom of one
 *   wallets       the brand's own colour, because PayPal, Zelle and Venmo are
 *                 accounts rather than objects, and the brand is the whole of
 *                 how they are recognised
 *
 * Contrast: the wallet faces put white on deep brand colour and the cheque puts
 * near-black on paper, so all four new faces clear AA comfortably. The card's
 * own dark-ink-over-pale-video failure is pre-existing and deliberate, kept
 * while that colour is being judged.
 */

const FACE_RATIO = '85.6 / 53.98';
/** Sized to sit comfortably in the cell rather than fill it edge to edge. */
export const FACE_MAX_WIDTH = 336;
/** Lifts the face off the band without reading as a drop-shadowed UI card. */
const FACE_SHADOW = '0px 6px 16px -4px rgba(16, 24, 40, 0.14), 0px 2px 6px -2px rgba(16, 24, 40, 0.08)';
const FACE_RADIUS = '12px';
/** The chip's footprint. Every face puts something different in it. */
const MARK_SLOT = { width: 36, height: 28 };

/* ------------------------------------------------------------------ shell */

/**
 * `backdrop` is deliberately a separate slot rather than just more children.
 *
 * Anything painted behind the content is absolutely positioned, and an
 * absolutely positioned element paints above its statically positioned
 * siblings whatever the DOM order. Passed as a child it therefore covers the
 * text — which is exactly what happened to the card: chip, brand, number,
 * holder and expiry all disappeared under the blurred video. Rendering it
 * before the relatively positioned content stack puts it back underneath.
 */
function Face({ ink, surface, backdrop = null, children, ...rest }) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: FACE_MAX_WIDTH,
        aspectRatio: FACE_RATIO,
        borderRadius: FACE_RADIUS,
        overflow: 'hidden',
        color: ink,
        ...surface,
      }}
      {...rest}
    >
      {backdrop}
      <Stack sx={{ position: 'relative', height: '100%', p: '18px 20px' }}>{children}</Stack>
    </Box>
  );
}

/** Top zone: the mark, then the type named in text beside it. */
function FaceHeader({ mark, type }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1.25}>
      <Box
        sx={{
          width: MARK_SLOT.width,
          height: MARK_SLOT.height,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {mark}
      </Box>
      <Box sx={{ flex: 1 }} />
      <Typography
        sx={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', color: 'inherit', whiteSpace: 'nowrap' }}
      >
        {type}
      </Typography>
    </Stack>
  );
}

/** The identifier, at the step the card's PAN already uses. */
function FaceHero({ children, mono = false, sx }) {
  return (
    <Typography
      sx={{
        fontSize: 17,
        fontWeight: 500,
        letterSpacing: mono ? '0.08em' : '0.01em',
        fontVariantNumeric: 'tabular-nums',
        color: 'inherit',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        ...sx,
      }}
    >
      {children}
    </Typography>
  );
}

/**
 * Bottom zone: up to two label-over-value pairs. The second is right-aligned, so
 * whatever a type happens to carry lands on the same two axes the card's holder
 * and expiry already sit on.
 */
function FaceFooter({ items = [] }) {
  const present = items.filter((item) => item && item.value);
  if (present.length === 0) return null;

  return (
    <Stack direction="row" alignItems="flex-end" spacing={1.5} sx={{ mt: 1.5 }}>
      {present.map((item, index) => {
        const isTrailing = index > 0 && present.length > 1;
        return (
          <Box
            key={item.label}
            sx={{
              minWidth: 0,
              flex: isTrailing ? '0 0 auto' : 1,
              textAlign: isTrailing ? 'right' : 'left',
            }}
          >
            <Typography
              sx={{
                fontSize: 9,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'inherit',
                opacity: 0.75,
              }}
            >
              {item.label}
            </Typography>
            <Typography
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isTrailing ? 'flex-end' : 'flex-start',
                gap: 0.625,
                fontSize: 12,
                fontWeight: 600,
                fontVariantNumeric: 'tabular-nums',
                color: 'inherit',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {/* A state reads as a state, not as another field value. */}
              {item.dot ? (
                <Box
                  component="span"
                  aria-hidden
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    flexShrink: 0,
                    backgroundColor: 'currentColor',
                  }}
                />
              ) : null}
              {item.value}
            </Typography>
          </Box>
        );
      })}
    </Stack>
  );
}

/* ------------------------------------------------------------- credit card */

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
    <Face
      ink={CARD_INK}
      surface={{
        // Deep emerald rather than black: it is what shows while the video loads
        // and what the card falls back to under reduced motion.
        backgroundColor: CARD_FALLBACK,
        boxShadow: FACE_SHADOW,
      }}
      backdrop={
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
            // Nothing sits on top of the footage and nothing dims it — this is
            // the source's own colour. The blur stays only because the source
            // carries a word across its middle, which has no business on a
            // payment card; the scale hides the blur's soft edges outside it.
            //
            // NOTE: without dimming, white text over the source's pale corner
            // falls to roughly 1.3:1. That is a contrast failure, kept
            // deliberately while the colour is being judged.
            filter: 'blur(26px)',
            transform: 'scale(1.9)',
            '@media (prefers-reduced-motion: reduce)': { display: 'none' },
          }}
        />
      }
    >
      <FaceHeader
        type={brand}
        mark={<Box sx={{ width: 34, height: 26, borderRadius: '4px', backgroundColor: '#C7A253' }} />}
      />

      <Box sx={{ flex: 1 }} />

      <FaceHero mono>•••• •••• •••• {details.last4 ?? '••••'}</FaceHero>

      <FaceFooter
        items={[
          { label: 'Card holder', value: details.nameOnCard },
          { label: 'Expires', value: formatExpiry(details) },
        ]}
      />
    </Face>
  );
}

/* -------------------------------------------------------------- bank / ACH */

const CHEQUE_PAPER = '#FBFAF5';
const CHEQUE_INK = '#1F2A24';

/**
 * A cheque, because that is the object the numbers come from.
 *
 * Nobody memorises a routing number; they read it off the bottom of a cheque,
 * which is why the two figures sit in a banded strip along the foot of this face
 * rather than in the ordinary footer the other types use. The strip is where a
 * real cheque's MICR line lives.
 *
 * The hatching is security-paper, drawn at ~4% so it reads as texture at arm's
 * length and never competes with the ink.
 */
function ChequeFace({ method }) {
  const theme = useTheme();
  const details = method.details ?? {};

  return (
    <Face
      ink={CHEQUE_INK}
      surface={{
        backgroundColor: CHEQUE_PAPER,
        backgroundImage:
          'repeating-linear-gradient(135deg, rgba(31, 42, 36, 0.05) 0 1px, transparent 1px 8px)',
        border: `1px solid ${theme.palette.borderSubtle2}`,
        boxShadow: FACE_SHADOW,
      }}
    >
      <FaceHeader
        type="ACH"
        mark={
          <Box
            sx={{
              width: MARK_SLOT.width,
              height: MARK_SLOT.height,
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: CHEQUE_PAPER,
              backgroundColor: CHEQUE_INK,
            }}
          >
            <AccountBalanceOutlinedIcon sx={{ fontSize: 18 }} />
          </Box>
        }
      />

      <Box sx={{ flex: 1 }} />

      {/* Label over value, like every other pair in the family — and like the
          "pay to the order of" line this is standing in for. */}
      <Typography
        sx={{
          fontSize: 9,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'inherit',
          opacity: 0.6,
        }}
      >
        Account holder
      </Typography>
      <FaceHero sx={{ fontWeight: 600 }}>{details.accountHolderName || 'Bank account'}</FaceHero>

      {/* The MICR band. Ruled off, tinted, and set in mono — the line you would
          actually be reading if this were paper. */}
      <Stack
        direction="row"
        alignItems="flex-end"
        spacing={2}
        sx={{
          mt: 1.5,
          mx: '-20px',
          mb: '-18px',
          px: '20px',
          py: '9px',
          borderTop: `1px solid rgba(31, 42, 36, 0.18)`,
          backgroundColor: 'rgba(31, 42, 36, 0.05)',
        }}
      >
        {[
          { label: 'Routing', value: details.routingNumber || '—' },
          { label: 'Account', value: details.accountLast4 ? `••••${details.accountLast4}` : '—' },
        ].map((item, index) => (
          <Box key={item.label} sx={{ minWidth: 0, flex: index === 0 ? 1 : '0 0 auto' }}>
            <Typography
              sx={{
                fontSize: 9,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'inherit',
                opacity: 0.6,
              }}
            >
              {item.label}
            </Typography>
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.06em',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                color: 'inherit',
              }}
            >
              {item.value}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Face>
  );
}

/* ----------------------------------------------------------------- wallets */

/**
 * Each wallet in its own colour, because the brand is the whole of how these are
 * recognised — an email address on a grey tile tells you nothing about who will
 * be charged.
 *
 * `base` is the resting surface, `bloom` a single soft highlight in the top-left
 * corner. That corner is where the card's own footage is brightest, so the light
 * falls the same way across the whole family. Logos sit on a white tile because
 * a brand mark printed on its own brand colour disappears.
 */
const WALLETS = {
  paypal: {
    type: 'PAYPAL',
    base: '#012169',
    bloom: 'rgba(0, 156, 222, 0.62)',
    Logo: PaypalLogo,
    /* Each mark is drawn to a different share of its 32-unit box — PayPal's
       double-P is short and wide, Zelle's Z fills the square, Venmo's flourish
       is a thin diagonal. Without a per-brand scale they come out at three
       different optical sizes in the same tile. */
    logoScale: 1.6,
    hero: (details) => details.email || 'PayPal',
    footer: () => [{ label: 'Wallet', value: 'Connected', dot: true }],
  },
  zelle: {
    type: 'ZELLE',
    base: '#5312A8',
    bloom: 'rgba(146, 84, 232, 0.66)',
    Logo: ZelleLogo,
    logoScale: 1,
    hero: (details) => details.contact || 'Zelle',
    footer: (details) => [
      { label: 'Nickname', value: details.nickname },
      { label: 'Sends to', value: details.contact?.includes('@') ? 'Email' : 'Mobile' },
    ],
  },
  venmo: {
    type: 'VENMO',
    base: '#0A5FC0',
    bloom: 'rgba(0, 140, 255, 0.66)',
    Logo: VenmoLogo,
    logoScale: 1.5,
    hero: (details) => {
      const username = details.username?.trim();
      if (!username) return 'Venmo';
      return username.startsWith('@') ? username : `@${username}`;
    },
    footer: (details) => [{ label: 'Mobile', value: details.phone }],
  },
};

function WalletFace({ method, wallet }) {
  const details = method.details ?? {};

  return (
    <Face
      ink="#FFFFFF"
      surface={{
        backgroundColor: wallet.base,
        backgroundImage: `radial-gradient(120% 130% at 14% 6%, ${wallet.bloom} 0%, transparent 58%)`,
        boxShadow: FACE_SHADOW,
      }}
    >
      <FaceHeader
        type={wallet.type}
        mark={
          <Box
            aria-hidden
            sx={{
              width: MARK_SLOT.width,
              height: MARK_SLOT.height,
              borderRadius: '7px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#FFFFFF',
              // The scaled mark can run wider than the tile; clipping keeps the
              // tile's own silhouette clean.
              overflow: 'hidden',
            }}
          >
            <PaymentMethodLogoIcon Logo={wallet.Logo} size={Math.round(28 * wallet.logoScale)} />
          </Box>
        }
      />

      <Box sx={{ flex: 1 }} />

      <FaceHero>{wallet.hero(details)}</FaceHero>

      <FaceFooter items={wallet.footer(details)} />
    </Face>
  );
}

/* -------------------------------------------------------------- fallback */

/** An unrecognised type still gets a rectangle, just an unbranded one. */
function GenericFace({ method }) {
  const theme = useTheme();

  return (
    <Face
      ink={theme.palette.textPrimary}
      surface={{
        backgroundColor: theme.palette.surfaceGreySubtle,
        border: `1px solid ${theme.palette.borderSubtle1}`,
      }}
    >
      <FaceHeader type="Method" mark={null} />
      <Box sx={{ flex: 1 }} />
      <FaceHero>{method.label ?? 'Payment method'}</FaceHero>
      <FaceFooter items={[{ label: 'Details', value: method.subtitle }]} />
    </Face>
  );
}

export function PaymentMethodArtwork({ method }) {
  if (!method) return null;
  if (method.typeId === 'credit-card') return <CardFace method={method} />;
  if (method.typeId === 'ach') return <ChequeFace method={method} />;

  const wallet = WALLETS[method.typeId];
  if (wallet) return <WalletFace method={method} wallet={wallet} />;

  return <GenericFace method={method} />;
}
