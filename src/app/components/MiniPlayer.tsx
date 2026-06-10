import { motion } from 'motion/react';
import { Play, Pause, SkipForward, Heart } from 'lucide-react';
import { GlassPanel } from './GlassPanel';
import type { Track } from '../data/musicData';

interface MiniPlayerProps {
  track: Track | null;
  isPlaying: boolean;
  isLiked: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onLikeToggle: () => void;
}

export function MiniPlayer({ track, isPlaying, isLiked, onPlayPause, onNext, onLikeToggle }: MiniPlayerProps) {
  if (!track) return null;

  return (
    <div className="md:hidden fixed bottom-20 left-4 right-4 z-40">
      <GlassPanel className="p-3" withGlare={false}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
            <img src={track.image} alt={track.album} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-text-primary text-sm font-semibold truncate">{track.title}</h4>
            <p className="text-text-secondary text-xs truncate">{track.artist}</p>
          </div>
          <div className="flex items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.85 }}
              onClick={onLikeToggle}
              className="p-2"
            >
              <Heart
                size={16}
                strokeWidth={2.2}
                className={`transition-colors ${
                  isLiked ? 'fill-accent-secondary text-accent-secondary' : 'text-text-muted'
                }`}
              />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.85 }}
              onClick={onPlayPause}
              className="p-2 rounded-full"
              style={{
                background: 'var(--accent-primary)',
                boxShadow: '0 4px 12px rgba(0, 122, 255, 0.3)',
              }}
            >
              {isPlaying ? (
                <Pause size={16} fill="white" strokeWidth={0} className="text-white" />
              ) : (
                <Play size={16} fill="white" strokeWidth={0} className="text-white" />
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.85 }}
              onClick={onNext}
              className="p-2"
            >
              <SkipForward size={16} strokeWidth={2.2} className="text-text-primary" />
            </motion.button>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
