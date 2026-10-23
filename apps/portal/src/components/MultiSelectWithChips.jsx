import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { useMemo, useRef, useState } from 'react';
import { Checkbox, TextField } from './design-system';
import { SelectChevronIcon, dropdownMenuPaperShadow } from './selectChevronProps';
import { primitive } from '@signal/design-tokens/colors';

const fieldTriggerSx = (theme) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    minHeight: 44,
    '& .MuiOutlinedInput-input': {
      fontSize: 16,
      lineHeight: '24px',
      py: '10px',
      px: '14px',
      cursor: 'text',
      '&::placeholder': {
        color: theme.palette.textPlaceholderField,
        opacity: 1,
      },
    },
  },
});

function SelectionChip({ label, onRemove }) {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        pl: 1,
        pr: '6px',
        py: '2px',
        borderRadius: '16px',
        backgroundColor: primitive.green[100],
      }}
    >
      <Typography sx={{ fontSize: 12, fontWeight: 500, lineHeight: '18px', color: primitive.green[700] }}>
        {label}
      </Typography>
      <IconButton
        size="small"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        sx={{
          p: 0,
          width: 12,
          height: 12,
          color: primitive.green[700],
          '&:hover': { backgroundColor: 'transparent', opacity: 0.75 },
        }}
      >
        <CloseIcon sx={{ fontSize: 12 }} />
      </IconButton>
    </Box>
  );
}

/**
 * Searchable multi-select: type in the trigger field; checkboxes in the panel;
 * stays open until click-outside; green chips below for selections.
 */
export function MultiSelectWithChips({
  label,
  placeholder,
  options,
  value,
  onChange,
  disabled = false,
  required = false,
  id,
}) {
  const theme = useTheme();
  const anchorRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [search, setSearch] = useState('');
  const open = Boolean(anchorEl);
  const panelDisabled = disabled || options.length === 0;

  const filteredOptions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return options;
    return options.filter((option) => option.toLowerCase().includes(query));
  }, [options, search]);

  const openPanel = () => {
    if (panelDisabled) return;
    setAnchorEl(anchorRef.current);
  };

  const closePanel = () => {
    setAnchorEl(null);
    setSearch('');
  };

  const toggleOption = (option) => {
    if (value.includes(option)) {
      onChange(value.filter((entry) => entry !== option));
      return;
    }
    onChange([...value, option]);
  };

  return (
    <Stack spacing={0.75} sx={{ width: '100%' }}>
      {label ? (
        <Typography
          component="label"
          htmlFor={id}
          sx={{
            fontSize: 14,
            fontWeight: 500,
            lineHeight: '20px',
            color: theme.palette.textSecondary3,
          }}
        >
          {label}
          {required ? (
            <Box component="span" sx={{ color: theme.palette.textAlert, ml: 0.25 }} aria-hidden="true">
              *
            </Box>
          ) : null}
        </Typography>
      ) : null}

      <Box ref={anchorRef} sx={{ width: '100%' }}>
        <TextField
          id={id}
          fullWidth
          disabled={panelDisabled}
          placeholder={placeholder}
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            openPanel();
          }}
          onFocus={openPanel}
          autoComplete="off"
          inputProps={{
            'aria-haspopup': 'listbox',
            'aria-expanded': open,
            role: 'combobox',
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SelectChevronIcon
                  sx={{
                    fontSize: 20,
                    color: theme.palette.textSecondary2,
                    transform: open ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s ease',
                    pointerEvents: 'none',
                  }}
                />
              </InputAdornment>
            ),
          }}
          sx={fieldTriggerSx(theme)}
        />
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={closePanel}
        disableAutoFocus
        disableRestoreFocus
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              mt: 0.5,
              width: anchorEl?.clientWidth ?? 320,
              maxHeight: 360,
              borderRadius: '8px',
              border: `1px solid ${theme.palette.borderSubtle1}`,
              boxShadow: dropdownMenuPaperShadow,
            },
          },
        }}
      >
        <List dense disablePadding sx={{ maxHeight: 320, overflowY: 'auto', py: 0.5 }}>
          {filteredOptions.length === 0 ? (
            <Typography sx={{ px: 2, py: 1.5, fontSize: 14, color: theme.palette.textSecondary3 }}>
              No matches
            </Typography>
          ) : (
            filteredOptions.map((option) => {
              const checked = value.includes(option);
              return (
                <ListItemButton
                  key={option}
                  onClick={() => toggleOption(option)}
                  onMouseDown={(event) => event.preventDefault()}
                  sx={{
                    py: 0.75,
                    pl: 2,
                    pr: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <ListItemText
                    primary={option}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: checked ? 500 : 400,
                      color: theme.palette.textPrimary,
                    }}
                    sx={{ m: 0, flex: 1, minWidth: 0 }}
                  />
                  <Checkbox
                    edge="end"
                    checked={checked}
                    tabIndex={-1}
                    disableRipple
                    sx={{
                      p: 0.75,
                      flexShrink: 0,
                      color: theme.palette.borderSubtle2,
                      '&.Mui-checked': {
                        color: theme.palette.primary.main,
                      },
                    }}
                  />
                </ListItemButton>
              );
            })
          )}
        </List>
      </Popover>

      {value.length > 0 ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {value.map((item) => (
            <SelectionChip
              key={item}
              label={item}
              onRemove={() => onChange(value.filter((entry) => entry !== item))}
            />
          ))}
        </Box>
      ) : null}
    </Stack>
  );
}
