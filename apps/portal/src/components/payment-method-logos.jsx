import Box from '@mui/material/Box';

export function PaymentMethodLogoIcon({ Logo, size = 32 }) {
  return (
    <Box
      component="span"
      aria-hidden
      sx={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        lineHeight: 0,
        overflow: 'hidden',
        '& svg': {
          width: size,
          height: size,
          minWidth: size,
          minHeight: size,
          display: 'block',
          flexShrink: 0,
        },
      }}
    >
      <Logo />
    </Box>
  );
}

const logoSvgProps = {
  viewBox: '0 0 32 32',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
  'aria-hidden': true,
  preserveAspectRatio: 'xMidYMid meet',
};

export function CreditCardLogo() {
  return (
    <svg {...logoSvgProps}>
      <rect x="3" y="8" width="26" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 14h26" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 21h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function AchLogo() {
  return (
    <svg {...logoSvgProps}>
      <rect x="4" y="6" width="24" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 15h12M10 19h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="23" cy="21" r="2.5" fill="currentColor" />
    </svg>
  );
}

export function PaypalLogo() {
  return (
    <svg {...logoSvgProps}>
      <path
        d="M11.2 9h5.1c2.4 0 4.1 1.3 3.7 3.9-.3 2.1-1.8 3.2-4 3.2h-2l-.6 3.4H9l1.2-10.5zm3.4 6.1c1.2 0 1.9-.7 2.1-2 .2-1.3-.4-2-1.6-2h-1.5l-.7 4h1.7z"
        fill="#003087"
      />
      <path
        d="M18.5 9h5c2.2 0 3.7 1.1 3.4 3.5-.3 2-1.7 3.1-3.8 3.1h-1.9l-.6 3.4h-2.3l1.2-10.5zm3.2 6c1.1 0 1.8-.6 2-1.8.2-1.2-.3-1.8-1.5-1.8h-1.4l-.6 3.6h1.5z"
        fill="#009CDE"
      />
    </svg>
  );
}

export const PAYMENT_METHODS = [
  { id: 'credit-card', label: 'Credit card', Logo: CreditCardLogo },
  { id: 'ach', label: 'ACH', Logo: AchLogo },
  { id: 'paypal', label: 'PayPal', Logo: PaypalLogo, preserveLogoColor: true },
];

export const PAYMENT_METHOD_TYPES = PAYMENT_METHODS;
