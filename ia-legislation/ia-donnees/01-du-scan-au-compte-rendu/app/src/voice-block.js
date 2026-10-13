import { Block } from './workflow.js';
import { STT_MODELS, WhisperAdapter, VoskAdapter } from './stt-models.js';

async function decodeTo16kMono(file) {
  const context = new AudioContext();
  let decoded;
  try {
    decoded = await context.decodeAudioData(await file.arrayBuffer());
  } catch {
    throw new Error('Audio illisible dans ce navigateur. Essaie un fichier WAV ou MP3.');
  } finally {
    await context.close();
  }
  if (decoded.duration > 90) {
    throw new Error('Pour cette démo, utilise une note vocale de 90 secondes maximum.');
  }

  const target = new OfflineAudioContext(1, Math.ceil(decoded.duration * 16000), 16000);
  const source = target.createBufferSource();
  source.buffer = decoded;
  source.connect(target.destination);
  source.start();
  const rendered = await target.startRendering();
  const samples = rendered.getChannelData(0);
  const peak = samples.reduce((maximum, value) => Math.max(maximum, Math.abs(value)), 0);
  if (peak < 0.001) throw new Error('Audio silencieux ou presque inaudible. Vérifie le micro et réécoute l’enregistrement.');
  return { samples, duration: decoded.duration };
}

export class VoiceBlock extends Block {
  constructor() {
    super('voice');
    this.adapter = null;
    this.engine = null;
  }

  async run({ file, language, engine = 'whisper-small', onProgress, onAudioInfo }) {
    if (!file) throw new Error('Choisis un fichier audio. Tu peux aussi saisir une note directement.');
    const model = STT_MODELS[engine];
    if (!model) throw new Error('Modèle de transcription inconnu.');
    onProgress?.('Décodage audio…');
    const { samples, duration } = await decodeTo16kMono(file);
    onAudioInfo?.({ duration });
    if (this.engine !== engine) {
      await this.adapter?.dispose();
      this.adapter = engine === 'vosk-small' ? new VoskAdapter() : new WhisperAdapter(model.modelId);
      this.engine = engine;
    }
    const text = await this.adapter.transcribe(samples, language, onProgress);
    if (!text) throw new Error('Aucune parole reconnue. Réécoute l’audio ou essaie un autre modèle.');
    return text;
  }
}
