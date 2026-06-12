import { motion } from 'motion/react';
import { Play, Clock, Music, Upload } from 'lucide-react';
import { GlassPanel } from '../components/GlassPanel';
import { ImportZone } from '../components/ImportZone';
import { Track } from '../data/db';
import { formatDuration } from '../data/musicData';

interface HomeScreenProps {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  isImporting: boolean;
  importProgress: number;
  onTrackSelect: (id: string) => void;
  onImport: (files: FileList | File[]) => Promise<void>;
}

function TrackArtwork({ track, size = 48 }: { track: Track; size?: number }) {
  if (track.artwork) {
    return <img src={track.artwork} alt={track.album} className="w-full h-full object-cover" />;
  }
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}
    >
      <Music size={size * 0.4} className="text-white opacity-80" />
    </div>
  );
}

export function HomeScreen({ tracks, currentTrack, isPlaying, isImporting, importProgress, onTrackSelect, onImport }: HomeScreenProps) {
  const recentTracks = tracks.slice(0, 4);
  const featuredTrack = currentTrack || tracks[0];
  const isEmpty = tracks.length === 0;

  if (isEmpty) {
    return (
      <div className="pb-24 md:pb-6 space-y-6">
        <div className="px-2 pt-2">
          <h2 className="text-text-primary text-2xl font-bold mb-1">Welcome to Resonance</h2>
          <p className="text-text-secondary">Import your music to get started.</p>
        </div>
        <ImportZone onImport={onImport} isImporting={isImporting} importProgress={importProgress} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 md:pb-6">
      {/* Featured / Now playing */}
      {featuredTrack && (
        <GlassPanel className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-52 aspect-square rounded-2xl overflow-hidden flex-shrink-0 shadow-2xl">
              <TrackArtwork track={featuredTrack} size={52} />
            </div>
            <div className="flex flex-col justify-between flex-1">
              <div>
                <div className="text-text-muted text-xs font-semibold mb-2 uppercase tracking-widest">
                  {currentTrack ? 'Now Playing' : 'Recently Added'}
                </div>
                <h2 className="text-text-primary text-3xl md:text-4xl font-bold mb-2 leading-tight">{featuredTrack.title}</h2>
                <p className="text-text-secondary text-lg font-medium">{featuredTrack.artist}</p>
                <p className="text-text-muted text-sm mt-1">{featuredTrack.album} · {featuredTrack.genre}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => onTrackSelect(featuredTrack.id)}
                className="mt-6 w-full md:w-auto px-8 py-3.5 rounded-full text-white font-semibold text-[15px] flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                  boxShadow: '0 8px 24px color-mix(in srgb, var(--accent-primary) 35%, transparent)',
                }}
              >
                <Play size={20} fill="currentColor" strokeWidth={0} />
                {currentTrack?.id === featuredTrack.id && isPlaying ? 'Playing' : 'Play Now'}
              </motion.button>
            </div>
          </div>
        </GlassPanel>
      )}

      {/* Recent tracks */}
      {recentTracks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-text-primary text-xl font-bold">Recently Added</h3>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => {}}
              className="flex items-center gap-1.5 text-text-secondary text-sm font-semibold"
              style={{ color: 'var(--accent-primary)' }}
            >
              <Upload size={14} />
              <label className="cursor-pointer">
                Add More
                <input type="file" accept=".mp3,.m4a,.flac,.wav,.ogg,.aac,.opus" multiple className="hidden"
                  onChange={(e) => e.target.files && onImport(e.target.files)} />
              </label>
            </motion.button>
          </div>
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
                    <TrackArtwork track={track} />
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
                        style={{ background: 'var(--accent-primary)' }}
                      >
                        <Play size={20} fill="white" strokeWidth={0} className="text-white" />
                      </motion.button>
                    </motion.div>
                    {currentTrack?.id === track.id && isPlaying && (
                      <div className="absolute bottom-2 left-2 flex gap-0.5 items-end">
                        {[1, 2, 3].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1 rounded-full"
                            style={{ background: 'var(--accent-primary)' }}
                            animate={{ height: [4, 12, 6, 14, 4] }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <h4 className="text-text-primary font-semibold truncate text-sm">{track.title}</h4>
                  <p className="text-text-secondary text-xs truncate">{track.artist}</p>
                  <div className="flex items-center gap-1 text-text-muted text-xs mt-2">
                    <Clock size={11} strokeWidth={2.2} />
                    <span>{formatDuration(track.duration)}</span>
                  </div>
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* All tracks list (if more than 4) */}
      {tracks.length > 4 && (
        <div>
          <h3 className="text-text-primary text-xl font-bold mb-4 px-2">All Tracks</h3>
          <div className="space-y-2">
            {tracks.slice(4).map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <GlassPanel className="p-3 cursor-pointer" hover withGlare={false}>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0">
                      <TrackArtwork track={track} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-text-primary font-semibold text-sm truncate">{track.title}</h4>
                      <p className="text-text-secondary text-xs truncate">{track.artist}</p>
                    </div>
                    <span className="text-text-muted text-xs hidden md:block">{formatDuration(track.duration)}</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      onClick={() => onTrackSelect(track.id)}
                      className="p-2 rounded-full flex-shrink-0"
                      style={{ background: 'var(--accent-primary)' }}
                    >
                      <Play size={13} fill="white" strokeWidth={0} className="text-white" />
                    </motion.button>
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
