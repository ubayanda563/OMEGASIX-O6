import { useState, useEffect, useRef, useCallback } from 'react';
import { Track } from '../data/db';
import { getFile } from '../data/db';

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const blobUrlRef = useRef<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const onEndedRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(isFinite(audio.duration) ? audio.duration : 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => { setIsPlaying(false); onEndedRef.current?.(); };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const play = useCallback(async (track: Track) => {
    const audio = audioRef.current;
    // Revoke previous blob URL
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    const blob = await getFile(track.id);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    blobUrlRef.current = url;
    audio.src = url;
    audio.currentTime = 0;
    await audio.play().catch(() => {});
    setCurrentTrack(track);
    setCurrentTime(0);
  }, []);

  const pause = useCallback(() => {
    audioRef.current.pause();
  }, []);

  const resume = useCallback(async () => {
    await audioRef.current.play().catch(() => {});
  }, []);

  const seek = useCallback((time: number) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  const setVolume = useCallback((v: number) => {
    audioRef.current.volume = v;
    setVolumeState(v);
  }, []);

  const setOnEnded = useCallback((fn: () => void) => {
    onEndedRef.current = fn;
  }, []);

  const updateCurrentTrack = useCallback((track: Track) => {
    setCurrentTrack(track);
  }, []);

  return {
    currentTrack,
    isPlaying,
    currentTime,
    duration: currentTrack ? (currentTrack.duration || duration) : duration,
    volume,
    play,
    pause,
    resume,
    seek,
    setVolume,
    setOnEnded,
    updateCurrentTrack,
  };
}
