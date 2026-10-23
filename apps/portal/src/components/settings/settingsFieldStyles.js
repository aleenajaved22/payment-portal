/** Outlined fields on Settings — matches Figma 44px input height, 14/10 padding. */
export function settingsFieldInputSx(theme) {
  return {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      minHeight: 44,
      backgroundColor: theme.palette.surfaceWhite,
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.borderSubtle1,
      },
      '& .MuiOutlinedInput-input': {
        fontSize: 16,
        lineHeight: '24px',
        py: '10px',
        px: '14px',
        '&::placeholder': {
          color: theme.palette.textPlaceholderField ?? theme.palette.textDisabled,
          opacity: 1,
        },
      },
    },
  };
}

/** Disabled / read-only values on Settings (e.g. email). */
export function settingsDisabledFieldSx(theme) {
  return {
    ...settingsFieldInputSx(theme),
    '& .MuiOutlinedInput-root': {
      ...settingsFieldInputSx(theme)['& .MuiOutlinedInput-root'],
      backgroundColor: theme.palette.surfaceGreySubtle,
      '&.Mui-disabled': {
        backgroundColor: theme.palette.surfaceGreySubtle,
      },
    },
    '& .MuiOutlinedInput-input.Mui-disabled': {
      WebkitTextFillColor: theme.palette.textSecondary2,
      color: theme.palette.textSecondary2,
    },
  };
}
