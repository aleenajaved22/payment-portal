import Box from '@mui/material/Box';
import { PAYMENT_METHOD_LOGO_SIZE } from './payment-method-logos';
import amexMark from '../assets/payment-brands/amex.svg';
import discoverMark from '../assets/payment-brands/discover.svg';
import mastercardMark from '../assets/payment-brands/mastercard.svg';
import paypalMark from '../assets/payment-brands/paypal.svg';
import visaMark from '../assets/payment-brands/visa.svg';

/**
 * Official brand marks, used as payment-acceptance marks.
 * Keyed by the brand id `detectCardBrand` returns, plus the wallet types.
 */
export const PAYMENT_BRAND_MARKS = {
  visa: { src: visaMark, label: 'Visa' },
  mastercard: { src: mastercardMark, label: 'Mastercard' },
  amex: { src: amexMark, label: 'American Express' },
  discover: { src: discoverMark, label: 'Discover' },
  paypal: { src: paypalMark, label: 'PayPal' },
};

export function getPaymentBrandMark(brandId) {
  return PAYMENT_BRAND_MARKS[brandId] ?? null;
}

/**
 * Fixed slot so every mark occupies the same footprint regardless of its own
 * aspect ratio — wide wordmarks fill the width, square marks fill the height.
 */
export const BRAND_SLOT = { width: 44, height: 20 };

export function PaymentBrandMark({ brandId, label, fit = 'slot' }) {
  const mark = getPaymentBrandMark(brandId);
  if (!mark) return null;

  const inTile = fit === 'tile';

  return (
    <Box
      component="img"
      src={mark.src}
      alt={label ?? mark.label}
      sx={{
        width: inTile ? PAYMENT_METHOD_LOGO_SIZE : BRAND_SLOT.width,
        height: inTile ? PAYMENT_METHOD_LOGO_SIZE : BRAND_SLOT.height,
        objectFit: 'contain',
        objectPosition: 'center',
        display: 'block',
        flexShrink: 0,
      }}
    />
  );
}
