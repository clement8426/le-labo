import * as pdfjs from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

export async function* renderPdfPages(file) {
  if (!file || !(file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))) {
    throw new Error('Choisis un fichier PDF.');
  }
  if (file.size > 15 * 1024 * 1024) {
    throw new Error('Ce PDF dépasse 15 Mo ; choisis un document plus court pour la démo.');
  }

  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
  const pdf = await loadingTask.promise;
  try {
    if (pdf.numPages > 10) throw new Error('La démo accepte au maximum 10 pages.');
    for (let number = 1; number <= pdf.numPages; number += 1) {
      const page = await pdf.getPage(number);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(viewport.width);
      canvas.height = Math.round(viewport.height);
      await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
      yield { number, count: pdf.numPages, canvas };
      canvas.width = 0;
      canvas.height = 0;
      page.cleanup();
    }
  } finally {
    await loadingTask.destroy();
  }
}
