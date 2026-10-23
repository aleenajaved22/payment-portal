/** Outlined inputs shared by drawers (Invite/Edit user) and payment method forms. */
export function portalFieldInputSx(theme) {
  return {
    width: '100%',
    maxWidth: '100%',
    minWidth: 0,
    '& .MuiFormControl-root': {
      width: '100%',
      minWidth: 0,
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      minHeight: 44,
      minWidth: 0,
      maxWidth: '100%',
      backgroundColor: theme.palette.surfaceWhite,
      '& .MuiOutlinedInput-input': {
        fontSize: 16,
        lineHeight: '24px',
        py: '10px',
        px: '14px',
        '&::placeholder': {
          color: theme.palette.textPlaceholderField,
          opacity: 1,
        },
      },
    },
  };
}

export function portalFieldLabelSx(theme) {
  return {
    display: 'block',
    mb: 0.75,
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '20px',
    color: theme.palette.textSecondary3,
  };
}
