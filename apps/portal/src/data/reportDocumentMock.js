/** Demo service-visit report PDF (A4) shown in the report preview drawer. */
const SAMPLE_REPORT_PDF = '/sample-reports/site-hit-report.pdf';

export function getReportPdfUrl(_report) {
  return SAMPLE_REPORT_PDF;
}

/** Native page width from siteHitReport PDF MediaBox (points). */
export const REPORT_PDF_PAGE_WIDTH_PT = 595.92;
