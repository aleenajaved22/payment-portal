import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

let pdfjsModulePromise;

/** Lazy-load PDF.js once with a Vite-resolved worker URL (version always matches the bundle). */
export function getPdfjs() {
  if (!pdfjsModulePromise) {
    pdfjsModulePromise = import('pdfjs-dist').then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
      return pdfjs;
    });
  }
  return pdfjsModulePromise;
}
