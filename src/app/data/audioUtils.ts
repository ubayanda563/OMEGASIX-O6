export type ReverbPreset = 'None' | 'Small Room' | 'Studio' | 'Concert Hall';

export async function computeAudioHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export async function generateWaveformSamples(file: File, sampleCount = 96): Promise<number[]> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const offlineContext = new OfflineAudioContext(1, 1, 44100);
    const audioBuffer = await offlineContext.decodeAudioData(arrayBuffer);
    const channelData = audioBuffer.numberOfChannels > 0 ? audioBuffer.getChannelData(0) : new Float32Array(0);
    const step = Math.max(1, Math.floor(channelData.length / sampleCount));
    const waveform = [];
    let max = 0;

    for (let i = 0; i < sampleCount; i += 1) {
      const start = i * step;
      const end = Math.min(start + step, channelData.length);
      let sum = 0;
      for (let j = start; j < end; j += 1) {
        sum += channelData[j] * channelData[j];
      }
      const mean = end > start ? sum / (end - start) : 0;
      const value = Math.sqrt(mean);
      waveform.push(value);
      max = Math.max(max, value);
    }

    if (max <= 0) return waveform.map(() => 0);
    return waveform.map((value) => value / max);
  } catch {
    return Array(sampleCount).fill(0);
  }
}

export function createReverbImpulse(audioContext: AudioContext, preset: ReverbPreset): AudioBuffer {
  const lengthSeconds = preset === 'Small Room' ? 1.0 : preset === 'Studio' ? 1.8 : 3.2;
  const decay = preset === 'Small Room' ? 1.8 : preset === 'Studio' ? 2.4 : 3.5;
  const sampleRate = audioContext.sampleRate;
  const length = sampleRate * lengthSeconds;
  const impulse = audioContext.createBuffer(2, length, sampleRate);

  for (let channel = 0; channel < 2; channel += 1) {
    const channelData = impulse.getChannelData(channel);
    for (let i = 0; i < length; i += 1) {
      const n = 1 - i / length;
      channelData[i] = (Math.random() * 2 - 1) * Math.pow(n, decay);
    }
  }

  return impulse;
}

export const EQ_BANDS = [
  { freq: 32, type: 'lowshelf' as const },
  { freq: 64, type: 'peaking' as const },
  { freq: 125, type: 'peaking' as const },
  { freq: 250, type: 'peaking' as const },
  { freq: 500, type: 'peaking' as const },
  { freq: 1000, type: 'peaking' as const },
  { freq: 2000, type: 'peaking' as const },
  { freq: 4000, type: 'peaking' as const },
  { freq: 8000, type: 'peaking' as const },
  { freq: 16000, type: 'highshelf' as const },
];

export const DEFAULT_EQ_GAINS = Array(EQ_BANDS.length).fill(0);

export function formatTimeCode(seconds: number) {
  const mm = Math.floor(seconds / 60);
  const ss = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  const cs = Math.floor((seconds % 1) * 100)
    .toString()
    .padStart(2, '0');
  return `[${mm}:${ss}.${cs}]`;
}

export function dbToLinear(db: number) {
  return Math.pow(10, db / 20);
}

export function getTrackQualityLabel(bitrate?: number) {
  if (!bitrate) return 'Unknown quality';
  if (bitrate < 128) return 'Low quality (<128kbps)';
  if (bitrate < 256) return 'Standard quality';
  return 'High quality';
}
