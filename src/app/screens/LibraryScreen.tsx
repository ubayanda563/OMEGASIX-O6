import { useState } from 'react';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import { GlassPanel } from '../components/GlassPanel';
import { GlassButton } from '../components/GlassButton';
import { tracks, playlists } from '../data/musicData';

interface LibraryScreenProps {
  onTrackSelect: (trackId: number) => void;
}

export function LibraryScreen({ onTrackSelect }: LibraryScreenProps) {
  const [activeTab, setActiveTab] = useState<'tracks' | 'playlists'>('tracks');

  return (
    <div className="space-y-6 pb-24 md:pb-6">
      <div className="flex gap-2">
        <GlassButton
          active={activeTab === 'tracks'}
          onClick={() => setActiveTab('tracks')}
          variant="pill"
          className="flex-1"
        >
          Tracks
        </GlassButton>
        <GlassButton
          active={activeTab === 'playlists'}
          onClick={() => setActiveTab('playlists')}
          variant="pill"
          className="flex-1"
        >
          Playlists
        </GlassButton>
      </div>

      {activeTab === 'tracks' && (
        <div>
          <h3 className="text-text-primary text-xl font-bold mb-4 px-2">All Tracks</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
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
                  <p className="text-text-muted text-xs mt-1 font-medium">{track.genre}</p>
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'playlists' && (
        <div>
          <h3 className="text-text-primary text-xl font-bold mb-4 px-2">Your Playlists</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {playlists.map((playlist, index) => (
              <motion.div
                key={playlist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <GlassPanel className="p-6 cursor-pointer" hover>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                      <img src={playlist.image} alt={playlist.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-text-primary text-lg font-bold">{playlist.name}</h4>
                      <p className="text-text-secondary text-sm mb-3 font-medium">{playlist.trackCount} tracks</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.92 }}
                        className="px-5 py-2 rounded-full text-white font-semibold text-sm flex items-center gap-2 shadow-lg"
                        style={{
                          background: 'var(--accent-primary)',
                          boxShadow: '0 4px 12px rgba(0, 122, 255, 0.25)',
                        }}
                      >
                        <Play size={14} fill="currentColor" strokeWidth={0} />
                        Play
                      </motion.button>
                    </div>
                  </div>
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
