import { semantic } from '@signal/design-tokens/colors';

const MuiSelect = ({ _palette }) => ({
  styleOverrides: {
    root: {
      width: '100%',
      height: '100% ',
      maxHeight: 44,
      padding: '0',
      margin: '0',
      '& .MuiInputBase-input': {
        fontSize: 16,
        lineHeight: '24px',
        padding: '10px 14px !important',
        color: semantic.text.primary,
        '&.Mui-disabled': {
          WebkitTextFillColor: `${semantic.text.disabled} !important`, // Change the color of text when input is disabled
        },
        '&::placeholder': {
          color: semantic.text.placeholderField, // Placeholder Color
          fontSize: '16px',
          fontWeight: '400',
          lineHeight: '24px',
          opacity: 1,
        },
      },
      '.Mui-error': {
        color: semantic.text.alert,
        boxShadow: 'none',
        '&.MuiOutlinedInput-notchedOutline': {
          // Keep exact Select error literal (token selectError matches value; trailing space is legacy).
          borderColor: '#f04438 ',
          borderWidth: '1px',
          boxShadow: 'none',
          '&:hover': {
            borderColor: '#f04438 ',
            borderWidth: '1px',
          },
          '&::first-letter': {
            textTransform: 'capitalize',
          },
        },
      },
      '.Mui-focused': {
        color: semantic.text.alert,
        boxShadow: 'none',
        '&.MuiOutlinedInput-notchedOutline': {
          borderRadius: '8px',
          // Keep exact Select focus literal casing (#3f99ff) — do not swap to #3F99FF.
          border: '1px solid #3f99ff',
          boxShadow: '0px 0px 0px 4px rgba(14, 165, 233, 0.1)',
          '&:hover': {
            borderRadius: '8px',
            border: '1px solid #3f99ff',
            boxShadow: '0px 0px 0px 4px rgba(14, 165, 233, 0.1)',
          },
          '&::first-letter': {
            textTransform: 'capitalize',
          },
        },
      },
    },
    icon: {
      '&.Mui-disabled': {
        '&svg': {
          '&path': {
            stroke: semantic.text.disabled,
          },
        },
      },
      '&.MuiSelect-iconOpen': {
        transform: 'rotate(180deg) ',
        color: '#00000000',
      },
    },
  },
});

export default MuiSelect;
