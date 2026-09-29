import { useState } from 'react';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';

/**
 * Switches that exist for whoever is presenting the portal, not for a customer.
 *
 * The empty-state switch used to sit in the dashboard's greeting band, level
 * with the site filter — which put a demo control in the same row, at the same
 * weight, as a real one. Anyone reading the page fairly would take it for a
 * product feature.
 *
 * So it moves out of the content entirely and becomes a small floating button in
 * the bottom-right corner: reachable in one click when presenting, and legible
 * as scaffolding rather than chrome. It rests at reduced opacity and comes up to
 * full on hover or focus, so it stays out of the way of screenshots.
 *
 * Bottom *right* specifically: the payment confirmation toast owns the bottom
 * left, and the two must never fight for the same corner.
 */
export function DemoControls({ items = [] }) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  if (items.length === 0) return null;

  return (
    <>
      <Box
        component="button"
        type="button"
        aria-label="Demo controls"
        aria-haspopup="dialog"
        aria-expanded={open ? 'true' : undefined}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        sx={{
          position: 'fixed',
          right: 20,
          bottom: 20,
          zIndex: (t) => t.zIndex.speedDial,
          width: 38,
          height: 38,
          p: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          cursor: 'pointer',
          color: theme.palette.textSecondary2,
          border: `1px solid ${theme.palette.borderSubtle1}`,
          backgroundColor: theme.palette.surfaceWhite,
          boxShadow: '0px 4px 12px -2px rgba(16, 24, 40, 0.12), 0px 1px 2px 0px rgba(16, 24, 40, 0.06)',
          opacity: open ? 1 : 0.55,
          transition: 'opacity 0.15s ease, color 0.15s ease',
          '&:hover': { opacity: 1, color: theme.palette.textPrimary },
          '&:focus-visible': {
            opacity: 1,
            outline: `2px solid ${theme.palette.textBrandOnSubtle}`,
            outlineOffset: 2,
          },
        }}
      >
        <TuneRoundedIcon sx={{ fontSize: 18 }} />
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        marginThreshold={16}
        TransitionComponent={Fade}
        slotProps={{
          paper: {
            sx: {
              mb: 1.25,
              p: 1.5,
              minWidth: 236,
              borderRadius: '12px',
              border: `1px solid ${theme.palette.borderSubtle1}`,
              boxShadow: '0px 12px 24px -6px rgba(16, 24, 40, 0.16), 0px 4px 8px -2px rgba(16, 24, 40, 0.06)',
            },
          },
        }}
      >
        <Typography
          sx={{
            px: 0.5,
            pb: 1,
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: theme.palette.textSecondary2,
          }}
        >
          Demo controls
        </Typography>

        <Stack spacing={0.25}>
          {items.map((item) => (
            <Stack
              key={item.id}
              component="label"
              htmlFor={`demo-${item.id}`}
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{
                px: 0.5,
                py: 0.75,
                borderRadius: '8px',
                cursor: 'pointer',
                '&:hover': { backgroundColor: theme.palette.surfaceGreySubtle },
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 500, color: theme.palette.textPrimary }}>
                  {item.label}
                </Typography>
                {item.hint ? (
                  <Typography sx={{ fontSize: 12, lineHeight: '16px', color: theme.palette.textSecondary2 }}>
                    {item.hint}
                  </Typography>
                ) : null}
              </Box>
              <Switch
                id={`demo-${item.id}`}
                size="small"
                checked={item.checked}
                onChange={(event) => item.onChange(event.target.checked)}
              />
            </Stack>
          ))}
        </Stack>
      </Popover>
    </>
  );
}
