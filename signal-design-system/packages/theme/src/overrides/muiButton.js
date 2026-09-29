import { semantic } from '@signal/design-tokens/colors';
import shadows from '@signal/design-tokens/shadows';

const { primary } = semantic;

const MuiButton = ({ _palette }) => ({
  variants: [
    // Primary
    {
      props: { variant: 'primary' },
      style: {
        padding: '8px 14px',
        height: 36,
        borderRadius: 8,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 14,
        fontWeight: 500,
        lineHeight: '20px',
        fontFamily: 'Inter',
        textTransform: 'none',
        cursor: 'pointer',
        letterSpacing: 'normal',
        boxShadow: 'none',

        color: '#ffffff',
        backgroundColor: primary.default,
        border: `1px solid ${primary.default}`,

        '&:hover': {
          backgroundColor: primary.hover,
          border: `1px solid ${primary.hover}`,
        },

        '&:active': {
          backgroundColor: primary.default,
          border: `1px solid ${primary.default}`,
          boxShadow: shadows.focusBrandSolidWithSoft,
        },
        /* Keyboard focus gets the same ring the pressed state already
           had a token for. Without this the primary button — the one that
           commits a payment — has no visible focus at all (WCAG 2.4.7). */
        '&:focus-visible': {
          backgroundColor: primary.default,
          border: `1px solid ${primary.default}`,
          boxShadow: shadows.focusBrandSolidWithSoft,
        },

        '&:disabled': {
          color: '#ffffff',
          backgroundColor: primary.disabled,
          border: `1px solid ${primary.disabled}`,
        },
        '@media (hover:none)': {
          backgroundColor: primary.default,
          border: `1px solid ${primary.default}`,
        },
      },
    },

    // Secondary-Gray
    {
      props: { variant: 'secondaryGrey' },
      style: {
        padding: '8px 14px',
        height: 36,
        borderRadius: 8,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 14,
        fontWeight: 500,
        lineHeight: '20px',
        fontFamily: 'Inter',
        textTransform: 'none',
        cursor: 'pointer',
        letterSpacing: 'normal',
        boxShadow: 'none',

        color: '#444446',
        backgroundColor: 'white',
        border: `1px solid #AEAEB2`,

        '&:hover': {
          color: '#262527',
          backgroundColor: '#F5F5F6',
          border: `1px solid #AEAEB2`,
        },

        '&:active': {
          color: '#444446',
          backgroundColor: 'white',
          border: `1px solid #AEAEB2`,
          boxShadow: `0px 0px 0px 4px #F2F4F7, 0px 1px 2px 0px rgba(16, 24, 40, 0.05)`,
        },
        /* Keyboard focus gets the same ring the pressed state already
           had a token for. Without this the primary button — the one that
           commits a payment — has no visible focus at all (WCAG 2.4.7). */
        '&:focus-visible': {
          color: '#444446',
          backgroundColor: 'white',
          border: `1px solid #AEAEB2`,
          boxShadow: `0px 0px 0px 4px #F2F4F7, 0px 1px 2px 0px rgba(16, 24, 40, 0.05)`,
        },

        '&:disabled': {
          color: '#AEAEB2',
          backgroundColor: 'white',
          border: `1px solid #D0CFD2`,
          '& span': {
            '& svg': {
              '& g': {
                '& path': {
                  stroke: '#AEAEB2',
                },
              },
            },
          },
        },
        '@media (hover:none)': {
          backgroundColor: 'white',
          border: `1px solid #AEAEB2`,
        },
      },
    },

    // Tertiary-Grey
    {
      props: { variant: 'tertiaryGrey' },
      style: {
        padding: '8px 14px',
        height: 36,
        borderRadius: 8,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 14,
        fontWeight: 500,
        lineHeight: '20px',
        fontFamily: 'Inter',
        textTransform: 'none',
        cursor: 'pointer',
        letterSpacing: 'normal',
        boxShadow: 'none',

        color: '#5B5B5F',
        backgroundColor: 'transparent',

        '&:hover': {
          color: '#5B5B5F',
          backgroundColor: '#F5F5F6',
        },

        '&:active': {
          color: '#5B5B5F',
          backgroundColor: 'transparent',
          boxShadow: `none`,
        },
        /* Keyboard focus gets the same ring the pressed state already
           had a token for. Without this the primary button — the one that
           commits a payment — has no visible focus at all (WCAG 2.4.7). */
        '&:focus-visible': {
          color: '#5B5B5F',
          backgroundColor: 'transparent',
          boxShadow: `none`,
        },

        '&:disabled': {
          color: '#AEAEB2',
          backgroundColor: 'transparent',
        },
        '@media (hover:none)': {
          backgroundColor: 'transparent',
        },
      },
    },

    // onlyText
    {
      props: { variant: 'onlyText' },
      style: {
        padding: '8px 14px',
        height: 36,
        borderRadius: 8,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 14,
        fontWeight: 500,
        lineHeight: '20px',
        fontFamily: 'Inter',
        textTransform: 'none',
        cursor: 'pointer',
        letterSpacing: 'normal',

        color: primary.default,
        backgroundColor: 'transparent',

        '&:hover': {
          color: primary.hover,
          backgroundColor: 'transparent',
        },

        '&:active': {
          color: primary.default,
          backgroundColor: 'transparent',
          boxShadow: `none`,
        },
        /* Keyboard focus gets the same ring the pressed state already
           had a token for. Without this the primary button — the one that
           commits a payment — has no visible focus at all (WCAG 2.4.7). */
        '&:focus-visible': {
          color: primary.default,
          backgroundColor: 'transparent',
          boxShadow: `none`,
        },

        '&:disabled': {
          color: primary.disabled,
          backgroundColor: 'transparent',
        },
        '@media (hover:none)': {
          backgroundColor: 'transparent',
        },
      },
    },

    // Destructive
    {
      props: { variant: 'destructive' },
      style: {
        padding: '8px 14px',
        height: 36,
        borderRadius: 8,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 14,
        fontWeight: 500,
        lineHeight: '20px',
        fontFamily: 'Inter',
        textTransform: 'none',
        cursor: 'pointer',
        letterSpacing: 'normal',
        boxShadow: `0px 1px 2px 0px rgba(16, 24, 40, 0.05)`,

        color: '#ffffff',
        backgroundColor: '#E43F32',
        border: `1px solid #E43F32`,

        '&:hover': {
          backgroundColor: '#B32318',
          border: `1px solid #B32318`,
        },

        '&:active': {
          backgroundColor: '#E43F32',
          border: `1px solid #E43F32`,
          boxShadow: ` 0px 0px 0px 4px #FEE4E2, 0px 1px 2px 0px rgba(16, 24, 40, 0.05)`,
        },
        /* Keyboard focus gets the same ring the pressed state already
           had a token for. Without this the primary button — the one that
           commits a payment — has no visible focus at all (WCAG 2.4.7). */
        '&:focus-visible': {
          backgroundColor: '#E43F32',
          border: `1px solid #E43F32`,
          boxShadow: ` 0px 0px 0px 4px #FEE4E2, 0px 1px 2px 0px rgba(16, 24, 40, 0.05)`,
        },

        '&:disabled': {
          color: '#ffffff',
          backgroundColor: '#FECDCA',
          border: `1px solid #FECDCA`,
          boxShadow: `0px 1px 2px 0px rgba(16, 24, 40, 0.05)`,
        },
        '@media (hover:none)': {
          backgroundColor: '#E43F32',
          border: `1px solid #D92D20`,
        },
      },
    },

    // Destructive-Secondary
    {
      props: { variant: 'destructiveSecondary' },
      style: {
        padding: '8px 14px',
        height: 36,
        borderRadius: 8,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 14,
        fontWeight: 500,
        lineHeight: '20px',
        fontFamily: 'Inter',
        textTransform: 'none',
        cursor: 'pointer',
        letterSpacing: 'normal',
        boxShadow: `0px 1px 2px 0px rgba(16, 24, 40, 0.05)`,

        color: '#B32318',
        backgroundColor: '#ffffff',
        border: `1px solid #DF372B`,

        '&:hover': {
          backgroundColor: '#FBEEED',
          border: `1px solid #DF372B`,
        },

        '&:active': {
          backgroundColor: '#ffffff',
          border: `1px solid #DF372B`,
          boxShadow: ` 0px 0px 0px 4px #FEE4E2, 0px 1px 2px 0px rgba(16, 24, 40, 0.05)`,
        },
        /* Keyboard focus gets the same ring the pressed state already
           had a token for. Without this the primary button — the one that
           commits a payment — has no visible focus at all (WCAG 2.4.7). */
        '&:focus-visible': {
          backgroundColor: '#ffffff',
          border: `1px solid #DF372B`,
          boxShadow: ` 0px 0px 0px 4px #FEE4E2, 0px 1px 2px 0px rgba(16, 24, 40, 0.05)`,
        },

        '&:disabled': {
          color: '#FECDCA',
          backgroundColor: '#ffffff',
          border: `1px solid #FECDCA`,
        },
        '@media (hover:none)': {
          backgroundColor: '#ffffff',
          border: `1px solid #DF372B`,
        },
      },
    },

    // Secondary-Blue
    {
      props: { variant: 'secondaryBlue' },
      style: {
        padding: '8px 14px',
        height: 36,
        borderRadius: 8,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 14,
        fontWeight: 500,
        lineHeight: '20px',
        fontFamily: 'Inter',
        textTransform: 'none',
        cursor: 'pointer',
        letterSpacing: 'normal',
        boxShadow: 'none',

        color: primary.default,
        backgroundColor: 'transparent',
        border: `1px solid ${primary.default}`,

        '&:hover': {
          color: primary.default,
          backgroundColor: primary.subtle,
          border: `1px solid ${primary.default}`,
        },

        '&:active': {
          color: primary.default,
          backgroundColor: 'transparent',
          border: `1px solid ${primary.default}`,
          boxShadow: shadows.focusBrandSolid,
        },
        /* Keyboard focus gets the same ring the pressed state already
           had a token for. Without this the primary button — the one that
           commits a payment — has no visible focus at all (WCAG 2.4.7). */
        '&:focus-visible': {
          color: primary.default,
          backgroundColor: 'transparent',
          border: `1px solid ${primary.default}`,
          boxShadow: shadows.focusBrandSolid,
        },

        '&:disabled': {
          color: primary.disabled,
          backgroundColor: 'transparent',
          border: `1px solid ${primary.disabled}`,
        },
        '@media (hover:none)': {
          backgroundColor: 'transparent',
          border: `1px solid ${primary.default}`,
        },
      },
    },
  ],
});

export default MuiButton;
