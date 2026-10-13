export function drawWaveform(canvas, levels = [], recording = false) {
  const ratio = window.devicePixelRatio || 1;
  const width = Math.max(1, Math.round(canvas.clientWidth * ratio));
  const height = Math.max(1, Math.round(canvas.clientHeight * ratio));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  const context = canvas.getContext('2d');
  context.fillStyle = '#f7f3ea';
  context.fillRect(0, 0, width, height);
  context.strokeStyle = '#ded8cc';
  context.lineWidth = ratio;
  context.beginPath();
  context.moveTo(0, height / 2);
  context.lineTo(width, height / 2);
  context.stroke();

  if (!levels.length) return;
  const count = 72;
  const step = width / count;
  const barWidth = Math.max(2 * ratio, step * 0.62);
  context.fillStyle = recording ? '#b4432b' : '#3c6e63';
  for (let index = 0; index < levels.length; index += 1) {
    const barHeight = Math.max(3 * ratio, levels[index] * height * 0.85);
    const x = width - (levels.length - index) * step;
    context.fillRect(x, (height - barHeight) / 2, barWidth, barHeight);
  }
}
