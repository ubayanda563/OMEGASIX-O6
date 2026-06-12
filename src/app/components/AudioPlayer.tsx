import { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Heart, Volume2, VolumeX, Music } from 'lucide-react';
import { Track } from '../data/db';
import { formatDuration } from '../data/musicData';

interface AudioPlayerProps {
  track: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLiked: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (t: number) => void;
  onVolumeChange: (v: number) => void;
  onLikeToggle: () => void;
}

function ArtworkPlaceholder({ size = 48 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-lg flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
      }}
    >
      <Music size={size * 0.4} className="text-white" />
    </div>
  );
}

function ProgressBar({
  currentTime,
  duration,
  onSeek,
}: {
  currentTime: number;
  duration: number;
  onSeek: (t: number) => void;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const pct = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!barRef.current || duration === 0) return;
    const rect = barRef.current.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    onSeek(Math.max(0, Math.min(duration, ratio * duration)));
  };

  return (
    <div
      ref={barRef}
      onClick={handleClick}
      className="group relative h-1 rounded-full cursor-pointer"
      style={{ background: 'rgba(255,255,255,0.15)' }}
    >
      <div
        className="absolute left-0 top-0 h-full rounded-full transition-all"
        style={{ width: `${pct}%`, background: 'var(--accent-primary)' }}
      />
      {/* Scrubber thumb */}
      <div
        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          left: `${pct}%`,
          transform: `translate(-50%, -50%)`,
          background: 'var(--accent-primary)',
          boxShadow: '0 0 6px color-mix(in srgb, var(--accent-primary) 60%, transparent)',
        }}
      />
    </div>
  );
}

export function AudioPlayer({
  track,
  isPlaying,
  currentTime,
  duration,
  volume,
  isLiked,
  onPlayPause,
  onNext,
  onPrev,
  onSeek,
  onVolumeChange,
  onLikeToggle,
}: AudioPlayerProps) {
  if (!track) return null;

  const isMuted = volume === 0;

  return (
    <>
      {/* ── Desktop player bar ── */}
      <div
        className="hidden md:flex fixed bottom-0 left-0 right-0 z-40 items-center gap-6 px-6 py-3"
        style={{
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(60px) saturate(200%)',
          WebkitBackdropFilter: 'blur(60px) saturate(200%)',
          borderTop: '1px solid var(--glass-border)',
          boxShadow: '0 -8px 32px var(--glass-shadow)',
        }}
      >
        {/* Left: track info */}
        <div className="flex items-center gap-3 w-[220px] flex-shrink-0">
          {track.artwork ? (
            <img src={track.artwork} alt={track.album} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
          ) : (
            <ArtworkPlaceholder size={48} />
          )}
          <div className="min-w-0">
            <p className="text-text-primary font-semibold text-sm truncate">{track.title}</p>
            <p className="text-text-secondary text-xs truncate">{track.artist}</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={onLikeToggle}
            className="ml-1 p-1.5 flex-shrink-0"
            aria-label={isLiked ? 'Unlike' : 'Like'}
          >
            <Heart
              size={16}
              strokeWidth={2.2}
              className="transition-colors"
              style={{ color: isLiked ? 'var(--accent-secondary)' : 'var(--text-muted)', fill: isLiked ? 'var(--accent-secondary)' : 'none' }}
            />
          </motion.button>
        </div>

        {/* Center: controls + progress */}
        <div className="flex-1 flex flex-col items-center gap-2 max-w-lg mx-auto">
          <div className="flex items-center gap-5">
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={onPrev}
              aria-label="Previous track"
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              <SkipBack size={18} strokeWidth={2.2} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}
              onClick={onPlayPause}
              aria-label={isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white"
              style={{ background: 'var(--accent-primary)', boxShadow: '0 4px 14px color-mix(in srgb, var(--accent-primary) 40%, transparent)' }}
            >
              {isPlaying
                ? <Pause size={16} fill="white" strokeWidth={0} />
                : <Play size={16} fill="white" strokeWidth={0} className="ml-0.5" />
              }
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={onNext}
              aria-label="Next track"
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              <SkipForward size={18} strokeWidth={2.2} />
            </motion.button>
          </div>
          <div className="w-full flex items-center gap-2">
            <span className="text-text-muted text-xs w-8 text-right tabular-nums">{formatDuration(currentTime)}</span>
            <div className="flex-1">
              <ProgressBar currentTime={currentTime} duration={duration} onSeek={onSeek} />
            </div>
            <span className="text-text-muted text-xs w-8 tabular-nums">{formatDuration(duration)}</span>
          </div>
        </div>

        {/* Right: volume */}
        <div className="flex items-center gap-2 w-[140px] justify-end flex-shrink-0">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onVolumeChange(isMuted ? 0.7 : 0)}
            className="text-text-secondary hover:text-text-primary transition-colors"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={16} strokeWidth={2.2} /> : <Volume2 size={16} strokeWidth={2.2} />}
          </motion.button>
          <input
            type="range"
            min={0} max={1} step={0.01}
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-20 h-1 rounded-full cursor-pointer accent-[var(--accent-primary)]"
            style={{ accentColor: 'var(--accent-primary)' }}
            aria-label="Volume"
          />
        </div>
      </div>

      {/* ── Mobile mini player ── */}
      <AnimatePresence>
        {track && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="md:hidden fixed bottom-[4.75rem] left-3 right-3 z-40 rounded-2xl overflow-hidden"
            style={{
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(60px) saturate(200%)',
              WebkitBackdropFilter: 'blur(60px) saturate(200%)',
              boxShadow: '0 8px 32px var(--glass-shadow), inset 0 1px 1px var(--glass-highlight), inset 0 0 0 1px var(--glass-border)',
            }}
          >
            {/* Progress line at top */}
            <div className="h-0.5 w-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div
                className="h-full"
                style={{
                  width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%',
                  background: 'var(--accent-primary)',
                  transition: 'width 0.5s linear',
                }}
              />
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              {track.artwork ? (
                <img src={track.artwork} alt={track.album} className="w-11 h-11 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <ArtworkPlaceholder size={44} />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-text-primary font-semibold text-sm truncate">{track.title}</p>
                <p className="text-text-secondary text-xs truncate">{track.artist}</p>
              </div>
              <div className="flex items-center gap-1">
                <motion.button whileTap={{ scale: 0.85 }} onClick={onLikeToggle} className="p-2" aria-label={isLiked ? 'Unlike' : 'Like'} aria-pressed={isLiked}>
                  <Heart size={16} strokeWidth={2.2} style={{ color: isLiked ? 'var(--accent-secondary)' : 'var(--text-muted)', fill: isLiked ? 'var(--accent-secondary)' : 'none' }} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.85 }}
                  onClick={onPlayPause}
                  aria-label={isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--accent-primary)', boxShadow: '0 4px 12px color-mix(in srgb, var(--accent-primary) 35%, transparent)' }}
                >
                  {isPlaying
                    ? <Pause size={14} fill="white" strokeWidth={0} />
                    : <Play size={14} fill="white" strokeWidth={0} className="ml-0.5" />
                  }
                </motion.button>
                <motion.button whileTap={{ scale: 0.85 }} onClick={onNext} className="p-2" aria-label="Skip to next track">
                  <SkipForward size={16} strokeWidth={2.2} className="text-text-primary" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
