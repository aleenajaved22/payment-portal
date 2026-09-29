import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import CallMadeOutlined from '@mui/icons-material/CallMadeOutlined';

/**
 * Swiss-grid primitives for the dashboard.
 *
 * The dashboard is full-bleed: no outer container, no page padding. Sections run
 * edge to edge and are told apart by hairline rules that span the full width, not
 * by floating cards. All padding lives inside the cells, so their content still
 * lines up with the header logo. Rules are drawn once per seam: rows own the
 * horizontal rule, cells own the vertical one, and each drops it on the last
 * element so nothing doubles up. When a row stacks on a narrow screen the cells
 * switch their rule from the right edge to the bottom so the seams still read.
 *
 * PAGE_GUTTER matches the shell header's horizontal padding so every band's
 * first column aligns with the logo above it.
 */

export const PAGE_GUTTER = '32px';

/**
 * Card primitives for the summary sections.
 *
 * The bands above the working surfaces are cards on a tinted ground rather than
 * hairline cells: the tint is what separates "here is how you are doing" from
 * "here is the work", and the cards let a section reflow to two columns on a
 * narrow screen without the seams having to move with it.
 *
 * CARD_RADIUS is 16px, which is past the token scale's top step (radius.xl, 12).
 * It matches the reference design; if it stays, it wants a token of its own.
 */
export const CARD_RADIUS = '16px';
export const CARD_SHADOW = '0px 1px 2px 0px rgba(16, 24, 40, 0.05)';

/** A full-bleed tinted band holding an evenly divided row of cards. */
export function CardBand({ columns, children, sx, ...rest }) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        px: PAGE_GUTTER,
        py: '24px',
        backgroundColor: theme.palette.surfaceGreySubtle,
        ...sx,
      }}
      {...rest}
    >
      <Box
        sx={{
          display: 'grid',
          gap: '20px',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            lg: `repeat(${columns}, minmax(0, 1fr))`,
          },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export function DashboardCard({ children, sx, ...rest }) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        p: '24px',
        borderRadius: CARD_RADIUS,
        backgroundColor: theme.palette.surfaceWhite,
        boxShadow: CARD_SHADOW,
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
}

/** The open affordance every card shares. Rendered only when it has a target. */
export function CardArrow({ label, onClick }) {
  const theme = useTheme();
  if (!onClick) return null;
  return (
    <Box
      component="button"
      type="button"
      aria-label={label}
      onClick={onClick}
      sx={{
        display: 'inline-flex',
        p: 0,
        border: 0,
        background: 'none',
        cursor: 'pointer',
        color: theme.palette.textDisabled,
        '&:hover': { color: theme.palette.textSecondary2 },
      }}
    >
      <CallMadeOutlined sx={{ fontSize: 17 }} />
    </Box>
  );
}

/** Card heading: title, optional sub, optional trailing action. */
export function CardHeading({ title, sub, action }) {
  const theme = useTheme();
  return (
    <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 2 }}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 700, lineHeight: '24px', color: theme.palette.textPrimary }}>
          {title}
        </Typography>
        {sub ? (
          // secondary2, not secondary3: a sub-line that states a period or a
          // scope is information, and secondary3 is 3.62:1 on white.
          <Typography sx={{ mt: '1px', fontSize: 13, lineHeight: '20px', color: theme.palette.textSecondary2 }}>
            {sub}
          </Typography>
        ) : null}
      </Box>
      {action ? <Box sx={{ flexShrink: 0 }}>{action}</Box> : null}
    </Stack>
  );
}

export function GridRow({ children, last = false, sx, ...rest }) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'stretch',
        borderBottom: last ? 'none' : `1px solid ${theme.palette.borderSubtle1}`,
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
}

export function GridCell({ children, last = false, flex = 1, sx, ...rest }) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        flex: { xs: '1 1 auto', md: `${flex} 1 0` },
        minWidth: 0,
        px: PAGE_GUTTER,
        py: '24px',
        borderRight: { xs: 'none', md: last ? 'none' : `1px solid ${theme.palette.borderSubtle1}` },
        borderBottom: { xs: last ? 'none' : `1px solid ${theme.palette.borderSubtle1}`, md: 'none' },
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
}

/** Section heading — Inter 16/700, text-primary, matching the reference titles. */
export function SectionLabel({ children, action }) {
  const theme = useTheme();
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
      <Typography
        sx={{
          fontSize: 16,
          fontWeight: 700,
          lineHeight: '20px',
          color: theme.palette.textPrimary,
        }}
      >
        {children}
      </Typography>
      {action ? <Box sx={{ flexShrink: 0 }}>{action}</Box> : null}
    </Stack>
  );
}
