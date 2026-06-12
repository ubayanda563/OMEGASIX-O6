// Re-export Track type from db for backward compat
export type { Track } from './db';

export const SUPPORTED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/mp4',
  'audio/ogg',
  'audio/flac',
  'audio/wav',
  'audio/x-wav',
  'audio/aac',
  'audio/opus',
  'audio/webm',
  'audio/x-m4a',
];

export const SUPPORTED_EXTENSIONS = '.mp3,.m4a,.flac,.wav,.ogg,.aac,.opus,.weba';

export function formatDuration(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
