import { useState, useEffect, useCallback, useRef } from 'react';
import { parseBlob } from 'music-metadata-browser';
import { Track, getAllTracks, saveTrack, saveFile, deleteTrack } from '../data/db';
import { SUPPORTED_AUDIO_TYPES } from '../data/musicData';

function parseFilename(name: string): { title: string; artist: string } {
  const stem = name.replace(/\.[^/.]+$/, '');
  const parts = stem.split(' - ');
  if (parts.length >= 2) {
    return { artist: parts[0].trim(), title: parts.slice(1).join(' - ').trim() };
  }
  return { title: stem, artist: 'Unknown Artist' };
}

async function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const audio = new Audio();
    const url = URL.createObjectURL(file);
    const cleanup = () => URL.revokeObjectURL(url);
    audio.addEventListener('loadedmetadata', () => { cleanup(); resolve(isFinite(audio.duration) ? audio.duration : 0); }, { once: true });
    audio.addEventListener('error', () => { cleanup(); resolve(0); }, { once: true });
    audio.src = url;
  });
}

async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

async function extractMetadata(file: File): Promise<Omit<Track, 'id' | 'fileName' | 'fileSize' | 'dateAdded' | 'liked'>> {
  const fallback = parseFilename(file.name);
  try {
    const meta = await parseBlob(file);
    const { title, artist, album, genre, picture } = meta.common;
    let artwork: string | undefined;
    if (picture && picture.length > 0) {
      const pic = picture[0];
      const artBlob = new Blob([pic.data], { type: pic.format });
      artwork = await blobToDataUrl(artBlob);
    }
    const durFromMeta = meta.format.duration;
    const duration = (durFromMeta && isFinite(durFromMeta)) ? durFromMeta : await getAudioDuration(file);
    return {
      title: title || fallback.title,
      artist: artist || fallback.artist,
      album: album || 'Unknown Album',
      genre: (genre && genre[0]) || 'Unknown',
      duration,
      artwork,
    };
  } catch {
    const duration = await getAudioDuration(file);
    return { title: fallback.title, artist: fallback.artist, album: 'Unknown Album', genre: 'Unknown', duration };
  }
}

export function useLibrary() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const importingRef = useRef(false);

  useEffect(() => {
    getAllTracks()
      .then((t) => setTracks(t.sort((a, b) => b.dateAdded - a.dateAdded)))
      .finally(() => setIsLoading(false));
  }, []);

  const importFiles = useCallback(async (fileList: FileList | File[]) => {
    if (importingRef.current) return;
    importingRef.current = true;
    setIsImporting(true);

    const files = Array.from(fileList).filter(
      (f) => SUPPORTED_AUDIO_TYPES.includes(f.type) || /\.(mp3|m4a|flac|wav|ogg|aac|opus|weba)$/i.test(f.name)
    );

    const newTracks: Track[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setImportProgress(Math.round(((i) / files.length) * 100));
      try {
        const meta = await extractMetadata(file);
        const id = crypto.randomUUID();
        const track: Track = {
          id,
          ...meta,
          fileName: file.name,
          fileSize: file.size,
          dateAdded: Date.now(),
          liked: false,
        };
        await saveFile(id, file);
        await saveTrack(track);
        newTracks.push(track);
      } catch (err) {
        console.warn('Failed to import', file.name, err);
      }
    }

    setImportProgress(100);
    setTracks((prev) => [...newTracks, ...prev]);
    importingRef.current = false;
    setIsImporting(false);
    setImportProgress(0);
  }, []);

  const removeTrack = useCallback(async (id: string) => {
    await deleteTrack(id);
    setTracks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleLike = useCallback(async (id: string) => {
    setTracks((prev) => {
      const updated = prev.map((t) => t.id === id ? { ...t, liked: !t.liked } : t);
      const track = updated.find((t) => t.id === id);
      if (track) saveTrack(track);
      return updated;
    });
  }, []);

  const likedTracks = tracks.filter((t) => t.liked);

  return { tracks, likedTracks, isLoading, isImporting, importProgress, importFiles, removeTrack, toggleLike };
}
