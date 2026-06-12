import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Music, Trash2, Clock, LayoutGrid, List } from 'lucide-react';
import { GlassPanel } from '../components/GlassPanel';
import { GlassButton } from '../components/GlassButton';
import { ImportZone } from '../components/ImportZone';
import { Track } from '../data/db';
import { formatDuration, formatFileSize } from '../data/musicData';

interface LibraryScreenProps {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  isImporting: boolean;
  importProgress: number;
  onTrackSelect: (id: string) => void;
  onRemoveTrack: (id: string) => void;
  onImport: (files: FileList | File[]) => Promise<void>;
}

function TrackArtwork({ track, size = 48 }: { track: Track; size?: number }) {
  if (track.artwork) {
    return <img src={track.artwork} alt={track.album} className="w-full h-full object-cover" />;
  }
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
      <Music size={size * 0.38} className="text-white opacity-80" />
    </div>
  );
}

export function LibraryScreen({ tracks, currentTrack, isPlaying, isImporting, importProgress, onTrackSelect, onRemoveTrack, onImport }: LibraryScreenProps) {
  const [view, setView] = useState<'grid' | 'list'>('list');
  const [tab, setTab] = useState<'tracks' | 'import'>('tracks');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const totalDuration = tracks.reduce((sum, t) => sum + (t.duration || 0), 0);
  const totalSize = tracks.reduce((sum, t) => sum + (t.fileSize || 0), 0);

  return (
    <div className="space-y-5 pb-24 md:pb-6">
      {/* Header stats */}
      <GlassPanel className="p-5">
        <div className="flex items-center gap-4">
          <div
            className="p-3 rounded-xl flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}
          >
            <Music size={22} className="text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-text-primary font-bold text-xl">Your Library</h2>
            <p className="text-text-secondary text-sm">
              {tracks.length} track{tracks.length !== 1 ? 's' : ''} · {formatDuration(totalDuration)} · {formatFileSize(totalSize)}
            </p>
          </div>
        </div>
      </GlassPanel>

      {/* Tab bar */}
      <div className="flex gap-2">
        <GlassButton active={tab === 'tracks'} onClick={() => setTab('tracks')} variant="pill" className="flex-1">
          Tracks
        </GlassButton>
        <GlassButton active={tab === 'import'} onClick={() => setTab('import')} variant="pill" className="flex-1">
          Import
        </GlassButton>
        {tab === 'tracks' && tracks.length > 0 && (
          <div className="flex gap-1">
            <GlassButton active={view === 'list'} onClick={() => setView('list')} variant="default" className="px-3">
              <List size={16} />
            </GlassButton>
            <GlassButton active={view === 'grid'} onClick={() => setView('grid')} variant="default" className="px-3">
              <LayoutGrid size={16} />
            </GlassButton>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'import' && (
          <motion.div key="import" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <ImportZone onImport={onImport} isImporting={isImporting} importProgress={importProgress} />
          </motion.div>
        )}

        {tab === 'tracks' && tracks.length === 0 && (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <GlassPanel className="p-12 text-center">
              <Music size={48} className="mx-auto mb-4 text-text-muted" />
              <p className="text-text-secondary font-semibold text-lg mb-1">No tracks yet</p>
              <p className="text-text-muted text-sm mb-5">Switch to the Import tab to add music from your device.</p>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
                onClick={() => setTab('import')}
                className="px-6 py-2.5 rounded-full font-semibold text-sm text-white"
                style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}
              >
                Import Music
              </motion.button>
            </GlassPanel>
          </motion.div>
        )}

        {tab === 'tracks' && tracks.length > 0 && view === 'list' && (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
            {tracks.map((track, index) => {
              const isActive = currentTrack?.id === track.id;
              return (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  whileHover={{ x: 3 }}
                >
                  <GlassPanel className="p-3" withGlare={false}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0" style={isActive ? { boxShadow: '0 0 0 2px var(--accent-primary)' } : {}}>
                        <TrackArtwork track={track} size={48} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate" style={{ color: isActive ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                          {track.title}
                        </h4>
                        <p className="text-text-secondary text-xs truncate">{track.artist}</p>
                        <p className="text-text-muted text-xs hidden md:block">{track.album} · {track.genre}</p>
                      </div>
                      <div className="hidden md:flex items-center gap-1 text-text-muted text-xs">
                        <Clock size={11} />
                        <span>{formatDuration(track.duration)}</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => onTrackSelect(track.id)}
                        className="p-2 rounded-full flex-shrink-0"
                        style={{ background: isActive ? 'var(--accent-primary)' : 'color-mix(in srgb, var(--accent-primary) 20%, transparent)' }}
                        aria-label={`Play ${track.title}`}
                      >
                        <Play size={13} fill={isActive ? 'white' : 'var(--accent-primary)'} strokeWidth={0} className="ml-0.5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => setConfirmDelete(confirmDelete === track.id ? null : track.id)}
                        className="p-2 text-text-muted hover:text-red-400 transition-colors"
                        aria-label={`Delete ${track.title}`}
                      >
                        <Trash2 size={14} strokeWidth={2.2} />
                      </motion.button>
                    </div>
                    <AnimatePresence>
                      {confirmDelete === track.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="flex items-center justify-between pt-3 mt-3 border-t" style={{ borderColor: 'var(--glass-border)' }}>
                            <p className="text-text-secondary text-xs">Remove this track from library?</p>
                            <div className="flex gap-2">
                              <motion.button whileTap={{ scale: 0.92 }} onClick={() => setConfirmDelete(null)} className="px-3 py-1 rounded-full text-xs text-text-muted" style={{ background: 'var(--glass-bg)' }}>Cancel</motion.button>
                              <motion.button whileTap={{ scale: 0.92 }} onClick={() => { onRemoveTrack(track.id); setConfirmDelete(null); }} className="px-3 py-1 rounded-full text-xs text-white" style={{ background: '#ef4444' }}>Remove</motion.button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </GlassPanel>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {tab === 'tracks' && tracks.length > 0 && view === 'grid' && (
          <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tracks.map((track, index) => {
              const isActive = currentTrack?.id === track.id;
              return (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <GlassPanel className="p-4 cursor-pointer group" hover>
                    <div className="relative aspect-square rounded-xl overflow-hidden mb-3" style={isActive ? { boxShadow: '0 0 0 2px var(--accent-primary)' } : {}}>
                      <TrackArtwork track={track} />
                      <motion.div initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <motion.button
                          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => onTrackSelect(track.id)}
                          className="p-3 rounded-full shadow-lg"
                          style={{ background: 'var(--accent-primary)' }}
                        >
                          <Play size={18} fill="white" strokeWidth={0} className="text-white" />
                        </motion.button>
                      </motion.div>
                    </div>
                    <h4 className="font-semibold text-sm truncate" style={{ color: isActive ? 'var(--accent-primary)' : 'var(--text-primary)' }}>{track.title}</h4>
                    <p className="text-text-secondary text-xs truncate">{track.artist}</p>
                    <p className="text-text-muted text-xs mt-1">{track.genre}</p>
                  </GlassPanel>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
