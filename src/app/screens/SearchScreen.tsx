import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Play, Clock, Music } from 'lucide-react';
import { GlassPanel } from '../components/GlassPanel';
import { Track } from '../data/db';
import { formatDuration } from '../data/musicData';

interface SearchScreenProps {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  onTrackSelect: (id: string) => void;
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

export function SearchScreen({ tracks, currentTrack, isPlaying, onTrackSelect }: SearchScreenProps) {
  const [query, setQuery] = useState('');

  const genres = [...new Set(tracks.map((t) => t.genre).filter(Boolean))];
  const artists = [...new Set(tracks.map((t) => t.artist))].slice(0, 6);

  const filtered = query.trim()
    ? tracks.filter(
        (t) =>
          t.title.toLowerCase().includes(query.toLowerCase()) ||
          t.artist.toLowerCase().includes(query.toLowerCase()) ||
          t.album.toLowerCase().includes(query.toLowerCase()) ||
          t.genre.toLowerCase().includes(query.toLowerCase())
      )
    : tracks;

  return (
    <div className="space-y-6 pb-24 md:pb-6">
      <GlassPanel className="p-4">
        <div className="flex items-center gap-3">
          <Search size={20} strokeWidth={2.2} className="text-text-muted flex-shrink-0" />
          <input
            type="text"
            placeholder="Search tracks, artists, albums…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted outline-none font-medium"
          />
          {query && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setQuery('')}
              className="text-text-muted text-sm px-2"
            >
              ✕
            </motion.button>
          )}
        </div>
      </GlassPanel>

      {!query && genres.length > 0 && (
        <div>
          <h3 className="text-text-primary font-semibold mb-3 px-2">Genres in your library</h3>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <motion.button
                key={genre}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setQuery(genre)}
                className="px-5 py-2 rounded-full text-text-secondary hover:text-text-primary font-semibold text-sm transition-colors"
                style={{
                  background: 'var(--glass-bg)',
                  backdropFilter: 'blur(50px) saturate(200%)',
                  WebkitBackdropFilter: 'blur(50px) saturate(200%)',
                  boxShadow: 'inset 0 1px 1px var(--glass-highlight), inset 0 0 0 1px var(--glass-border)',
                }}
              >
                {genre}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {!query && artists.length > 0 && (
        <div>
          <h3 className="text-text-primary font-semibold mb-3 px-2">Artists</h3>
          <div className="flex flex-wrap gap-2">
            {artists.map((artist) => (
              <motion.button
                key={artist}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setQuery(artist)}
                className="px-5 py-2 rounded-full font-semibold text-sm transition-colors"
                style={{
                  background: 'color-mix(in srgb, var(--accent-primary) 12%, transparent)',
                  color: 'var(--accent-primary)',
                  boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--accent-primary) 30%, transparent)',
                }}
              >
                {artist}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-text-primary font-semibold mb-3 px-2">
          {query ? `Results for "${query}" (${filtered.length})` : `All Tracks (${tracks.length})`}
        </h3>
        {filtered.length === 0 ? (
          <GlassPanel className="p-10 text-center">
            <Search size={36} className="text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary font-medium">No tracks found</p>
            <p className="text-text-muted text-sm mt-1">Try a different search term</p>
          </GlassPanel>
        ) : (
          <div className="space-y-2">
            {filtered.map((track, index) => {
              const isActive = currentTrack?.id === track.id;
              return (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <GlassPanel
                    className="p-4 cursor-pointer"
                    hover
                    withGlare={false}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0"
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
                        <p className="text-text-muted text-xs truncate">{track.album}</p>
                      </div>
                      <div className="hidden md:flex items-center gap-1 text-text-muted text-sm font-medium">
                        <Clock size={13} strokeWidth={2.2} />
                        <span>{formatDuration(track.duration)}</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onTrackSelect(track.id)}
                        className="p-2.5 rounded-full flex-shrink-0"
                        style={{ background: 'var(--accent-primary)', boxShadow: '0 4px 12px color-mix(in srgb, var(--accent-primary) 30%, transparent)' }}
                        aria-label={`Play ${track.title}`}
                      >
                        <Play size={14} fill="white" strokeWidth={0} className="text-white ml-0.5" />
                      </motion.button>
                    </div>
                  </GlassPanel>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
