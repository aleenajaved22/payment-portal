import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import { Button, Drawer, ReportTypeChip } from './design-system';
import { formatDuration, getReportDetail } from '../data/reportDetailMock';

/**
 * A report, opened.
 *
 * Rows in the reports table used to be inert — the page listed four reports and
 * gave you no way to read any of them, which made the whole screen an index with
 * nothing behind it. This is the thing the index points at.
 *
 * It is a drawer rather than a route because a report is read against the list:
 * the customer is comparing visits, and pushing a page each time would make
 * going back through four reports four round trips. The invoice preview already
 * uses a right drawer for the same reason, so the two read as one pattern.
 *
 * Laid out in the dashboard's language — hairline-separated bands, a single
 * figure carried large, labels above values — not as a fake printed document.
 * The invoice has a real PDF to imitate; a service report does not.
 */

const DRAWER_WIDTH = 'min(560px, 96vw)';

/** Label above value. The portal's one way of stating a small fact. */
function Fact({ label, value, mono = false }) {
  const theme = useTheme();
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography sx={{ fontSize: 12, lineHeight: '16px', color: theme.palette.textSecondary3 }}>
        {label}
      </Typography>
      <Typography
        sx={{
          mt: '2px',
          fontSize: 14,
          fontWeight: 500,
          color: theme.palette.textPrimary,
          fontVariantNumeric: mono ? 'tabular-nums' : 'normal',
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function Band({ title, children, last = false }) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        px: 3,
        py: 2.5,
        borderBottom: last ? 'none' : `1px solid ${theme.palette.borderSubtle1}`,
      }}
    >
      {title ? (
        <Typography
          sx={{
            mb: 1.75,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: theme.palette.textSecondary3,
          }}
        >
          {title}
        </Typography>
      ) : null}
      {children}
    </Box>
  );
}

export function ReportDetailDrawer({ open, report, onClose, onDownload }) {
  const theme = useTheme();
  const detail = open && report ? getReportDetail(report) : null;
  const largest = detail ? detail.replaced.reduce((max, entry) => Math.max(max, entry.count), 0) : 0;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      ModalProps={{ BackdropProps: { sx: { backgroundColor: 'rgba(0, 0, 0, 0.6)' } } }}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: DRAWER_WIDTH },
          maxWidth: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: theme.palette.surfaceWhite,
        },
      }}
      SlideProps={{ direction: 'left' }}
    >
      {report && detail ? (
        <>
          {/* Header band: the site is the headline, the type and date beneath it. */}
          <Box
            sx={{
              px: 3,
              py: 2.5,
              borderBottom: `1px solid ${theme.palette.borderSubtle1}`,
              flexShrink: 0,
            }}
          >
            <Stack direction="row" alignItems="flex-start" spacing={2}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  component="h2"
                  sx={{ fontSize: 20, fontWeight: 700, lineHeight: '28px', color: theme.palette.textPrimary }}
                >
                  {report.site}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                  <ReportTypeChip type={report.reportType} />
                  <Typography sx={{ fontSize: 13, color: theme.palette.textSecondary3 }}>
                    {report.day}, {report.date} · {detail.reference}
                  </Typography>
                </Stack>
              </Box>
              <IconButton
                onClick={onClose}
                aria-label="Close report"
                size="small"
                sx={{ flexShrink: 0, mr: -0.5, color: theme.palette.textSecondary2 }}
              >
                <CloseIcon sx={{ fontSize: 22 }} />
              </IconButton>
            </Stack>
          </Box>

          <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
            <Band title="Visit">
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(3, minmax(0, 1fr))' },
                  gap: 2.5,
                }}
              >
                <Fact label="Technician" value={detail.technician} />
                <Fact label="On site" value={formatDuration(detail.durationMinutes)} mono />
                <Fact label="Units serviced" value={detail.unitsServiced} mono />
              </Box>
            </Band>

            <Band title="Filters replaced">
              {/* The count leads; the per-size bars beneath it use the same ranked
                  horizontal form as the dashboard's Filter Mix panel, so the two
                  read as the same measurement at two scales. */}
              <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mb: 2 }}>
                <Typography
                  sx={{
                    fontSize: 30,
                    fontWeight: 700,
                    lineHeight: '38px',
                    letterSpacing: '-0.02em',
                    fontVariantNumeric: 'tabular-nums',
                    color: theme.palette.textPrimary,
                  }}
                >
                  {detail.totalReplaced}
                </Typography>
                <Typography sx={{ fontSize: 13, color: theme.palette.textSecondary3 }}>
                  across {detail.replaced.length} {detail.replaced.length === 1 ? 'size' : 'sizes'}
                </Typography>
              </Stack>

              <Stack spacing={1.25}>
                {detail.replaced.map((entry) => (
                  <Stack key={entry.size} direction="row" alignItems="center" spacing={1.5}>
                    <Typography
                      sx={{
                        width: 84,
                        flexShrink: 0,
                        fontSize: 12,
                        fontVariantNumeric: 'tabular-nums',
                        color: theme.palette.textSecondary2,
                      }}
                      noWrap
                    >
                      {entry.size}
                    </Typography>
                    <Box sx={{ flex: 1, minWidth: 0, height: 16 }}>
                      <Box
                        sx={{
                          height: '100%',
                          width: `${largest > 0 ? Math.max(4, (entry.count / largest) * 100) : 0}%`,
                          borderRadius: '4px',
                          backgroundColor: theme.palette.primary.main,
                        }}
                      />
                    </Box>
                    <Typography
                      sx={{
                        width: 28,
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
            </Band>

            {detail.exception ? (
              <Band title="Exception">
                <Stack
                  direction="row"
                  spacing={1.5}
                  sx={{
                    p: 1.75,
                    borderRadius: '10px',
                    backgroundColor: theme.palette.surfaceWarningSubtle,
                  }}
                >
                  <ReportProblemOutlinedIcon
                    sx={{ flexShrink: 0, fontSize: 20, mt: '1px', color: theme.palette.textPrimary }}
                  />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: theme.palette.textPrimary }}>
                      {detail.exception.title}
                    </Typography>
                    <Typography sx={{ mt: 0.25, fontSize: 13, lineHeight: '19px', color: theme.palette.textSecondary2 }}>
                      {detail.exception.detail}
                    </Typography>
                  </Box>
                </Stack>
              </Band>
            ) : null}

            <Band title="Site" last>
              <Stack spacing={2}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                    gap: 2.5,
                  }}
                >
                  <Fact label="Store code" value={detail.billTo.storeCode} mono />
                  <Fact label="Contact" value={detail.billTo.contactPerson} />
                </Box>
                <Fact label="Address" value={detail.billTo.address} />
              </Stack>
            </Band>
          </Box>

          <Box
            sx={{
              flexShrink: 0,
              px: 3,
              py: 2,
              borderTop: `1px solid ${theme.palette.borderSubtle1}`,
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Button
              variant="secondaryGrey"
              onClick={() => onDownload?.(report)}
              startIcon={<DownloadOutlinedIcon sx={{ fontSize: 18 }} />}
            >
              Download report
            </Button>
          </Box>
        </>
      ) : null}
    </Drawer>
  );
}
