import { motion } from 'motion/react';
import { Play, Clock, Heart } from 'lucide-react';
import { GlassPanel } from '../components/GlassPanel';
import { tracks, playlists } from '../data/musicData';

interface HomeScreenProps {
  onTrackSelect: (trackId: number) => void;
}

export function HomeScreen({ onTrackSelect }: HomeScreenProps) {
  const recentTracks = tracks.slice(0, 4);
  const featuredTrack = tracks[0];

  return (
    <div className="space-y-6 pb-24 md:pb-6">
      <GlassPanel className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-56 aspect-square rounded-2xl overflow-hidden flex-shrink-0 shadow-2xl">
            <img src={featuredTrack.image} alt={featuredTrack.album} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col justify-between flex-1">
            <div>
              <div className="text-text-muted text-sm font-semibold mb-2 uppercase tracking-wide">Now Playing</div>
              <h2 className="text-text-primary text-3xl md:text-4xl font-bold mb-2">{featuredTrack.title}</h2>
              <p className="text-text-secondary text-lg font-medium">{featuredTrack.artist}</p>
              <p className="text-text-muted text-sm mt-1">{featuredTrack.genre}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onTrackSelect(featuredTrack.id)}
              className="mt-6 w-full md:w-auto px-8 py-3.5 rounded-full text-white font-semibold text-[15px] flex items-center justify-center gap-2 shadow-lg"
              style={{
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                boxShadow: '0 8px 24px rgba(0, 122, 255, 0.3)',
              }}
            >
              <Play size={20} fill="currentColor" strokeWidth={0} />
              Play Now
            </motion.button>
          </div>
        </div>
      </GlassPanel>

      <div>
        <h3 className="text-text-primary text-xl font-bold mb-4 px-2">Recent Tracks</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recentTracks.map((track, index) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <GlassPanel className="p-4 cursor-pointer group" hover>
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                  <img src={track.image} alt={track.album} className="w-full h-full object-cover" />
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center"
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onTrackSelect(track.id)}
                      className="p-3 rounded-full shadow-lg"
                      style={{
                        background: 'var(--accent-primary)',
                      }}
                    >
                      <Play size={20} fill="white" strokeWidth={0} className="text-white" />
                    </motion.button>
                  </motion.div>
                </div>
                <h4 className="text-text-primary font-semibold truncate">{track.title}</h4>
                <p className="text-text-secondary text-sm truncate">{track.artist}</p>
                <div className="flex items-center gap-1 text-text-muted text-xs mt-2">
                  <Clock size={12} strokeWidth={2.2} />
                  <span>{Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}</span>
                </div>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-text-primary text-xl font-bold mb-4 px-2">Your Playlists</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {playlists.map((playlist, index) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <GlassPanel className="p-5 cursor-pointer" hover>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                    <img src={playlist.image} alt={playlist.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-text-primary font-semibold">{playlist.name}</h4>
                    <p className="text-text-secondary text-sm">{playlist.trackCount} tracks</p>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-text-primary text-xl font-bold mb-4 px-2">Genres</h3>
        <div className="flex flex-wrap gap-3">
          {['Electronic', 'Pop', 'Rock', 'Jazz', 'Ambient', 'Classical'].map((genre) => (
            <motion.button
              key={genre}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              className="px-6 py-2.5 rounded-full text-text-primary font-semibold text-[15px] transition-colors"
              style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(50px) saturate(200%)',
                WebkitBackdropFilter: 'blur(50px) saturate(200%)',
                boxShadow: `
                  0 4px 12px var(--glass-shadow),
                  inset 0 1px 1px var(--glass-highlight),
                  inset 0 0 0 1px var(--glass-border)
                `,
              }}
            >
              {genre}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
