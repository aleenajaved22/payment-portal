import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Button, Drawer } from './design-system';
import { InvoiceDocumentPreview } from './InvoiceDocumentPreview';
import { getInvoicePdfUrl } from '../data/invoiceDocumentMock';

export function InvoicePreviewDrawer({ open, invoice, onClose, onPayNow }) {
  const theme = useTheme();
  const drawerWidth = 'min(869px, 96vw)';

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      ModalProps={{
        BackdropProps: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
          },
        },
      }}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: drawerWidth },
          maxWidth: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: theme.shadows?.[16] ?? '0 8px 32px rgba(0,0,0,0.2)',
        },
      }}
      SlideProps={{
        direction: 'left',
      }}
    >
      <IconButton
        onClick={onClose}
        aria-label="Close invoice preview"
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
          overflowY: 'auto',
          overflowX: 'hidden',
          backgroundColor: theme.palette.surfaceWhite,
        }}
      >
        {open && invoice ? <InvoiceDocumentPreview key={invoice.id} invoice={invoice} /> : null}
      </Box>

      <Box
        sx={{
          borderTop: `1px solid ${theme.palette.borderSubtle1}`,
          px: 4,
          py: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          backgroundColor: theme.palette.surfaceWhite,
          flexShrink: 0,
        }}
      >
        <Button
          variant="secondaryBlue"
          component="a"
          href={invoice ? getInvoicePdfUrl(invoice) : undefined}
          download
          sx={{ minWidth: 'auto' }}
        >
          Download Invoice
        </Button>
        {invoice && invoice.status !== 'Paid' ? (
          <Button
            variant="primary"
            onClick={() => onPayNow?.(invoice)}
            endIcon={<ArrowForwardIcon sx={{ fontSize: 18 }} />}
            sx={{ minWidth: 105, '& .MuiButton-endIcon': { ml: 0.75 } }}
          >
            Pay now
          </Button>
        ) : null}
      </Box>
    </Drawer>
  );
}
