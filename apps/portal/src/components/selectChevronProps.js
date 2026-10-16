import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { primitive } from '@signal/design-tokens/colors';

/** Outlined full-width selects in drawers — Figma chevron-down (20px). */
export const SelectChevronIcon = KeyboardArrowDownIcon;

export function selectChevronSx(theme) {
  return {
    '& .MuiSelect-select': {
      paddingRight: '40px !important',
    },
    '& .MuiSelect-icon': {
      color: theme.palette.textSecondary2,
      fontSize: 20,
      width: 20,
      height: 20,
      right: 14,
      top: 'calc(50% - 10px)',
    },
    '& .MuiSelect-icon.MuiSelect-iconOpen': {
      color: `${theme.palette.textSecondary2} !important`,
      transform: 'rotate(180deg)',
    },
  };
}

/** Menu panel for drawer selects — matches MultiSelectWithChips popover. */
export function drawerSelectMenuProps(theme) {
  return {
    disableScrollLock: true,
    PaperProps: {
      elevation: 0,
      sx: {
        mt: 0.5,
        borderRadius: '8px',
        border: `1px solid ${theme.palette.borderSubtle1}`,
        boxShadow: theme.shadows?.[8] ?? '0 8px 24px rgba(0,0,0,0.12)',
        maxHeight: 320,
        '& .MuiMenuItem-root': {
          alignItems: 'flex-start',
          whiteSpace: 'normal',
          py: 1.25,
          px: 2,
        },
        '& .MuiMenuItem-root.Mui-selected': {
          backgroundColor: 'transparent',
          '&:hover': { backgroundColor: theme.palette.action.hover },
        },
        '& .MuiMenuItem-root.Mui-selected .MuiSvgIcon-root': {
          color: primitive.blue[500],
        },
      },
    },
    MenuListProps: {
      sx: { py: 0.5 },
    },
  };
}

export function drawerSelectFieldSx(theme, fieldInputSx) {
  return {
    borderRadius: '8px',
    minWidth: 0,
    ...fieldInputSx(theme),
    ...selectChevronSx(theme),
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.borderSubtle2,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.borderSubtle2,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: `${primitive.blue[500]} !important`,
      borderWidth: '1px',
      boxShadow: '0px 0px 0px 4px rgba(20, 109, 255, 0.1)',
    },
  };
}
