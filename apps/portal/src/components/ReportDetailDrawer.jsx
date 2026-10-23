import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { Button, Drawer } from './design-system';
import { ReportDocumentPreview } from './ReportDocumentPreview';
import { REPORT_PDF_PAGE_WIDTH_PT } from '../data/reportDocumentMock';

/** Drawer matches the embedded report PDF page width (A4 MediaBox). */
const DRAWER_WIDTH = `min(${REPORT_PDF_PAGE_WIDTH_PT}pt, 96vw)`;

export function ReportDetailDrawer({ open, report, onClose, onDownload }) {
  const theme = useTheme();

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
          top: 0,
          bottom: 0,
          height: 'auto',
          maxHeight: 'none',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: theme.palette.surfaceWhite,
          boxShadow: theme.shadows?.[16] ?? '0 8px 32px rgba(0,0,0,0.2)',
        },
      }}
      SlideProps={{ direction: 'left' }}
    >
      <IconButton
        onClick={onClose}
        aria-label="Close report"
        size="small"
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 2,
          color: theme.palette.textSecondary2,
        }}
      >
        <CloseIcon sx={{ fontSize: 24 }} />
      </IconButton>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          backgroundColor: theme.palette.surfaceWhite,
        }}
      >
        {open && report ? <ReportDocumentPreview key={report.id} report={report} /> : null}
      </Box>

      <Box
        sx={{
          flexShrink: 0,
          borderTop: `1px solid ${theme.palette.borderSubtle1}`,
          px: 3,
          py: 1,
          backgroundColor: theme.palette.surfaceWhite,
        }}
      >
        <Stack direction="row" spacing={1.5} justifyContent="flex-end">
          <Button variant="secondaryGrey" onClick={onClose} sx={{ height: 36, px: 2 }}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => report && onDownload?.(report)}
            startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 18 }} />}
            sx={{ height: 36, px: 2 }}
            disabled={!report}
          >
            Download
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
}
