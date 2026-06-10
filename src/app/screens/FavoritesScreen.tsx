import { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Play, Clock } from 'lucide-react';
import { GlassPanel } from '../components/GlassPanel';
import { tracks } from '../data/musicData';

interface FavoritesScreenProps {
  onTrackSelect: (trackId: number) => void;
}

export function FavoritesScreen({ onTrackSelect }: FavoritesScreenProps) {
  const [likedTracks, setLikedTracks] = useState<Set<number>>(new Set([1, 2, 3, 6]));
  const favoriteTracks = tracks.filter((track) => likedTracks.has(track.id));

  const toggleLike = (trackId: number) => {
    setLikedTracks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(trackId)) {
        newSet.delete(trackId);
      } else {
        newSet.add(trackId);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-6 pb-24 md:pb-6">
      <GlassPanel className="p-6">
        <div className="flex items-center gap-4 mb-2">
          <div
            className="p-4 rounded-2xl shadow-lg"
            style={{
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            }}
          >
            <Heart size={28} fill="white" strokeWidth={0} className="text-white" />
          </div>
          <div>
            <h2 className="text-text-primary text-2xl md:text-3xl font-bold">Liked Songs</h2>
            <p className="text-text-secondary font-medium">{favoriteTracks.length} tracks</p>
          </div>
        </div>
      </GlassPanel>

      {favoriteTracks.length > 0 ? (
        <div className="space-y-2">
          {favoriteTracks.map((track, index) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <GlassPanel className="p-4 cursor-pointer" hover withGlare={false}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={track.image} alt={track.album} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-text-primary font-semibold truncate">{track.title}</h4>
                    <p className="text-text-secondary text-sm truncate">{track.artist}</p>
                    <p className="text-text-muted text-xs mt-1 font-medium">{track.genre}</p>
                  </div>
                  <div className="hidden md:flex items-center gap-1 text-text-muted text-sm font-medium">
                    <Clock size={14} strokeWidth={2.2} />
                    <span>
                      {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(track.id);
                      }}
                      className="p-2"
                    >
                      <Heart
                        size={20}
                        strokeWidth={2.2}
                        className={`transition-colors ${
                          likedTracks.has(track.id) ? 'fill-accent-secondary text-accent-secondary' : 'text-text-muted'
                        }`}
                      />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onTrackSelect(track.id)}
                      className="p-2.5 rounded-full"
                      style={{
                        background: 'var(--accent-primary)',
                        boxShadow: '0 4px 12px rgba(0, 122, 255, 0.25)',
                      }}
                    >
                      <Play size={16} fill="white" strokeWidth={0} className="text-white" />
                    </motion.button>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      ) : (
        <GlassPanel className="p-12 text-center">
          <Heart size={48} strokeWidth={2} className="text-text-muted mx-auto mb-4" />
          <p className="text-text-secondary font-medium">No liked songs yet</p>
          <p className="text-text-muted text-sm mt-2">Start liking songs to see them here</p>
        </GlassPanel>
      )}
    </div>
  );
}
