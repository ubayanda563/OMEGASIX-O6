import { useState, useEffect, useRef, useCallback } from 'react';
import { Track, getFile } from '../data/db';
import { createReverbImpulse, DEFAULT_EQ_GAINS, EQ_BANDS, ReverbPreset, dbToLinear } from '../data/audioUtils';
import { savePlayEvent } from '../data/analytics';

const AudioContextCtor = typeof window !== 'undefined' ? (window.AudioContext ?? (window as any).webkitAudioContext) : undefined;

export function useAudioPlayer() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioElementsRef = useRef<HTMLAudioElement[]>([new Audio(), new Audio()]);
  const sourceNodesRef = useRef<(MediaElementAudioSourceNode | null)[]>([null, null]);
  const gainNodesRef = useRef<(GainNode | null)[]>([null, null]);
  const filterChainsRef = useRef<BiquadFilterNode[][]>([[], []]);
  const convolverRef = useRef<ConvolverNode | null>(null);
  const blobUrlRef = useRef<[string | null, string | null]>([null, null]);
  const activeIndexRef = useRef(0);
  const currentTrackRef = useRef<Track | null>(null);
  const currentTimeRef = useRef(0);
  const durationRef = useRef(0);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [crossfadeDuration, setCrossfadeDuration] = useState(4);
  const [eqGains, setEqGains] = useState<number[]>(DEFAULT_EQ_GAINS);
  const [reverbProfile, setReverbProfile] = useState<ReverbPreset>('Studio');
  const [waveform, setWaveform] = useState<number[]>([]);
  const [lyrics, setLyrics] = useState('');
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);
  const onEndedRef = useRef<(() => void) | null>(null);

  const ensureAudioContext = useCallback(() => {
    if (audioContextRef.current) return audioContextRef.current;
    if (!AudioContextCtor) return null;
    const context = new AudioContextCtor();
    const convolver = context.createConvolver();
    convolver.connect(context.destination);
    audioContextRef.current = context;
    convolverRef.current = convolver;
    return context;
  }, []);

  const createFilterChain = useCallback((context: AudioContext) => {
    return EQ_BANDS.map((band) => {
      const filter = context.createBiquadFilter();
      filter.type = band.type;
      filter.frequency.value = band.freq;
      filter.Q.value = 1;
      filter.gain.value = 0;
      return filter;
    });
  }, []);

  const connectTrackGraph = useCallback((index: number) => {
    const context = ensureAudioContext();
    if (!context) return;

    if (sourceNodesRef.current[index]) return;
    const audio = audioElementsRef.current[index];
    const source = context.createMediaElementSource(audio);
    sourceNodesRef.current[index] = source;

    let gain = gainNodesRef.current[index];
    if (!gain) {
      gain = context.createGain();
      gain.gain.value = 1;
      gain.connect(context.destination);
      gainNodesRef.current[index] = gain;
    }

    const filters = createFilterChain(context);
    filterChainsRef.current[index] = filters;
    filters.reduce((prev, current) => {
      prev.connect(current);
      return current;
    }, source).connect(gain);

    if (reverbProfile !== 'None' && convolverRef.current) {
      const lastFilter = filters[filters.length - 1];
      lastFilter.connect(convolverRef.current);
    }
  }, [createFilterChain, ensureAudioContext, reverbProfile]);

  const applyEqGains = useCallback(() => {
    filterChainsRef.current.forEach((chain) => {
      chain.forEach((filter, index) => {
        filter.gain.value = eqGains[index] ?? 0;
      });
    });
  }, [eqGains]);

  const applyReverbProfile = useCallback(() => {
    const context = audioContextRef.current;
    if (!context || !convolverRef.current) return;
    if (reverbProfile === 'None') {
      convolverRef.current.buffer = null;
      return;
    }
    convolverRef.current.buffer = createReverbImpulse(context, reverbProfile);
  }, [reverbProfile]);

  useEffect(() => {
    applyEqGains();
  }, [applyEqGains]);

  useEffect(() => {
    applyReverbProfile();
  }, [applyReverbProfile]);

  useEffect(() => {
    currentTrackRef.current = currentTrack;
  }, [currentTrack]);

  useEffect(() => {
    currentTimeRef.current = currentTime;
  }, [currentTime]);

  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  useEffect(() => {
    const audios = audioElementsRef.current;
    const handleTimeUpdate = () => {
      const current = audios[activeIndexRef.current];
      setCurrentTime(current.currentTime);
      if (current.duration && !Number.isNaN(current.duration)) {
        setDuration(current.duration);
      }
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      onEndedRef.current?.();
      const track = currentTrackRef.current;
      const currentTimeValue = currentTimeRef.current;
      const durationValue = durationRef.current;
      if (track) {
        savePlayEvent({
          trackId: track.id,
          timestamp: Date.now(),
          duration: track.duration || durationValue,
          skipped: currentTimeValue < (track.duration || durationValue) * 0.8,
        });
      }
    };

    audios.forEach((audio) => {
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);
    });

    return () => {
      audios.forEach((audio) => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('ended', handleEnded);
      });
    };
  }, []);

  const fadeGain = useCallback((gain: GainNode, startDb: number, endDb: number, seconds: number) => {
    const context = audioContextRef.current;
    if (!context) return;
    const now = context.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(dbToLinear(startDb), now);
    gain.gain.linearRampToValueAtTime(dbToLinear(endDb), now + seconds);
  }, []);

  const transitionToTrack = useCallback(async (track: Track, enableCrossfade = true) => {
    const targetIndex = 1 - activeIndexRef.current;
    const audio = audioElementsRef.current[targetIndex];
    const blob = await getFile(track.id);
    if (!blob) return;
    if (blobUrlRef.current[targetIndex]) {
      URL.revokeObjectURL(blobUrlRef.current[targetIndex]!);
      blobUrlRef.current[targetIndex] = null;
    }

    const url = URL.createObjectURL(blob);
    blobUrlRef.current[targetIndex] = url;
    audio.src = url;
    audio.currentTime = 0;
    audio.volume = 1;
    connectTrackGraph(targetIndex);
    audio.muted = false;

    const currentIndex = activeIndexRef.current;
    const currentGain = gainNodesRef.current[currentIndex];
    const targetGain = gainNodesRef.current[targetIndex];

    if (enableCrossfade && currentTrack && currentGain && targetGain && crossfadeDuration > 0) {
      fadeGain(targetGain, -60, 0, crossfadeDuration);
      fadeGain(currentGain, 0, -60, crossfadeDuration);
      await audio.play().catch(() => {});
      activeIndexRef.current = targetIndex;
    } else {
      const oldAudio = audioElementsRef.current[currentIndex];
      oldAudio.pause();
      oldAudio.currentTime = 0;
      if (currentGain) currentGain.gain.setValueAtTime(1, audioContextRef.current?.currentTime ?? 0);
      if (targetGain) targetGain.gain.setValueAtTime(1, audioContextRef.current?.currentTime ?? 0);
      await audio.play().catch(() => {});
      activeIndexRef.current = targetIndex;
    }

    setCurrentTrack(track);
    setCurrentTime(0);
    setDuration(track.duration || 0);
    setWaveform(track.waveform ?? []);
  }, [connectTrackGraph, crossfadeDuration, currentTrack, fadeGain]);

  const play = useCallback(async (track: Track) => {
    if (!audioContextRef.current) {
      ensureAudioContext();
    }
    await transitionToTrack(track, Boolean(currentTrack));
  }, [currentTrack, ensureAudioContext, transitionToTrack]);

  const pause = useCallback(() => {
    audioElementsRef.current[activeIndexRef.current].pause();
  }, []);

  const resume = useCallback(async () => {
    await audioElementsRef.current[activeIndexRef.current].play().catch(() => {});
  }, []);

  const seek = useCallback((time: number) => {
    const audio = audioElementsRef.current[activeIndexRef.current];
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  const setVolume = useCallback((v: number) => {
    const audio = audioElementsRef.current[activeIndexRef.current];
    audio.volume = v;
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
    waveform,
    crossfadeDuration,
    setCrossfadeDuration,
    eqGains,
    setEqGains,
    reverbProfile,
    setReverbProfile,
    lyrics,
    setLyrics,
    isLyricsOpen,
    setIsLyricsOpen,
    play,
    pause,
    resume,
    seek,
    setVolume,
    setOnEnded,
    updateCurrentTrack,
  };
}
