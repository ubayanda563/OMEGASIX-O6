import { Track } from './db';

const STORAGE_KEY = 'resonance-analytics-events';

export interface PlayEvent {
  trackId: string;
  timestamp: number;
  duration: number;
  skipped: boolean;
}

export function loadPlayEvents(): PlayEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PlayEvent[]) : [];
  } catch {
    return [];
  }
}

export function savePlayEvent(event: PlayEvent) {
  if (typeof window === 'undefined') return;
  const events = loadPlayEvents();
  const updated = [...events, event].slice(-500);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export interface PredictivePin {
  id: string;
  label: string;
  subtitle: string;
  trackId: string;
}

export function getPredictivePins(tracks: Track[], hour = new Date().getHours()): PredictivePin[] {
  if (tracks.length === 0) return [];
  const events = loadPlayEvents();
  const windowStart = Date.now() - 14 * 24 * 60 * 60 * 1000;
  const relevant = events.filter((event) => event.timestamp >= windowStart && Math.abs(new Date(event.timestamp).getHours() - hour) <= 1);
  const counts = new Map<string, number>();
  const metadata = new Map<string, Track>();

  for (const event of relevant) {
    const track = tracks.find((t) => t.id === event.trackId);
    if (!track) continue;
    const key = `${track.genre}::${track.artist}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
    metadata.set(key, track);
  }

  const sorted = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([key, count]) => {
      const track = metadata.get(key)!;
      return {
        id: key,
        label: `${track.genre} • ${track.artist}`,
        subtitle: `Played ${count} time${count === 1 ? '' : 's'} around ${hour}:00`,
        trackId: track.id,
      };
    });

  if (sorted.length > 0) return sorted;

  const fallback = tracks.slice(0, 6).map((track) => ({
    id: track.id,
    label: track.genre,
    subtitle: track.artist,
    trackId: track.id,
  }));

  return fallback;
}

export function getRetentionSignal(): { message: string | null; suggestedTracks: Track[] } {
  const events = loadPlayEvents();
  const now = Date.now();
  const weekStart = now - 7 * 24 * 60 * 60 * 1000;
  const recent = events.filter((event) => event.timestamp >= weekStart);
  if (recent.length < 6) return { message: null, suggestedTracks: [] };

  const skipRate = recent.filter((event) => event.skipped).length / recent.length;
  const totalTime = recent.reduce((sum, event) => sum + event.duration, 0);
  if (skipRate < 0.35 || totalTime >= 15 * 60) {
    return { message: null, suggestedTracks: [] };
  }

  return {
    message: 'Refresh Your Sound: your skip rate has climbed this week. Try a fresh pick from forgotten gems.',
    suggestedTracks: [],
  };
}
