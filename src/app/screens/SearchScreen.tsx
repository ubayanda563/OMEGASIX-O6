import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Play, Clock } from 'lucide-react';
import { GlassPanel } from '../components/GlassPanel';
import { tracks } from '../data/musicData';

interface SearchScreenProps {
  onTrackSelect: (trackId: number) => void;
}

export function SearchScreen({ onTrackSelect }: SearchScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches] = useState(['Electronic', 'Chill', 'Rock']);

  const filteredTracks = searchQuery
    ? tracks.filter(
        (track) =>
          track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
          track.genre.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tracks;

  return (
    <div className="space-y-6 pb-24 md:pb-6">
      <GlassPanel className="p-5">
        <div className="flex items-center gap-3">
          <Search size={20} strokeWidth={2.2} className="text-text-muted" />
          <input
            type="text"
            placeholder="Search for tracks, artists, or genres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted outline-none font-medium"
          />
        </div>
      </GlassPanel>

      {!searchQuery && (
        <div>
          <h3 className="text-text-primary font-semibold mb-3 px-2">Recent Searches</h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((term) => (
              <motion.button
                key={term}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setSearchQuery(term)}
                className="px-5 py-2 rounded-full text-text-secondary hover:text-text-primary font-semibold text-sm transition-colors"
                style={{
                  background: 'var(--glass-bg)',
                  backdropFilter: 'blur(50px) saturate(200%)',
                  WebkitBackdropFilter: 'blur(50px) saturate(200%)',
                  boxShadow: `
                    inset 0 1px 1px var(--glass-highlight),
                    inset 0 0 0 1px var(--glass-border)
                  `,
                }}
              >
                {term}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-text-primary font-semibold mb-3 px-2">
          {searchQuery ? `Results for "${searchQuery}"` : 'All Tracks'}
        </h3>
        <div className="space-y-2">
          {filteredTracks.map((track, index) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <GlassPanel className="p-4 cursor-pointer" hover withGlare={false}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={track.image} alt={track.album} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-text-primary font-semibold truncate">{track.title}</h4>
                    <p className="text-text-secondary text-sm truncate">{track.artist}</p>
                  </div>
                  <div className="hidden md:flex items-center gap-1 text-text-muted text-sm font-medium">
                    <Clock size={14} strokeWidth={2.2} />
                    <span>{Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}</span>
                  </div>
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
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
