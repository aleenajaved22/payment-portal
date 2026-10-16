import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Select } from './design-system';

const ICON_SIZE = 18;
const TEXT_ICON_GAP = 6;
const HORIZONTAL_PADDING = 12;

export function FilterSelect({ label, value, onChange, options, clearFirstOption = true }) {
  const theme = useTheme();
  const selectPaddingRight = HORIZONTAL_PADDING + ICON_SIZE + TEXT_ICON_GAP;

  return (
    <FormControl variant="standard" sx={{ minWidth: 'auto' }}>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        displayEmpty
        disableUnderline
        IconComponent={KeyboardArrowDownIcon}
        renderValue={(selected) => (
          <Box component="span" sx={{ fontSize: 14, fontWeight: 500 }}>
            {selected || label}
          </Box>
        )}
        sx={{
          fontSize: 14,
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
        {options.map((option) => {
          const menuValue = clearFirstOption && option === options[0] ? '' : option;
          return (
            <MenuItem key={option} value={menuValue}>
              {option}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
