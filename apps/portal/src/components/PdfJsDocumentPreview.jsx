import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useEffect, useRef, useState } from 'react';
import { getPdfjs } from '../lib/pdfjs';
import { resolvePdfUrl } from '../lib/resolvePdfUrl';

const PDFJS_FAIL_MS = 12000;

function waitForLayoutWidth(element, fallback = 794) {
  return new Promise((resolve) => {
    const read = () => Math.max(element.clientWidth, 1) || fallback;

    if (read() > 1) {
      resolve(read());
      return;
    }

    const observer = new ResizeObserver(() => {
      const width = read();
      if (width > 1) {
        observer.disconnect();
        resolve(width);
      }
    });
    observer.observe(element);
    requestAnimationFrame(() => {
      const width = read();
      if (width > 1) {
        observer.disconnect();
        resolve(width);
      }
    });
    window.setTimeout(() => {
      observer.disconnect();
      resolve(read());
    }, 500);
  });
}

/**
 * Renders a PDF with PDF.js (canvas pages). Used for Chromium where native embed is blank.
 */
export function PdfJsDocumentPreview({ pdfUrl, title = 'Document preview', onFail }) {
  const theme = useTheme();
  const containerRef = useRef(null);
  const onFailRef = useRef(onFail);
  onFailRef.current = onFail;
  const [loading, setLoading] = useState(true);

  const resolvedPdfUrl = resolvePdfUrl(pdfUrl);

  useEffect(() => {
    const container = containerRef.current;
    if (!resolvedPdfUrl || !container) return undefined;

    let cancelled = false;
    const abortFetch = new AbortController();

    const fail = () => {
      if (cancelled) return;
      cancelled = true;
      onFailRef.current?.();
    };

    const loadTimeout = window.setTimeout(fail, PDFJS_FAIL_MS);

    setLoading(true);
    container.replaceChildren();

    (async () => {
      try {
        const pdfjs = await getPdfjs();
        if (cancelled) return;

        const response = await fetch(resolvedPdfUrl, { signal: abortFetch.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const pdfData = await response.arrayBuffer();
        if (cancelled) return;

        const loadingTask = pdfjs.getDocument({ data: new Uint8Array(pdfData) });
        const pdf = await loadingTask.promise;
        if (cancelled) return;

        const containerWidth = await waitForLayoutWidth(container);
        if (cancelled) return;

        const pixelRatio = window.devicePixelRatio || 1;

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
          if (cancelled) return;
          const page = await pdf.getPage(pageNum);
          const baseViewport = page.getViewport({ scale: 1 });
          const scale = containerWidth / baseViewport.width;
          const viewport = page.getViewport({ scale: scale * pixelRatio });

          const canvas = document.createElement('canvas');
          canvas.setAttribute('role', 'img');
          canvas.setAttribute('aria-label', `${title} — page ${pageNum} of ${pdf.numPages}`);
          const context = canvas.getContext('2d');
          if (!context) throw new Error('No canvas context');

          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);
          canvas.style.width = `${viewport.width / pixelRatio}px`;
          canvas.style.height = `${viewport.height / pixelRatio}px`;
          canvas.style.display = 'block';

          await page.render({ canvasContext: context, viewport }).promise;
          if (cancelled) return;
          container.appendChild(canvas);
          if (pageNum === 1) setLoading(false);
        }

        if (!cancelled) setLoading(false);
      } catch {
        if (!cancelled && !abortFetch.signal.aborted) fail();
      } finally {
        window.clearTimeout(loadTimeout);
      }
    })();

    return () => {
      cancelled = true;
      abortFetch.abort();
      window.clearTimeout(loadTimeout);
    };
  }, [resolvedPdfUrl, title]);

  if (!resolvedPdfUrl) {
    return null;
  }

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: 200,
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
            minHeight: 240,
          }}
        >
          <CircularProgress size={24} />
          <Typography sx={{ fontSize: 14, color: theme.palette.textSecondary2 }}>Loading report…</Typography>
        </Box>
      ) : null}

      <Box
        ref={containerRef}
        sx={{
          width: '100%',
          backgroundColor: theme.palette.surfaceWhite,
          '& canvas': {
            maxWidth: '100%',
            verticalAlign: 'top',
          },
        }}
      />
    </Box>
  );
}
