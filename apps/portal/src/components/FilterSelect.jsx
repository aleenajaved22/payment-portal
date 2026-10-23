import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useMemo, useState } from 'react';
import { Select } from './design-system';
import { dropdownMenuPaperShadow } from './selectChevronProps';

const ICON_SIZE = 18;
const TEXT_ICON_GAP = 6;
const HORIZONTAL_PADDING = 12;

/** Toolbar filters — matches Sites resting label (14 / 500 / 20). */
export const filterDisplayTextSx = {
  fontSize: 14,
  fontWeight: 500,
  lineHeight: '20px',
};

export function FilterSelect({
  label,
  value,
  onChange,
  options,
  clearFirstOption = true,
  searchable = false,
  searchPlaceholder = 'Search',
}) {
  const theme = useTheme();
  const selectPaddingRight = HORIZONTAL_PADDING + ICON_SIZE + TEXT_ICON_GAP;
  const [menuSearch, setMenuSearch] = useState('');

  const visibleOptions = useMemo(() => {
    if (!searchable) return options;
    const query = menuSearch.trim().toLowerCase();
    if (!query) return options;
    return options.filter((option) => option.toLowerCase().includes(query));
  }, [menuSearch, options, searchable]);

  const menuSearchField = searchable ? (
    <ListSubheader
      component="div"
      disableSticky
      sx={{
        lineHeight: 1,
        px: 1.5,
        pt: 1.5,
        pb: 1,
        bgcolor: theme.palette.surfaceWhite,
      }}
    >
      <TextField
        size="small"
        fullWidth
        placeholder={searchPlaceholder}
        value={menuSearch}
        onChange={(event) => setMenuSearch(event.target.value)}
        onKeyDown={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
        autoComplete="off"
        autoFocus
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon sx={{ fontSize: 18, color: theme.palette.textSecondary2 }} />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            height: 36,
            borderRadius: '8px',
            pl: 0.5,
            minWidth: '0 !important',
            padding: '0 10px 0 8px !important',
          },
          '& .MuiOutlinedInput-input': {
            fontSize: '14px !important',
            lineHeight: '20px',
            py: '8px !important',
            px: '0 !important',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.borderSubtle1,
          },
        }}
      />
    </ListSubheader>
  ) : null;

  return (
    <FormControl variant="standard" sx={{ minWidth: 'auto' }}>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        displayEmpty
        disableUnderline
        IconComponent={KeyboardArrowDownIcon}
        onClose={() => setMenuSearch('')}
        MenuProps={{
          disableAutoFocus: searchable,
          autoFocus: searchable ? false : undefined,
          PaperProps: {
            elevation: 0,
            sx: {
              mt: 0.5,
              minWidth: 220,
              borderRadius: '8px',
              border: `1px solid ${theme.palette.borderSubtle1}`,
              boxShadow: dropdownMenuPaperShadow,
              maxHeight: 360,
            },
          },
          MenuListProps: {
            autoFocus: false,
            subheader: menuSearchField,
            sx: { py: searchable ? 0 : 0.5, maxHeight: 320, overflowY: 'auto' },
          },
        }}
        renderValue={(selected) => (
          <Box component="span" sx={filterDisplayTextSx}>
            {selected || label}
          </Box>
        )}
        sx={{
          ...filterDisplayTextSx,
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: 'transparent',
          },
          '&:hover .MuiSelect-select': {
            color: theme.palette.primary.main,
          },
          '&:hover .MuiSelect-icon': {
            color: theme.palette.primary.main,
          },
          '& .MuiSelect-select': {
            ...filterDisplayTextSx,
            py: 0.5,
            pl: `${HORIZONTAL_PADDING}px`,
            pr: `${selectPaddingRight}px`,
            boxSizing: 'border-box',
            color: theme.palette.textPrimary,
            transition: 'color 0.15s ease',
            '&:hover': {
              backgroundColor: 'transparent',
            },
          },
          '& .MuiInputBase-input': {
            fontSize: '14px !important',
            fontWeight: '500 !important',
            lineHeight: '20px !important',
            padding: `4px ${selectPaddingRight}px 4px ${HORIZONTAL_PADDING}px !important`,
          },
          '& .MuiSelect-icon': {
            color: theme.palette.textSecondary2,
            fontSize: ICON_SIZE,
            width: ICON_SIZE,
            height: ICON_SIZE,
            right: HORIZONTAL_PADDING,
            transition: 'color 0.15s ease, transform 0.2s ease',
          },
          '& .MuiSelect-icon.MuiSelect-iconOpen': {
            color: `${theme.palette.primary.main} !important`,
            transform: 'rotate(180deg)',
          },
          '&.Mui-focused .MuiSelect-icon': {
            color: theme.palette.primary.main,
          },
        }}
      >
        {visibleOptions.length === 0 ? (
          <MenuItem disabled sx={{ ...filterDisplayTextSx, py: 1.25, px: 2, opacity: 1, color: theme.palette.textSecondary3 }}>
            No matches
          </MenuItem>
        ) : (
          visibleOptions.map((option) => {
            const menuValue = clearFirstOption && option === options[0] ? '' : option;
            return (
              <MenuItem key={option} value={menuValue} sx={{ ...filterDisplayTextSx, py: 1.25, px: 2 }}>
                {option}
              </MenuItem>
            );
          })
        )}
      </Select>
    </FormControl>
  );
}
