import './styles.css';
import { Workflow } from './workflow.js';
import { OcrBlock } from './ocr-block.js';
import { VoiceBlock } from './voice-block.js';
import { STT_MODELS } from './stt-models.js';
import { ReportBlock } from './report-block.js';
import { MicrophoneRecorder } from './microphone-recorder.js';
import { drawWaveform } from './waveform.js';

const flow = new Workflow([new OcrBlock(), new VoiceBlock(), new ReportBlock()]);
flow.connect('document', 'report', 'document');
flow.connect('voice', 'report', 'note');

const element = (id) => document.getElementById(id);
const documentText = element('document-text');
const voiceText = element('voice-text');
const reportText = element('report-text');
const voiceFile = element('voice-file');
const recordButton = element('record-voice');
const runVoiceButton = element('run-voice');
const waveform = element('voice-waveform');
const voicePreview = element('voice-preview');
const voiceEngine = element('voice-engine');
const voiceLanguage = element('voice-language');
for (const [value, model] of Object.entries(STT_MODELS)) {
  voiceEngine.add(new Option(model.label, value));
}
function updateModelHelp() {
  element('voice-model-help').textContent = STT_MODELS[voiceEngine.value].description;
}
voiceEngine.addEventListener('change', updateModelHelp);
updateModelHelp();
let voiceSource = null;
let previewUrl = null;
let stoppingRecording = false;
let waveformLevels = [];
let lastWaveformSample = 0;

drawWaveform(waveform);
window.addEventListener('resize', () => {
  drawWaveform(waveform, waveformLevels, recorder.isRecording);
});

function setStatus(id, message, kind = '') {
  const target = element(`${id}-status`);
  target.textContent = message;
  target.dataset.kind = kind;
}

function formatTime(ms) {
  return ms < 1000 ? `${Math.round(ms)} ms` : `${(ms / 1000).toFixed(1)} s`;
}

async function runWithFeedback(id, button, task) {
  button.disabled = true;
  const started = performance.now();
  try {
    await task();
    const time = formatTime(performance.now() - started);
    element(`${id}-time`).textContent = `Temps : ${time} · ${id === 'report' ? 'Aucun appel API' : 'Traitement local'}`;
    setStatus(id, 'Terminé. Relis le texte avant de continuer.', 'success');
  } catch (error) {
    setStatus(id, error?.message || 'Une erreur est survenue.', 'error');
    console.error(error);
  } finally {
    button.disabled = false;
  }
}

element('run-document').addEventListener('click', () => {
  const button = element('run-document');
  runWithFeedback('document', button, async () => {
    const file = element('document-file').files[0];
    if (!file) throw new Error('Choisis d’abord un PDF fictif.');
    documentText.value = '';
    flow.setOutput('document', '');
    setStatus('document', 'Préparation de l’OCR…');
    const text = await flow.execute('document', {
      file,
      engine: element('ocr-engine').value,
      onProgress: (message) => setStatus('document', message),
    });
    documentText.value = text;
  });
});

async function transcribeAudio(file) {
  let duration = 0;
  let transcript = null;
  recordButton.disabled = true;
  voiceFile.disabled = true;
  voiceEngine.disabled = true;
  voiceLanguage.disabled = true;
  voiceText.readOnly = true;
  element('voice-time').textContent = 'Temps : — · Traitement local';
  try {
    await runWithFeedback('voice', runVoiceButton, async () => {
      if (!file) throw new Error('Choisis un audio, ou saisis une note sans lancer la transcription.');
      setStatus('voice', 'Préparation de l’audio…');
      const text = await flow.execute('voice', {
        file,
        language: voiceLanguage.value,
        engine: voiceEngine.value,
        onAudioInfo: (info) => {
          duration = info.duration;
          element('voice-audio-info').textContent = `Audio analysé : ${duration.toFixed(1)} s · ${STT_MODELS[voiceEngine.value].label}`;
        },
        onProgress: (message) => setStatus('voice', message),
      });
      voiceText.value = text;
      transcript = text;
    });
    if (transcript && duration > 5 && transcript.split(/\s+/).length <= 2) {
      setStatus('voice', 'Très peu de texte reconnu. Réécoute l’audio pour vérifier la capture, puis essaie un autre modèle.', 'warning');
    }
  } finally {
    recordButton.disabled = false;
    voiceFile.disabled = false;
    voiceEngine.disabled = false;
    voiceLanguage.disabled = false;
    voiceText.readOnly = false;
  }
}

function setPreview(file) {
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  previewUrl = file ? URL.createObjectURL(file) : null;
  voicePreview.hidden = !file;
  voicePreview.src = previewUrl || '';
  element('voice-audio-info').textContent = file ? 'Audio prêt à réécouter et à comparer.' : 'Audio : — · 90 secondes maximum';
  runVoiceButton.textContent = file ? 'Retranscrire cet audio' : 'Transcrire le fichier importé';
}

function setRecordingUi(recording) {
  recordButton.dataset.recording = String(recording);
  recordButton.setAttribute('aria-pressed', String(recording));
  element('record-label').textContent = recording ? 'Arrêter et transcrire' : 'Enregistrer au micro';
  runVoiceButton.disabled = recording;
  voiceFile.disabled = recording;
  voiceEngine.disabled = recording;
  voiceLanguage.disabled = recording;
}

function formatRecordingTime(ms) {
  const seconds = Math.floor(ms / 1000);
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

const recorder = new MicrophoneRecorder({
  onWaveform: (samples) => {
    const now = performance.now();
    if (now - lastWaveformSample < 90) return;
    lastWaveformSample = now;
    const power = samples.reduce((sum, sample) => sum + ((sample - 128) / 128) ** 2, 0) / samples.length;
    waveformLevels.push(Math.min(1, Math.sqrt(power) * 3));
    if (waveformLevels.length > 72) waveformLevels.shift();
    drawWaveform(waveform, waveformLevels, true);
  },
  onElapsed: (ms) => {
    element('record-time').textContent = formatRecordingTime(ms);
    if (ms >= 90000) finishRecording();
  },
});

async function finishRecording() {
  if (stoppingRecording || !recorder.isRecording) return;
  stoppingRecording = true;
  recordButton.disabled = true;
  try {
    const file = await recorder.stop();
    voiceSource = file;
    voiceFile.value = '';
    setPreview(file);
    setRecordingUi(false);
    drawWaveform(waveform, waveformLevels);
    setStatus('voice', 'Enregistrement terminé. Transcription locale en cours…');
    await transcribeAudio(file);
  } catch (error) {
    setStatus('voice', error?.message || 'Impossible de terminer l’enregistrement.', 'error');
    console.error(error);
  } finally {
    setRecordingUi(false);
    recordButton.disabled = false;
    stoppingRecording = false;
  }
}

recordButton.addEventListener('click', async () => {
  if (recorder.isRecording) {
    await finishRecording();
    return;
  }
  recordButton.disabled = true;
  try {
    waveformLevels = [];
    lastWaveformSample = 0;
    drawWaveform(waveform);
    await recorder.start();
    element('record-time').textContent = '00:00';
    setRecordingUi(true);
    setStatus('voice', 'Enregistrement local en cours… Parle, puis arrête pour transcrire.');
  } catch (error) {
    setStatus('voice', error?.message || 'Impossible d’ouvrir le microphone.', 'error');
    console.error(error);
  } finally {
    recordButton.disabled = false;
  }
});

voiceFile.addEventListener('change', () => {
  voiceSource = voiceFile.files[0] || null;
  setPreview(voiceSource);
  if (voiceSource) setStatus('voice', 'Fichier prêt. Lance la transcription.');
});

runVoiceButton.addEventListener('click', () => {
  transcribeAudio(voiceSource);
});

documentText.addEventListener('input', () => flow.setOutput('document', documentText.value));
voiceText.addEventListener('input', () => flow.setOutput('voice', voiceText.value));

element('run-report').addEventListener('click', () => {
  const button = element('run-report');
  runWithFeedback('report', button, async () => {
    setStatus('report', 'Assemblage local des deux entrées…');
    reportText.value = await flow.execute('report');
  });
});
