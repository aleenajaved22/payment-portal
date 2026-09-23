import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { GridCell, SectionLabel } from './DashboardGrid';
import { Button } from '../design-system';

/**
 * Each report is a tile shaped like a home-screen widget: a soft rounded
 * surface, a small glyph and label for what it is, then the subject stated large.
 *
 * The shape is doing more than decoration — it forces a better order. As a list
 * row the report type led and the site was a footnote, but "Site Summary" is the
 * same on every report; the site and its date are what tell them apart, so those
 * take the large type and the type name drops to a label above them.
 *
 * Usually exactly one tile renders, so it has to look composed on its own rather
 * than like the first row of a list that got cut off. Three things carry that:
 *
 *  - A type ladder rather than a size ladder. 12/600 label → 26/700 title →
 *    13/400 footnote. The step from 600 to 400 is what makes the date read as
 *    secondary; the colour can't do it (see the contrast note below), so weight
 *    and tracking do.
 *  - Depth from stacked fills, no outlines anywhere. White cell → grey tile →
 *    white glyph chip, plus one tinted capsule. Three surfaces, zero borders.
 *  - The tile answers to the pointer. Fill shifts on hover, the whole thing
 *    settles ~1.5% on press, on a short Apple-ish ease — and none of that under
 *    prefers-reduced-motion.
 *
 * The tile is one target for opening the report. Download is a separate control
 * pinned to its corner, deliberately outside the main button so the two never
 * nest. The press is plain CSS `:active` on the wrapper rather than React state:
 * the browser already knows about drag-off, touch-cancel and Space-to-activate,
 * and there is no way for the tile to get stuck looking pressed.
 */

/* 26px at 355px wide reads as a squircle rather than a rounded rectangle; the
   glyph chip's 10px is the same corner sampled at its own scale. */
const TILE_RADIUS = '18px';
const GLYPH_RADIUS = '8px';

/* Short, with a decelerating curve — movement should finish before it's noticed. */
const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';
const REDUCED_MOTION = '@media (prefers-reduced-motion: reduce)';

/**
 * Contrast, measured against the surface each string actually sits on
 * (tile fill #F5F5F6, capsule fill #EFF8EF):
 *   textPrimary   #262527 on #F5F5F6 — 13.9:1  (title, 26px/700, needs 3:1)
 *   textSecondary2 #5B5B5F on #F5F5F6 — 6.2:1  (label, date, download glyph)
 *   textBrandHover #027A48 on #EFF8EF — 4.96:1 (the "New" capsule)
 *
 * Two deliberate substitutions:
 *   textSecondary3 #86868B is only 3.3:1 on this fill, so it can't carry the
 *   date at 13px. textSecondary2 replaces it and weight carries the hierarchy.
 *   textBrand #2DA551 is only 2.6:1 on surfaceBrandSubtle — it looks like the
 *   right green and fails. textBrandHover is the same hue, one step down.
 */
const CAPSULE_TEXT = 'textBrandHover';

function ReportTile({ report, onOpen, onDownload }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: TILE_RADIUS,
        transform: 'scale(1)',
        transition: `transform 260ms ${EASE}`,
        /* The whole tile settles, download control included, because it is the
           tile you pressed. */
        '&:active': { transform: 'scale(0.985)' },
        /* …except when what you pressed was the download control itself, which
           is its own target. Browsers without :has() simply skip this. */
        '&:has(> button[aria-label]:active)': { transform: 'scale(1)' },
        [REDUCED_MOTION]: {
          transition: 'none',
          transform: 'none',
          '&:active': { transform: 'none' },
        },
      }}
    >
      <Box
        component="button"
        type="button"
        onClick={() => onOpen(report)}
        sx={{
          width: '100%',
          display: 'block',
          p: '14px 16px 16px',
          border: 'none',
          font: 'inherit',
          textAlign: 'left',
          cursor: 'pointer',
          borderRadius: TILE_RADIUS,
          backgroundColor: theme.palette.surfaceGreySubtle,
          /* Two very soft ambient layers, no outline: enough to seat the tile on
             the white cell without it reading as a card with a shadow. */
          boxShadow: '0 1px 2px rgba(16, 24, 40, 0.04), 0 6px 16px rgba(16, 24, 40, 0.03)',
          transition: `background-color 260ms ${EASE}`,
          '&:hover': { backgroundColor: '#EFEFF1' },
          '&:active': { backgroundColor: '#EAEAEC' },
          '&:focus-visible': {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: '2px',
          },
          [REDUCED_MOTION]: { transition: 'none' },
        }}
      >
        {/* Right padding keeps a long report type clear of the download control,
            which floats above this row. */}
        <Stack direction="row" alignItems="center" spacing={1.25} sx={{ pr: '36px' }}>
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: GLYPH_RADIUS,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.palette.surfaceWhite,
              boxShadow: '0 1px 2px rgba(16, 24, 40, 0.06)',
            }}
          >
            {/* 16px glyph in a 30px chip: the mark keeps ~53% of the chip, which
                matches the optical weight of the 12px label beside it. */}
            <DescriptionOutlinedIcon sx={{ fontSize: 14, color: theme.palette.textSecondary2 }} />
          </Box>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 600,
              lineHeight: '16px',
              letterSpacing: '0.01em',
              color: theme.palette.textSecondary2,
            }}
            noWrap
          >
            {report.reportType}
          </Typography>
        </Stack>

        {/* The one large thing on the tile. Negative tracking at this size stops
            Inter from opening up and looking like a heading in a list. */}
        <Typography
          sx={{
            mt: '10px',
            fontSize: 18,
            fontWeight: 700,
            lineHeight: '24px',
            letterSpacing: '-0.021em',
            color: theme.palette.textPrimary,
          }}
          noWrap
        >
          {report.site}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: '2px' }}>
          <Typography
            sx={{ fontSize: 13, fontWeight: 400, lineHeight: '20px', color: theme.palette.textSecondary2 }}
            noWrap
          >
            {report.date}
          </Typography>
          {report.isNew ? (
            <Box
              sx={{
                flexShrink: 0,
                display: 'inline-flex',
                alignItems: 'center',
                height: 20,
                px: '8px',
                borderRadius: '999px',
                backgroundColor: theme.palette.surfaceBrandSubtle,
                color: theme.palette[CAPSULE_TEXT],
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.01em',
              }}
            >
              New
            </Box>
          ) : null}
        </Stack>
      </Box>

      {/* Quiet until reached for: no fill of its own, then it picks up the same
          white chip the glyph wears. */}
      <Tooltip title="Download report">
        <IconButton
          onClick={() => onDownload(report)}
          aria-label={`Download ${report.reportType} for ${report.site}`}
          sx={{
            position: 'absolute',
            /* Centred on the glyph chip (22px pad + 30px chip ⇒ centre at 37px),
               and inset so the 17px mark, not the 32px hit area, lines up with
               the content's right edge. */
            top: '21px',
            right: '17px',
            width: 32,
            height: 32,
            color: theme.palette.textSecondary2,
            backgroundColor: 'transparent',
            transition: `background-color 260ms ${EASE}, color 260ms ${EASE}, box-shadow 260ms ${EASE}, transform 260ms ${EASE}`,
            '&:hover': {
              color: theme.palette.textPrimary,
              backgroundColor: theme.palette.surfaceWhite,
              boxShadow: '0 1px 2px rgba(16, 24, 40, 0.08)',
            },
            '&:active': { transform: 'scale(0.9)' },
            '&:focus-visible': {
              outline: `2px solid ${theme.palette.primary.main}`,
              outlineOffset: '2px',
            },
            [REDUCED_MOTION]: { transition: 'none', '&:active': { transform: 'none' } },
          }}
        >
          <FileDownloadOutlinedIcon sx={{ fontSize: 17 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

const ROW_RADIUS = '16px';

/**
 * Same report, collapsed to one row for contexts with less room to spend (a
 * sidebar, a dense list) — a third pass, and a different premise from the
 * first two: instead of a filled pill or a hairline-plus-colour-spine, the
 * row is a plain hairline-bordered surface with just enough ambient shadow
 * to lift off the page — quiet at rest, a touch more raised on hover.
 *
 *  - No fill, no accent bar. The border is the shape; the shadow is depth,
 *    not decoration, so it stays subtle instead of announcing itself.
 *  - Unread is a dot, not a badge. A small solid dot beside the title is
 *    how mail and messaging apps mark "new" — quieter than a pill, and it
 *    sits where the eye already lands first.
 *  - The download action comes back as its own control (dropped in the
 *    last pass in favour of a chevron) — tucked into the corner the same
 *    way the full tile does it, so opening and downloading stay two
 *    separate, equally legible targets instead of one being invented to
 *    stand in for both.
 */
function ReportTileCompact({ report, onOpen, onDownload }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: ROW_RADIUS,
        backgroundColor: theme.palette.surfaceWhite,
        border: `1px solid ${theme.palette.borderSubtle1}`,
        boxShadow: '0 1px 2px rgba(16, 24, 40, 0.04)',
        transition: `box-shadow 220ms ${EASE}, transform 220ms ${EASE}`,
        transform: 'scale(1)',
        '&:hover': { boxShadow: '0 2px 6px rgba(16, 24, 40, 0.06)' },
        '&:active': { transform: 'scale(0.99)' },
        '&:has(> button[aria-label]:active)': { transform: 'scale(1)' },
        [REDUCED_MOTION]: { transition: 'none', transform: 'none', '&:active': { transform: 'none' } },
      }}
    >
      <Box
        component="button"
        type="button"
        onClick={() => onOpen(report)}
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          p: '14px 16px',
          pr: '44px',
          border: 'none',
          font: 'inherit',
          textAlign: 'left',
          cursor: 'pointer',
          borderRadius: ROW_RADIUS,
          backgroundColor: 'transparent',
          '&:focus-visible': {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: '2px',
          },
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '11px',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.palette.surfaceBrandSubtle,
          }}
        >
          <DescriptionOutlinedIcon sx={{ fontSize: 18, color: theme.palette[CAPSULE_TEXT] }} />
        </Box>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            sx={{ fontSize: 14.5, fontWeight: 600, lineHeight: '19px', letterSpacing: '-0.011em', color: theme.palette.textPrimary }}
            noWrap
          >
            {report.site}
          </Typography>
          <Typography sx={{ mt: '2px', fontSize: 12.5, color: theme.palette.textSecondary2 }} noWrap>
            {report.reportType} · {report.date}
          </Typography>
        </Box>
      </Box>

      {report.isNew ? (
        <Box
          sx={{
            position: 'absolute',
            top: '-3px',
            right: '-3px',
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: theme.palette[CAPSULE_TEXT],
            border: `2px solid ${theme.palette.surfaceWhite}`,
          }}
        />
      ) : null}

      <Tooltip title="Download report">
        <IconButton
          onClick={() => onDownload(report)}
          aria-label={`Download ${report.reportType} for ${report.site}`}
          sx={{
            position: 'absolute',
            top: '50%',
            right: '10px',
            transform: 'translateY(-50%)',
            width: 30,
            height: 30,
            color: theme.palette.textSecondary2,
            backgroundColor: 'transparent',
            transition: `background-color 220ms ${EASE}, color 220ms ${EASE}`,
            '&:hover': {
              color: theme.palette.textPrimary,
              backgroundColor: theme.palette.surfaceGreySubtle,
            },
            '&:active': { transform: 'translateY(-50%) scale(0.92)' },
            '&:focus-visible': {
              outline: `2px solid ${theme.palette.primary.main}`,
              outlineOffset: '2px',
            },
            [REDUCED_MOTION]: { transition: 'none' },
          }}
        >
          <FileDownloadOutlinedIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

/** Same surface and corner as a real tile, so the panel keeps its shape when empty. */
function EmptyReportTile() {
  const theme = useTheme();
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={1.25}
      sx={{
        p: '28px 20px',
        borderRadius: TILE_RADIUS,
        backgroundColor: theme.palette.surfaceGreySubtle,
      }}
    >
      <Box
        sx={{
          width: 30,
          height: 30,
          borderRadius: GLYPH_RADIUS,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.palette.surfaceWhite,
          boxShadow: '0 1px 2px rgba(16, 24, 40, 0.06)',
        }}
      >
        <DescriptionOutlinedIcon sx={{ fontSize: 16, color: theme.palette.textDisabled }} />
      </Box>
      <Typography sx={{ fontSize: 13, fontWeight: 400, color: theme.palette.textSecondary2 }}>
        No reports for this selection.
      </Typography>
    </Stack>
  );
}

export function ReportsPanel({ reports, newCount, onViewAll, onOpen, onDownload, flex = 1, last = false, compact = false, sx }) {
  const theme = useTheme();
  const Tile = compact ? ReportTileCompact : ReportTile;

  return (
    <GridCell flex={flex} last={last} sx={sx}>
      <SectionLabel
        action={
          <Button variant="tertiaryGrey" size="small" onClick={onViewAll} sx={{ color: theme.palette.textBrand }}>
            View all
          </Button>
        }
      >
        Latest Reports{newCount > 0 ? ` · ${newCount} new` : ''}
      </SectionLabel>

      {reports.length === 0 ? (
        <EmptyReportTile />
      ) : (
        <Stack spacing={compact ? 1 : 1.5}>
          {reports.map((report) => (
            <Tile key={report.id} report={report} onOpen={onOpen} onDownload={onDownload} />
          ))}
        </Stack>
      )}
    </GridCell>
  );
}
