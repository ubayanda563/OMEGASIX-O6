import { motion } from 'motion/react';
import { Heart, Play, Clock, Music } from 'lucide-react';
import { GlassPanel } from '../components/GlassPanel';
import { Track } from '../data/db';
import { formatDuration } from '../data/musicData';

interface FavoritesScreenProps {
  likedTracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  onTrackSelect: (id: string) => void;
  onToggleLike: (id: string) => void;
}

function TrackArtwork({ track }: { track: Track }) {
  if (track.artwork) {
    return <img src={track.artwork} alt={track.album} className="w-full h-full object-cover" />;
  }
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
      <Music size={20} className="text-white opacity-80" />
    </div>
  );
}

export function FavoritesScreen({ likedTracks, currentTrack, isPlaying, onTrackSelect, onToggleLike }: FavoritesScreenProps) {
  const totalDuration = likedTracks.reduce((sum, t) => sum + (t.duration || 0), 0);

  return (
    <div className="space-y-6 pb-24 md:pb-6">
      <GlassPanel className="p-6">
        <div className="flex items-center gap-4">
          <div
            className="p-4 rounded-2xl shadow-lg flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}
          >
            <Heart size={28} fill="white" strokeWidth={0} className="text-white" />
          </div>
          <div>
            <h2 className="text-text-primary text-2xl md:text-3xl font-bold">Liked Songs</h2>
            <p className="text-text-secondary font-medium">
              {likedTracks.length} track{likedTracks.length !== 1 ? 's' : ''}
              {likedTracks.length > 0 && ` · ${formatDuration(totalDuration)}`}
            </p>
          </div>
        </div>
      </GlassPanel>

      {likedTracks.length > 0 ? (
        <div className="space-y-2">
          {likedTracks.map((track, index) => {
            const isActive = currentTrack?.id === track.id;
            return (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <GlassPanel className="p-4 cursor-pointer" hover withGlare={false}>
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0"
                      style={isActive ? { boxShadow: '0 0 0 2px var(--accent-primary)' } : {}}
                    >
                      <TrackArtwork track={track} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4
                        className="font-semibold truncate text-sm"
                        style={{ color: isActive ? 'var(--accent-primary)' : 'var(--text-primary)' }}
                      >
                        {track.title}
                      </h4>
                      <p className="text-text-secondary text-xs truncate">{track.artist}</p>
                      <p className="text-text-muted text-xs mt-0.5">{track.genre}</p>
                    </div>
                    <div className="hidden md:flex items-center gap-1 text-text-muted text-sm font-medium">
                      <Clock size={13} strokeWidth={2.2} />
                      <span>{formatDuration(track.duration)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={(e) => { e.stopPropagation(); onToggleLike(track.id); }}
                        className="p-2"
                        aria-label="Unlike"
                        aria-pressed={true}
                      >
                        <Heart size={18} strokeWidth={2.2} style={{ color: 'var(--accent-secondary)', fill: 'var(--accent-secondary)' }} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => onTrackSelect(track.id)}
                        className="p-2.5 rounded-full"
                        style={{ background: 'var(--accent-primary)', boxShadow: '0 4px 12px color-mix(in srgb, var(--accent-primary) 30%, transparent)' }}
                        aria-label={`Play ${track.title}`}
                      >
                        <Play size={15} fill="white" strokeWidth={0} className="text-white ml-0.5" />
                      </motion.button>
                    </div>
                  </div>
                </GlassPanel>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <GlassPanel className="p-12 text-center">
          <Heart size={48} strokeWidth={2} className="text-text-muted mx-auto mb-4" />
          <p className="text-text-secondary font-semibold">No liked songs yet</p>
          <p className="text-text-muted text-sm mt-2">Tap the ♥ on any track while it's playing</p>
        </GlassPanel>
      )}
    </div>
  );
}
