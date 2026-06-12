import { useRef, useState, DragEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Music, Loader2 } from 'lucide-react';
import { GlassPanel } from './GlassPanel';
import { SUPPORTED_EXTENSIONS } from '../data/musicData';

interface ImportZoneProps {
  onImport: (files: FileList | File[]) => Promise<void>;
  isImporting: boolean;
  importProgress: number;
  compact?: boolean;
}

export function ImportZone({ onImport, isImporting, importProgress, compact = false }: ImportZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) onImport(e.dataTransfer.files);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  if (compact) {
    return (
      <>
        <input
          ref={inputRef}
          type="file"
          accept={SUPPORTED_EXTENSIONS}
          multiple
          className="hidden"
          onChange={(e) => e.target.files && onImport(e.target.files)}
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => inputRef.current?.click()}
          disabled={isImporting}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm text-white disabled:opacity-60"
          style={{
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            boxShadow: '0 4px 16px color-mix(in srgb, var(--accent-primary) 30%, transparent)',
          }}
        >
          {isImporting ? (
            <><Loader2 size={16} className="animate-spin" /> Importing {importProgress}%</>
          ) : (
            <><Upload size={16} /> Import Files</>
          )}
        </motion.button>
      </>
    );
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={SUPPORTED_EXTENSIONS}
        multiple
        className="hidden"
        onChange={(e) => e.target.files && onImport(e.target.files)}
      />
      <GlassPanel className="p-1">
        <motion.div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          animate={{ scale: isDragging ? 1.01 : 1 }}
          onClick={() => !isImporting && inputRef.current?.click()}
          className="relative flex flex-col items-center justify-center gap-4 p-12 rounded-xl border-2 border-dashed cursor-pointer transition-colors"
          style={{
            borderColor: isDragging ? 'var(--accent-primary)' : 'var(--glass-border)',
            background: isDragging ? 'color-mix(in srgb, var(--accent-primary) 8%, transparent)' : 'transparent',
          }}
        >
          <AnimatePresence mode="wait">
            {isImporting ? (
              <motion.div
                key="importing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4 w-full max-w-xs"
              >
                <Loader2 size={40} className="text-accent-primary animate-spin" style={{ color: 'var(--accent-primary)' }} />
                <p className="text-text-primary font-semibold">Importing tracks…</p>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'var(--accent-primary)' }}
                    animate={{ width: `${importProgress}%` }}
                    transition={{ ease: 'easeOut' }}
                  />
                </div>
                <p className="text-text-muted text-sm">{importProgress}%</p>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4 text-center"
              >
                <div
                  className="p-5 rounded-2xl"
                  style={{ background: 'color-mix(in srgb, var(--accent-primary) 15%, transparent)' }}
                >
                  <Music size={32} style={{ color: 'var(--accent-primary)' }} />
                </div>
                <div>
                  <p className="text-text-primary font-semibold text-lg mb-1">Drop audio files here</p>
                  <p className="text-text-secondary text-sm">or click to browse your device</p>
                  <p className="text-text-muted text-xs mt-2">MP3 · FLAC · WAV · M4A · OGG · AAC</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </GlassPanel>
    </>
  );
}
