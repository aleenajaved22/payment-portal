import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { CardHeading, GridCell } from './DashboardGrid';

/**
 * Filters replaced, broken down by size — the one figure on this dashboard that
 * is about the service rather than the bill.
 *
 * Ranked horizontal bars: the sizes carry long labels that sit flat beside a bar
 * but need a legend beside a ring, and the ranking is the point — an owner wants
 * to know which size their estate eats. Length already encodes the magnitude, so
 * every bar takes the same fill; a colour ramp would say the same thing twice.
 */

const LABEL_WIDTH = 84;
const COUNT_WIDTH = 38;
const BAR_HEIGHT = 18;

export function FilterMixPanel({ mix, visits, flex = 1, last = false, sx }) {
  const theme = useTheme();
  const largest = mix.sizes.reduce((max, entry) => Math.max(max, entry.count), 0);

  return (
    <GridCell flex={flex} last={last} sx={{ display: 'flex', flexDirection: 'column', ...sx }}>
      {/* The total rides in the heading rather than sitting under it: the bars
          below already carry the detail, so a second full-size figure only
          pushed them down. */}
      <CardHeading
        title="Filters Replaced (y)"
        action={
          mix.total > 0 ? (
            <Stack direction="row" alignItems="baseline" spacing={0.75}>
              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 700,
                  lineHeight: '24px',
                  fontVariantNumeric: 'tabular-nums',
                  color: theme.palette.textPrimary,
                }}
              >
                {mix.total.toLocaleString('en-US')}
              </Typography>
            </Stack>
          ) : null
        }
      />

      {mix.total === 0 ? (
        <Stack spacing={0.5} sx={{ py: 2 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: theme.palette.textPrimary }}>
            No filters recorded
          </Typography>
          <Typography sx={{ fontSize: 13, color: theme.palette.textSecondary3 }}>
            Nothing has been replaced at this site yet.
          </Typography>
        </Stack>
      ) : (
        <>
          <Stack spacing={1.5}>
            {mix.sizes.map((entry) => (
              <Stack key={entry.size} direction="row" alignItems="center" spacing={1.5}>
                <Typography
                  sx={{
                    width: LABEL_WIDTH,
                    flexShrink: 0,
                    fontSize: 12,
                    fontVariantNumeric: 'tabular-nums',
                    color: theme.palette.textSecondary2,
                  }}
                  noWrap
                >
                  {entry.size}
                </Typography>

                <Box
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    height: BAR_HEIGHT,
                    borderRadius: '4px',
                  }}
                >
                  <Box
                    title={`${entry.size}: ${entry.count}`}
                    sx={{
                      height: '100%',
                      // A floor of 2% keeps the smallest size visible as a bar
                      // rather than as nothing at all.
                      width: `${largest > 0 ? Math.max(2, (entry.count / largest) * 100) : 0}%`,
                      borderRadius: '4px',
                      backgroundColor: theme.palette.primary.main,
                    }}
                  />
                </Box>

                <Typography
                  sx={{
                    width: COUNT_WIDTH,
                    flexShrink: 0,
                    textAlign: 'right',
                    fontSize: 13,
                    fontWeight: 600,
                    fontVariantNumeric: 'tabular-nums',
                    color: theme.palette.textPrimary,
                  }}
                >
                  {entry.count}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </>
      )}

      {visits ? (
        <Typography
          sx={{
            mt: 2,
            pt: 1.75,
            borderTop: `1px solid ${theme.palette.borderSubtle1}`,
            fontSize: 13,
            color: theme.palette.textSecondary2,
          }}
        >
          Across {visits === 1 ? '1 service visit' : `${visits} service visits`}
        </Typography>
      ) : null}
    </GridCell>
  );
}
