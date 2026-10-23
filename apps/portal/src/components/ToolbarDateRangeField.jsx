import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import { useEffect, useMemo, useRef, useState } from 'react';
import { TextField } from './design-system';
import { dropdownMenuPaperShadow } from './selectChevronProps';
import { toolbarDateRangeFieldSx, toolbarDateRangeIconSx } from './toolbarSearchFieldSx';

const DAY_MS = 86400000;
const WEEKDAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

function startOfDay(date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function startOfWeekMonday(date) {
  const next = startOfDay(date);
  const offset = (next.getDay() + 6) % 7;
  next.setDate(next.getDate() - offset);
  return next;
}

function isSameDay(a, b) {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

function isDayInRange(day, range) {
  if (!range) return false;
  const time = startOfDay(day).getTime();
  return time >= range.from.getTime() && time <= range.to.getTime();
}

function buildCalendarDays(viewMonth) {
  const monthStart = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
  const gridStart = startOfWeekMonday(monthStart);
  return Array.from({ length: 42 }, (_, index) => new Date(gridStart.getTime() + index * DAY_MS));
}

function monthTitle(date) {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

/** Read-only toolbar date range — click opens calendar reflecting the active preset range. */
export function ToolbarDateRangeField({
  displayValue,
  ariaLabel = 'Date range in view',
  presetOptions = [],
  activePreset,
  onPresetChange,
  range,
}) {
  const theme = useTheme();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => range?.from ?? new Date());

  useEffect(() => {
    if (!open) return;
    setViewMonth(range?.from ?? new Date());
  }, [open, range?.from]);

  const calendarDays = useMemo(() => buildCalendarDays(viewMonth), [viewMonth]);
  const displayText = displayValue ?? '';
  const inputSize = Math.max(displayText.length, 1);

  const openPopover = () => setOpen(true);
  const closePopover = () => setOpen(false);

  const handlePreset = (preset) => {
    onPresetChange?.(preset);
    closePopover();
  };

  return (
    <>
      <Box ref={anchorRef} sx={{ display: 'inline-flex', width: 'fit-content', maxWidth: '100%' }}>
        <TextField
          variant="outlined"
          size="small"
          value={displayText}
          onClick={openPopover}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              openPopover();
            }
          }}
          inputProps={{
            size: inputSize,
            'aria-label': ariaLabel,
            'aria-haspopup': 'dialog',
            'aria-expanded': open,
            readOnly: true,
          }}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <CalendarTodayOutlinedIcon sx={toolbarDateRangeIconSx(theme)} />
              </InputAdornment>
            ),
          }}
          sx={{
            ...toolbarDateRangeFieldSx(theme, displayText),
            '& .MuiOutlinedInput-root': { cursor: 'pointer' },
            '& .MuiOutlinedInput-input': { cursor: 'pointer' },
          }}
        />
      </Box>

      <Popover
        open={open}
        anchorEl={anchorRef.current}
        onClose={closePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 0.75,
            p: 2,
            width: 320,
            borderRadius: '8px',
            border: `1px solid ${theme.palette.borderSubtle1}`,
            boxShadow: dropdownMenuPaperShadow,
          },
        }}
      >
        <Stack spacing={1.5}>
          {presetOptions.length > 0 ? (
            <Stack direction="row" flexWrap="wrap" gap={0.75}>
              {presetOptions.map((preset) => {
                const selected = activePreset === preset;
                return (
                  <Box
                    key={preset}
                    component="button"
                    type="button"
                    onClick={() => handlePreset(preset)}
                    sx={{
                      border: `1px solid ${selected ? theme.palette.primary.main : theme.palette.borderSubtle1}`,
                      borderRadius: '16px',
                      px: 1.25,
                      py: 0.5,
                      fontSize: 12,
                      fontWeight: 500,
                      lineHeight: '18px',
                      color: selected ? theme.palette.primary.main : theme.palette.textSecondary2,
                      backgroundColor: selected ? alpha(theme.palette.primary.main, 0.08) : theme.palette.surfaceWhite,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    {preset}
                  </Box>
                );
              })}
            </Stack>
          ) : null}

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <IconButton
              size="small"
              aria-label="Previous month"
              onClick={() =>
                setViewMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))
              }
            >
              <ChevronLeftIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: theme.palette.textPrimary }}>
              {monthTitle(viewMonth)}
            </Typography>
            <IconButton
              size="small"
              aria-label="Next month"
              onClick={() =>
                setViewMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))
              }
            >
              <ChevronRightIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 0.25,
              textAlign: 'center',
            }}
          >
            {WEEKDAY_LABELS.map((label) => (
              <Typography
                key={label}
                sx={{ fontSize: 11, fontWeight: 600, color: theme.palette.textSecondary3, py: 0.25 }}
              >
                {label}
              </Typography>
            ))}
            {calendarDays.map((day) => {
              const inMonth = day.getMonth() === viewMonth.getMonth();
              const inRange = isDayInRange(day, range);
              const isStart = range && isSameDay(day, range.from);
              const isEnd = range && isSameDay(day, range.to);
              const isEndpoint = isStart || isEnd;

              return (
                <Box
                  key={day.toISOString()}
                  component="span"
                  sx={{
                    borderRadius: isEndpoint ? '8px' : inRange ? 0 : '8px',
                    py: 0.75,
                    fontSize: 13,
                    fontWeight: isEndpoint ? 600 : 400,
                    lineHeight: 1,
                    color: inMonth ? theme.palette.textPrimary : theme.palette.textDisabled,
                    backgroundColor: isEndpoint
                      ? theme.palette.primary.main
                      : inRange
                        ? alpha(theme.palette.primary.main, 0.12)
                        : 'transparent',
                    ...(isEndpoint ? { color: theme.palette.common.white } : {}),
                  }}
                >
                  {day.getDate()}
                </Box>
              );
            })}
          </Box>
        </Stack>
      </Popover>
    </>
  );
}
