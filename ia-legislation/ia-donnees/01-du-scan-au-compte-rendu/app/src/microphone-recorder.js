export class MicrophoneRecorder {
  constructor({ onWaveform, onElapsed }) {
    this.onWaveform = onWaveform;
    this.onElapsed = onElapsed;
    this.mediaRecorder = null;
    this.stream = null;
    this.audioContext = null;
    this.animationFrame = null;
    this.timer = null;
    this.chunks = [];
  }

  get isRecording() {
    return this.mediaRecorder?.state === 'recording';
  }

  async start() {
    if (this.isRecording) return;
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      throw new Error('Ce navigateur ne prend pas en charge l’enregistrement au micro.');
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, channelCount: 1 },
      });
    } catch (error) {
      if (error.name === 'NotAllowedError') throw new Error('Autorise le microphone dans le navigateur pour enregistrer.');
      if (error.name === 'NotFoundError') throw new Error('Aucun microphone détecté.');
      throw new Error(`Impossible d’ouvrir le microphone : ${error.message}`);
    }

    try {
      const preferred = 'audio/webm;codecs=opus';
      const options = MediaRecorder.isTypeSupported(preferred) ? { mimeType: preferred } : undefined;
      this.mediaRecorder = new MediaRecorder(this.stream, options);
      this.chunks = [];
      this.mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size) this.chunks.push(event.data);
      });

      this.audioContext = new AudioContext();
      const source = this.audioContext.createMediaStreamSource(this.stream);
      const analyser = this.audioContext.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(analyser);
      const samples = new Uint8Array(analyser.frequencyBinCount);
      const draw = () => {
        analyser.getByteTimeDomainData(samples);
        this.onWaveform(samples);
        this.animationFrame = requestAnimationFrame(draw);
      };

      this.mediaRecorder.start(250);
      const started = performance.now();
      draw();
      this.timer = setInterval(() => this.onElapsed(performance.now() - started), 250);
    } catch (error) {
      await this.cleanup();
      throw error;
    }
  }

  async stop() {
    if (!this.isRecording) throw new Error('Aucun enregistrement en cours.');
    const recorder = this.mediaRecorder;
    try {
      await new Promise((resolve, reject) => {
        recorder.addEventListener('stop', resolve, { once: true });
        recorder.addEventListener('error', (event) => reject(event.error), { once: true });
        recorder.stop();
      });
      const type = recorder.mimeType || 'audio/webm';
      const extension = type.includes('webm') ? 'webm' : 'audio';
      const file = new File(this.chunks, `note-vocale.${extension}`, { type });
      if (!file.size) throw new Error('Le microphone n’a produit aucun son.');
      return file;
    } finally {
      await this.cleanup();
    }
  }

  async cleanup() {
    if (this.animationFrame !== null) cancelAnimationFrame(this.animationFrame);
    if (this.timer !== null) clearInterval(this.timer);
    this.animationFrame = null;
    this.timer = null;
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
    if (this.audioContext && this.audioContext.state !== 'closed') await this.audioContext.close();
    this.audioContext = null;
    this.mediaRecorder = null;
  }
}
