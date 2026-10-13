// Le bloc voix dépend de cette interface commune, pas d'un moteur particulier.
export const STT_MODELS = {
  'whisper-small': {
    label: 'Whisper Small',
    description: 'Modèle multilingue plus volumineux. À essayer pour privilégier la précision ; premier chargement plus long.',
    modelId: 'Xenova/whisper-small',
  },
  'whisper-base': {
    label: 'Whisper Base',
    description: 'Modèle multilingue plus léger, pour comparer vitesse et qualité avec Small.',
    modelId: 'Xenova/whisper-base',
  },
  'vosk-small': {
    label: 'Vosk Small',
    description: 'Autre moteur open source, léger et local. Modèle français 0.22 ou allemand 0.15 ; texte sans ponctuation automatique.',
  },
};

export class WhisperAdapter {
  constructor(modelId) { this.modelId = modelId; this.transcriber = null; }

  async transcribe(samples, language, onProgress) {
    if (!this.transcriber) {
      onProgress?.('Chargement du modèle Whisper… Le premier téléchargement peut prendre plusieurs minutes.');
      const { pipeline } = await import('@huggingface/transformers');
      this.transcriber = await pipeline('automatic-speech-recognition', this.modelId, {
        dtype: 'q8', device: 'wasm',
        progress_callback: (event) => {
          if (event.status === 'progress' && Number.isFinite(event.progress)) {
            onProgress?.(`Téléchargement du modèle : ${Math.round(event.progress)} % du fichier en cours…`);
          }
        },
      });
    }
    onProgress?.('Transcription locale de tout l’audio…');
    const result = await this.transcriber(samples, {
      language, task: 'transcribe', chunk_length_s: 30, stride_length_s: 5,
    });
    return result.text.trim();
  }

  async dispose() { await this.transcriber?.dispose(); this.transcriber = null; }
}

const VOSK_FILES = {
  french: 'vosk-model-small-fr-0.22',
  german: 'vosk-model-small-de-0.15',
};

export class VoskAdapter {
  constructor() { this.model = null; this.language = null; }

  async transcribe(samples, language, onProgress) {
    if (!VOSK_FILES[language]) throw new Error('Cette langue n’est pas disponible pour Vosk.');
    if (!this.model || this.language !== language) {
      await this.dispose();
      onProgress?.('Chargement du modèle Vosk local…');
      const url = new URL(`${import.meta.env.BASE_URL}models/${VOSK_FILES[language]}.tar.gz`, location.href).href;
      const response = await fetch(url, { method: 'HEAD' });
      if (!response.ok || response.headers.get('content-type')?.includes('text/html')) {
        throw new Error('Modèle Vosk absent. Lance « npm run models:vosk » dans le dossier app, puis réessaie.');
      }
      const { Model } = await import('vosk-browser');
      const model = new Model(url, -1);
      try {
        await new Promise((resolve, reject) => {
          const timer = setTimeout(() => reject(new Error('Chargement Vosk trop long. Recharge la page et réessaie.')), 120000);
          const finish = (error) => { clearTimeout(timer); error ? reject(error) : resolve(); };
          model.on('load', (message) => finish(message.result ? null : new Error('Impossible de charger Vosk.')));
          model.on('error', () => finish(new Error('Impossible de charger Vosk. Vérifie les fichiers du modèle.')));
        });
        this.model = model;
        this.language = language;
      } catch (error) { model.terminate(); throw error; }
    }

    const recognizer = new this.model.KaldiRecognizer(16000);
    const chunkSize = 8000;
    const chunkCount = Math.ceil(samples.length / chunkSize);
    try {
      return await new Promise((resolve, reject) => {
        const phrases = [];
        let received = 0;
        const timer = setTimeout(() => reject(new Error('La transcription Vosk a pris trop de temps. Réessaie avec un audio plus court.')), 120000);
        const receive = (message) => {
          if (message.result.text) phrases.push(message.result.text);
          received++;
          onProgress?.(`Transcription Vosk : ${Math.min(100, Math.round(received / (chunkCount + 1) * 100))} %…`);
          // Chaque morceau produit une réponse, puis on attend aussi la dernière phrase.
          if (received === chunkCount + 1) { clearTimeout(timer); resolve(phrases.join(' ').trim()); }
        };
        recognizer.on('result', receive);
        recognizer.on('partialresult', receive);
        recognizer.on('error', () => { clearTimeout(timer); reject(new Error('Vosk n’a pas pu transcrire cet audio.')); });
        for (let offset = 0; offset < samples.length; offset += chunkSize) {
          recognizer.acceptWaveformFloat(samples.subarray(offset, offset + chunkSize), 16000);
        }
        recognizer.retrieveFinalResult();
      });
    } finally { recognizer.remove(); }
  }

  async dispose() { this.model?.terminate(); this.model = null; this.language = null; }
}
