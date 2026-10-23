import Box from '@mui/material/Box';

/** Shared rendered size for payment method tiles and inline pickers. */
export const PAYMENT_METHOD_LOGO_SIZE = 24;

export function PaymentMethodLogoIcon({ Logo, size = PAYMENT_METHOD_LOGO_SIZE }) {
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
        overflow: 'visible',
        '& svg': {
          width: size,
          height: size,
          minWidth: size,
          minHeight: size,
          display: 'block',
          flexShrink: 0,
          shapeRendering: 'geometricPrecision',
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

/** Inset brand marks so they match the line-icon logos drawn in the 32×32 canvas. */
const BRAND_MARK_INSET = 4;

function BrandMark({ children }) {
  return <g transform={`translate(${BRAND_MARK_INSET} ${BRAND_MARK_INSET})`}>{children}</g>;
}

export function GooglePayLogo() {
  return (
    <svg {...logoSvgProps}>
      <BrandMark>
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </BrandMark>
    </svg>
  );
}

export function ApplePayLogo() {
  return (
    <svg {...logoSvgProps}>
      <BrandMark>
        <path
          fill="#000000"
          d="M17.05 20.28c-.98.95-2.05.88-3.08.04-1.09-.86-2.08-.82-3.24 0-1.44 1.07-2.33 1.01-3.32-.04C4.75 17.25 3.72 12.45 5.87 9.27c1.02-1.44 2.39-2.3 3.74-2.3 1.46 0 2.38.9 3.58.9 1.18 0 1.89-.9 3.57-.9 1.28 0 2.4.58 3.22 1.58-2.83 1.57-2.37 5.61.49 6.88-.61 1.57-1.39 3.05-2.42 4.34zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.3 2.01-1.86 3.88-3.74 4.25z"
        />
      </BrandMark>
    </svg>
  );
}

export const PAYMENT_METHODS = [
  { id: 'credit-card', label: 'Credit card', Logo: CreditCardLogo },
  { id: 'ach', label: 'ACH', Logo: AchLogo },
  { id: 'google-pay', label: 'Google Pay', Logo: GooglePayLogo, preserveLogoColor: true },
  {
    id: 'apple-pay',
    label: 'Apple Pay',
    Logo: ApplePayLogo,
    preserveLogoColor: true,
    listLogoSize: PAYMENT_METHOD_LOGO_SIZE + 2,
  },
];

export const PAYMENT_METHOD_TYPES = PAYMENT_METHODS;
