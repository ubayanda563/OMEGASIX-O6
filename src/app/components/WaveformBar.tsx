import { useMemo } from 'react';

interface WaveformBarProps {
  waveform?: number[];
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export function WaveformBar({ waveform, currentTime, duration, onSeek }: WaveformBarProps) {
  const samples = waveform && waveform.length > 0 ? waveform : Array.from({ length: 96 }, () => 0.16);
  const progress = duration > 0 ? Math.min(Math.max(currentTime / duration, 0), 1) : 0;
  const bars = useMemo(
    () => samples.map((level, index) => ({ level, active: index / samples.length <= progress })),
    [samples, progress]
  );

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    onSeek(Math.max(0, Math.min(duration, ratio * duration)));
  };

  return (
    <div
      className="relative h-14 w-full cursor-pointer overflow-hidden rounded-2xl"
      onClick={handleClick}
      style={{ background: 'rgba(255, 255, 255, 0.08)' }}
    >
      <div className="absolute inset-0 grid grid-cols-[repeat(96,1fr)] items-end gap-[1px] px-1 py-3">
        {bars.map((bar, index) => (
          <div
            key={index}
            className="rounded-full transition-colors"
            style={{
              height: `${Math.max(8, bar.level * 100)}%`,
              background: bar.active ? 'var(--accent-primary)' : 'rgba(255,255,255,0.12)',
            }}
          />
        ))}
      </div>
      <div
        className="absolute inset-y-0 left-0 z-10 pointer-events-none"
        style={{ width: `${progress * 100}%`, background: 'linear-gradient(90deg, rgba(10,132,255,0.65), rgba(251,191,36,0.65))' }}
      />
    </div>
  );
}
