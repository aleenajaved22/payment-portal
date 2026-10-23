import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { resolvePdfUrl } from '../lib/resolvePdfUrl';

/** Native browser PDF viewer — reliable on Safari/WebKit and Firefox. */
export function EmbeddedPdfPreview({ pdfUrl, title, loadingLabel = 'Loading document…' }) {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);

  const resolvedPdfUrl = resolvePdfUrl(pdfUrl);
  const useAppleEmbed = typeof navigator !== 'undefined' && /Apple/i.test(navigator.vendor);
  const documentSrc = resolvedPdfUrl
    ? useAppleEmbed
      ? resolvedPdfUrl
      : `${resolvedPdfUrl}#toolbar=0&navpanes=0&view=FitH`
    : null;

  useEffect(() => {
    setLoading(true);
    const safety = window.setTimeout(() => setLoading(false), 2500);
    return () => window.clearTimeout(safety);
  }, [documentSrc]);

  if (!documentSrc) {
    return null;
  }

  const viewerHeight = 'calc(100dvh - 72px)';

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: viewerHeight,
        backgroundColor: theme.palette.surfaceWhite,
        position: 'relative',
      }}
    >
      {loading ? (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            backgroundColor: theme.palette.surfaceWhite,
          }}
        >
          <CircularProgress size={24} />
          <Typography sx={{ fontSize: 14, color: theme.palette.textSecondary2 }}>{loadingLabel}</Typography>
        </Box>
      ) : null}

      {useAppleEmbed ? (
        <Box
          component="embed"
          title={title}
          src={documentSrc}
          type="application/pdf"
          onLoad={() => setLoading(false)}
          sx={{
            width: '100%',
            height: viewerHeight,
            minHeight: 480,
            border: 0,
            display: 'block',
            backgroundColor: theme.palette.surfaceWhite,
          }}
        />
      ) : (
        <Box
          component="iframe"
          title={title}
          src={documentSrc}
          onLoad={() => setLoading(false)}
          sx={{
            width: '100%',
            height: viewerHeight,
            minHeight: 480,
            border: 0,
            display: 'block',
            backgroundColor: theme.palette.surfaceWhite,
          }}
        />
      )}
    </Box>
  );
}
