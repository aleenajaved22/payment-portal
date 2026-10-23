import { useCallback, useState } from 'react';
import { getReportPdfUrl } from '../data/reportDocumentMock';
import { shouldUsePdfJsCanvas } from '../lib/shouldUsePdfJsCanvas';
import { EmbeddedPdfPreview } from './EmbeddedPdfPreview';
import { PdfJsDocumentPreview } from './PdfJsDocumentPreview';

export function ReportDocumentPreview({ report }) {
  const [useNativeFallback, setUseNativeFallback] = useState(false);
  const handlePdfJsFail = useCallback(() => setUseNativeFallback(true), []);

  if (!report) return null;

  const pdfUrl = getReportPdfUrl(report);
  const title = `${report.reportType} for ${report.site}`;
  const preferPdfJs = shouldUsePdfJsCanvas() && !useNativeFallback;

  if (!preferPdfJs) {
    return <EmbeddedPdfPreview pdfUrl={pdfUrl} title={title} loadingLabel="Loading report…" />;
  }

  return (
    <PdfJsDocumentPreview
      pdfUrl={pdfUrl}
      title={title}
      onFail={handlePdfJsFail}
    />
  );
}
