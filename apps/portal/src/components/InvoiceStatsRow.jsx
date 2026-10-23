import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
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

function SegmentHaloIcon({ color, haloColor }) {
  const haloSize = 24;
  const dotSize = 10;

  return (
    <Box
      sx={{
        width: haloSize,
        height: haloSize,
        minWidth: haloSize,
        minHeight: haloSize,
        flexShrink: 0,
        aspectRatio: '1 / 1',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: haloColor ?? alpha(color, 0.16),
      }}
    >
      <Box
        sx={{
          width: dotSize,
          height: dotSize,
          minWidth: dotSize,
          minHeight: dotSize,
          flexShrink: 0,
          borderRadius: '50%',
          backgroundColor: color,
        }}
      />
    </Box>
  );
}

function SegmentStatCell({ segment, isActive, onSelect, showDivider }) {
  const theme = useTheme();
  const interactive = Boolean(onSelect);
  const countLabel = `${segment.count} ${segment.count === 1 ? 'invoice' : 'invoices'}`;

  return (
    <Box
      component={interactive ? 'button' : 'div'}
      type={interactive ? 'button' : undefined}
      onClick={interactive ? () => onSelect(segment.label) : undefined}
      aria-pressed={interactive ? isActive : undefined}
      aria-label={interactive ? `Filter by ${segment.label}: ${segment.amountLabel}, ${countLabel}` : undefined}
      sx={{
        flex: 1,
        minWidth: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        font: 'inherit',
        px: '32px',
        py: '20px',
        border: 'none',
        backgroundColor: isActive ? theme.palette.surfaceGreySubtle : theme.palette.surfaceWhite,
        borderRight: showDivider ? `1px solid ${theme.palette.borderSubtle1}` : 'none',
        cursor: interactive ? 'pointer' : 'default',
        transition: 'background-color 0.15s ease',
        '&:hover': interactive
          ? { backgroundColor: isActive ? theme.palette.surfaceGreySubtle : theme.palette.surfaceGreySubtle }
          : undefined,
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        justifyContent="flex-start"
        sx={{ minWidth: 0, maxWidth: '100%', minHeight: 41 }}
      >
        <SegmentHaloIcon color={segment.dotColor} haloColor={segment.haloColor} />
        <Stack alignItems="flex-start" spacing={0.5} sx={{ minWidth: 0, textAlign: 'left' }}>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 500,
              lineHeight: '20px',
              color: theme.palette.textSecondary3,
            }}
          >
            {segment.label}
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
            spacing={0.75}
            sx={{ flexWrap: 'wrap' }}
          >
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 700,
                lineHeight: 'normal',
                fontVariantNumeric: 'tabular-nums',
                color: theme.palette.textPrimary,
                whiteSpace: 'nowrap',
              }}
            >
              {segment.amountLabel}
            </Typography>
            <Box
              component="span"
              aria-hidden
              sx={{
                width: 3,
                height: 3,
                borderRadius: '50%',
                flexShrink: 0,
                backgroundColor: theme.palette.textSecondary3,
              }}
            />
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 400,
                lineHeight: '20px',
                color: theme.palette.textSecondary3,
              }}
            >
              {countLabel}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Box>
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
        display: 'flex',
        width: '100%',
        justifyContent: 'flex-start',
        backgroundColor: theme.palette.surfaceWhite,
        borderBottom: `1px solid ${theme.palette.borderSubtle1}`,
      }}
    >
      {segments.map((segment, index) => (
        <SegmentStatCell
          key={segment.id}
          segment={segment}
          isActive={activeStatus === segment.label}
          onSelect={handleSelect}
          showDivider={index < segments.length - 1}
        />
      ))}
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
