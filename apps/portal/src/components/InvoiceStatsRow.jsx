import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Button } from './design-system';

const STAT_ICON_BY_VARIANT = {
  total: ArticleOutlinedIcon,
  check: CheckCircleOutlineIcon,
  clock: AccessTimeOutlinedIcon,
  alert: ErrorOutlineIcon,
};

function StatIcon({ variant, color, backgroundColor }) {
  const Icon = STAT_ICON_BY_VARIANT[variant] ?? ArticleOutlinedIcon;

  return (
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: '4px',
        backgroundColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Icon sx={{ fontSize: 18, color }} />
    </Box>
  );
}

function DashboardStatCell({ card, showDivider, stackedLayout = false }) {
  const theme = useTheme();

  if (stackedLayout) {
    return (
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          px: '32px',
          py: '24px',
          backgroundColor: theme.palette.surfaceWhite,
          borderRight: showDivider ? `1px solid ${theme.palette.borderSubtle1}` : 'none',
        }}
      >
        <Stack direction="row" spacing={1.25} alignItems="flex-start" sx={{ minWidth: 0 }}>
          <StatIcon variant={card.iconVariant} color={card.color} backgroundColor={card.iconBg} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 500,
                lineHeight: '20px',
                color: theme.palette.textSecondary3,
              }}
            >
              {card.label}
            </Typography>
            <Typography
              sx={{
                fontSize: 22,
                fontWeight: 700,
                lineHeight: '30px',
                color: theme.palette.textPrimary,
                mt: 0.75,
              }}
            >
              {card.amount}
            </Typography>
          </Box>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        px: '32px',
        py: '24px',
        backgroundColor: theme.palette.surfaceWhite,
        borderRight: showDivider ? `1px solid ${theme.palette.borderSubtle1}` : 'none',
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0, mb: 1.5 }}>
        <StatIcon variant={card.iconVariant} color={card.color} backgroundColor={card.iconBg} />
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 500,
            lineHeight: '20px',
            color: theme.palette.textSecondary3,
          }}
        >
          {card.label}
        </Typography>
      </Stack>

      <Typography
        sx={{
          fontSize: 22,
          fontWeight: 700,
          lineHeight: '30px',
          color: theme.palette.textPrimary,
        }}
      >
        {card.amount}
      </Typography>
    </Box>
  );
}

export function InvoiceStatsRow({ cards, stackedLayout = false }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        backgroundColor: theme.palette.surfaceWhite,
        borderTop: `1px solid ${theme.palette.borderSubtle1}`,
        borderBottom: `1px solid ${theme.palette.borderSubtle1}`,
      }}
    >
      {cards.map((card, index) => (
        <DashboardStatCell
          key={card.id}
          card={card}
          showDivider={index < cards.length - 1}
          stackedLayout={stackedLayout}
        />
      ))}
    </Box>
  );
}

function SegmentLegendItem({ segment, isActive, onSelect }) {
  const theme = useTheme();
  const interactive = Boolean(onSelect);
  const countLabel = `${segment.count} ${segment.count === 1 ? 'invoice' : 'invoices'}`;

  return (
    <Stack
      component={interactive ? 'button' : 'div'}
      type={interactive ? 'button' : undefined}
      onClick={interactive ? () => onSelect(segment.label) : undefined}
      aria-pressed={interactive ? isActive : undefined}
      aria-label={interactive ? `Filter by ${segment.label}: ${segment.amountLabel}, ${countLabel}` : undefined}
      direction="row"
      alignItems="center"
      spacing={0.75}
      sx={{
        minWidth: 0,
        flexShrink: 0,
        textAlign: 'left',
        font: 'inherit',
        p: '4px 6px',
        ml: '-6px',
        border: 'none',
        borderRadius: '6px',
        backgroundColor: isActive ? theme.palette.surfaceGreySubtle : 'transparent',
        cursor: interactive ? 'pointer' : 'default',
        transition: 'background-color 0.15s ease',
        '&:hover': interactive ? { backgroundColor: theme.palette.surfaceGreySubtle } : undefined,
      }}
    >
      {/* Centered on the whole two-line block (label + amount), not just the
          label — the dot is this item's marker, not the eyebrow's. */}
      <Box
        sx={{
          width: 9,
          height: 9,
          borderRadius: '50%',
          backgroundColor: segment.dotColor,
          flexShrink: 0,
        }}
      />
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 500,
            lineHeight: '18px',
            color: theme.palette.textSecondary2,
          }}
        >
          {segment.label}
        </Typography>
        <Typography
          sx={{
            fontSize: 20,
            fontWeight: 700,
            lineHeight: '26px',
            letterSpacing: '-0.01em',
            fontVariantNumeric: 'tabular-nums',
            mt: '2px',
            color: theme.palette.textPrimary,
          }}
        >
          {segment.amountLabel}
          <Box
            component="span"
            sx={{ ml: '4px', fontSize: 13, fontWeight: 400, letterSpacing: 'normal', color: theme.palette.textSecondary3 }}
          >
            · {countLabel}
          </Box>
        </Typography>
      </Box>
    </Stack>
  );
}

export function InvoiceStatsSegmentRow({ segments, activeStatus = '', onSelectStatus }) {
  const theme = useTheme();
  /** Clicking the active segment clears the filter rather than re-applying it. */
  const handleSelect = onSelectStatus
    ? (label) => onSelectStatus(activeStatus === label ? '' : label)
    : undefined;

  return (
    <Box
      sx={{
        width: '100%',
        px: { xs: 2, md: '32px' },
        py: '22px',
        backgroundColor: theme.palette.surfaceWhite,
        borderTop: `1px solid ${theme.palette.borderSubtle1}`,
      }}
    >
      {/* Status metrics double as filters: clicking one scopes the invoice table
          to that status. */}
      <Stack direction="row" spacing={6} sx={{ flexWrap: 'wrap', rowGap: 1.5 }}>
        {segments.map((segment) => (
          <SegmentLegendItem
            key={segment.id}
            segment={segment}
            isActive={activeStatus === segment.label}
            onSelect={handleSelect}
          />
        ))}
      </Stack>
    </Box>
  );
}

export function InvoiceStatsLayoutToggle({ layout, onChange }) {
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      spacing={0.75}
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: theme.zIndex.speedDial,
        p: 0.5,
        borderRadius: '10px',
        backgroundColor: theme.palette.surfaceWhite,
        border: `1px solid ${theme.palette.borderSubtle1}`,
        boxShadow: '0px 8px 16px -4px rgba(16, 24, 40, 0.12)',
      }}
    >
      <Button
        variant={layout === 'grid' ? 'primary' : 'tertiaryGrey'}
        size="small"
        onClick={() => onChange('grid')}
        aria-pressed={layout === 'grid'}
        aria-label="Stats layout V1"
        sx={{ minWidth: 52, fontWeight: 600 }}
      >
        V1
      </Button>
      <Button
        variant={layout === 'board' ? 'primary' : 'tertiaryGrey'}
        size="small"
        onClick={() => onChange('board')}
        aria-pressed={layout === 'board'}
        aria-label="Stats layout V2 board"
        sx={{ minWidth: 52, fontWeight: 600 }}
      >
        V2
      </Button>
    </Stack>
  );
}
