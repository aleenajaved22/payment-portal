/** Shared pill search on Payments, Reports, and other list toolbars. */
export function toolbarSearchWidthCh(placeholder, query = '') {
  return Math.max(placeholder.length, String(query).length);
}

/** 12px inset before leading content, 14px after trailing content — matches toolbar search. */
export function toolbarOutlinedInputRootSx(theme, { borderRadius }) {
  return {
    borderRadius,
    backgroundColor: theme.palette.surfaceWhite,
    height: 36,
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box',
    minWidth: '0 !important',
    alignItems: 'center',
    paddingTop: '0 !important',
    paddingBottom: '0 !important',
    paddingLeft: '12px !important',
    paddingRight: '14px !important',
    '&.MuiInputBase-adornedStart, &.MuiInputBase-adornedEnd, &.Mui-readOnly': {
      paddingTop: '0 !important',
      paddingBottom: '0 !important',
      paddingLeft: '12px !important',
      paddingRight: '14px !important',
    },
  };
}

export function toolbarOutlinedInputTextSx({ widthCh, placeholderSx }) {
  return {
    minWidth: `${widthCh}ch`,
    padding: '0 !important',
    fontSize: '14px !important',
    fontWeight: 500,
    lineHeight: '20px',
    ...(placeholderSx ? { '&::placeholder': placeholderSx } : {}),
  };
}

export function toolbarSearchFieldSx(theme, { placeholder, query = '', extraWidthPx = 0 }) {
  const searchWidthCh = toolbarSearchWidthCh(placeholder, query);
  const widthExtra = extraWidthPx > 0 ? ` + ${extraWidthPx}px` : '';

  return {
    minWidth: 0,
    width: {
      xs: '100%',
      md: `calc(${searchWidthCh}ch + 2.75rem${widthExtra})`,
    },
    maxWidth: '100%',
    flexShrink: 0,
    '& .MuiOutlinedInput-root': toolbarOutlinedInputRootSx(theme, { borderRadius: '20px' }),
    '& .MuiInputAdornment-positionStart': {
      marginRight: '8px !important',
      marginLeft: '0 !important',
    },
    '& .MuiOutlinedInput-input': toolbarOutlinedInputTextSx({
      widthCh: searchWidthCh,
      placeholderSx: {
        fontSize: '14px !important',
        fontWeight: 400,
        lineHeight: '20px',
        color: theme.palette.textPlaceholderField,
        opacity: 1,
      },
    }),
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.borderSubtle1,
    },
  };
}

export function toolbarSearchIconSx(theme) {
  return {
    fontSize: 18,
    color: theme.palette.textSecondary2,
  };
}

/** 16px glyph centered in an 18×18 slot (date range trailing icon). */
export function toolbarDateRangeIconSx(theme) {
  return {
    fontSize: 16,
    color: theme.palette.textSecondary2,
  };
}

/** Horizontal inset inside the date-range outline (equal left/right). */
const TOOLBAR_DATE_RANGE_PAD_X = 12;

/** Read-only date range on Reports — hugs label text; equal horizontal padding. */
export function toolbarDateRangeFieldSx(theme, _displayValue = '') {
  return {
    width: { xs: '100%', md: 'fit-content' },
    minWidth: '0 !important',
    maxWidth: '100%',
    flexShrink: 0,
    flexGrow: 0,
    padding: '0 !important',
    height: 'auto',
    maxHeight: 'none',
    '& .MuiOutlinedInput-root': {
      ...toolbarOutlinedInputRootSx(theme, { borderRadius: '8px' }),
      display: 'inline-flex',
      width: { xs: '100%', md: 'fit-content' },
      minWidth: '0 !important',
      maxWidth: '100%',
      paddingLeft: `${TOOLBAR_DATE_RANGE_PAD_X}px !important`,
      paddingRight: `${TOOLBAR_DATE_RANGE_PAD_X}px !important`,
      '&.MuiInputBase-adornedEnd, &.MuiInputBase-adornedStart, &.Mui-readOnly': {
        paddingLeft: `${TOOLBAR_DATE_RANGE_PAD_X}px !important`,
        paddingRight: `${TOOLBAR_DATE_RANGE_PAD_X}px !important`,
      },
    },
    '& .MuiInputAdornment-positionEnd': {
      marginLeft: '6px !important',
      marginRight: '0 !important',
      flexShrink: 0,
      width: 18,
      height: 18,
      maxHeight: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      '& .MuiSvgIcon-root': {
        fontSize: '16px !important',
      },
    },
    '& .MuiOutlinedInput-input, & .MuiOutlinedInput-input.MuiInputBase-inputAdornedEnd': {
      ...toolbarOutlinedInputTextSx({ widthCh: 1 }),
      width: 'auto !important',
      minWidth: '0 !important',
      maxWidth: '100%',
      fieldSizing: 'content',
      color: `${theme.palette.textPrimary} !important`,
      WebkitTextFillColor: `${theme.palette.textPrimary} !important`,
      flex: '0 1 auto',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.borderSubtle1,
    },
  };
}
