import { Block } from './workflow.js';
import { renderPdfPages } from './pdf-pages.js';

class PaddleAdapter {
  constructor() {
    this.engine = null;
  }

  async recognize(canvas) {
    if (!this.engine) {
      const { PaddleOCR } = await import('@paddleocr/paddleocr-js');
      this.engine = await PaddleOCR.create({
        lang: 'fr',
        ocrVersion: 'PP-OCRv6',
        worker: true,
        ortOptions: { backend: 'wasm', numThreads: 1, simd: true },
      });
    }
    const [result] = await this.engine.predict(canvas);
    return result.items.map((item) => item.text).join('\n');
  }
}

class TesseractAdapter {
  constructor() {
    this.worker = null;
  }

  async recognize(canvas) {
    if (!this.worker) {
      const { createWorker } = await import('tesseract.js');
      this.worker = await createWorker(['fra', 'deu']);
    }
    const { data } = await this.worker.recognize(canvas);
    return data.text.trim();
  }
}

export class OcrBlock extends Block {
  constructor() {
    super('document');
    this.adapters = {
      paddle: new PaddleAdapter(),
      tesseract: new TesseractAdapter(),
    };
  }

  async run({ file, engine, onProgress }) {
    const adapter = this.adapters[engine];
    if (!adapter) throw new Error('Moteur OCR inconnu.');
    const pages = [];
    for await (const { number, count, canvas } of renderPdfPages(file)) {
      onProgress?.(`Lecture de la page ${number}/${count}…`);
      const text = await adapter.recognize(canvas);
      pages.push(`--- Page ${number} ---\n${text || '[Aucun texte reconnu]'}`);
    }
    return pages.join('\n\n');
  }
}
