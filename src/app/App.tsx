import { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AnimatedBackground } from './components/AnimatedBackground';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { AudioPlayer } from './components/AudioPlayer';
import { HomeScreen } from './screens/HomeScreen';
import { SearchScreen } from './screens/SearchScreen';
import { LibraryScreen } from './screens/LibraryScreen';
import { FavoritesScreen } from './screens/FavoritesScreen';
import { useLibrary } from './hooks/useLibrary';
import { useAudioPlayer } from './hooks/useAudioPlayer';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const { tracks, likedTracks, isImporting, importProgress, importFiles, removeTrack, toggleLike } = useLibrary();
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    waveform,
    lyrics,
    play,
    pause,
    resume,
    seek,
    setVolume,
    setOnEnded,
    updateCurrentTrack,
  } = useAudioPlayer();

  const handleTrackSelect = useCallback(async (id: string) => {
    const track = tracks.find((t) => t.id === id);
    if (!track) return;
    if (currentTrack?.id === id) {
      isPlaying ? pause() : resume();
    } else {
      await play(track);
    }
  }, [tracks, currentTrack, isPlaying, play, pause, resume]);

  const handlePlayPause = useCallback(() => {
    isPlaying ? pause() : resume();
  }, [isPlaying, pause, resume]);

  const handleNext = useCallback(async () => {
    if (tracks.length === 0) return;
    const idx = currentTrack ? tracks.findIndex((t) => t.id === currentTrack.id) : -1;
    await play(tracks[(idx + 1) % tracks.length]);
  }, [tracks, currentTrack, play]);

  const handlePrev = useCallback(async () => {
    if (tracks.length === 0) return;
    const idx = currentTrack ? tracks.findIndex((t) => t.id === currentTrack.id) : 0;
    await play(tracks[(idx - 1 + tracks.length) % tracks.length]);
  }, [tracks, currentTrack, play]);

  // Auto-advance on track end
  useEffect(() => { setOnEnded(handleNext); }, [setOnEnded, handleNext]);

  // Sync liked state into displayed current track
  useEffect(() => {
    if (!currentTrack) return;
    const updated = tracks.find((t) => t.id === currentTrack.id);
    if (updated && updated.liked !== currentTrack.liked) updateCurrentTrack(updated);
  }, [tracks, currentTrack, updateCurrentTrack]);

  const isCurrentLiked = currentTrack ? (tracks.find((t) => t.id === currentTrack.id)?.liked ?? false) : false;

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen tracks={tracks} currentTrack={currentTrack} isPlaying={isPlaying} isImporting={isImporting} importProgress={importProgress} onTrackSelect={handleTrackSelect} onImport={importFiles} />;
      case 'search':
        return <SearchScreen tracks={tracks} currentTrack={currentTrack} isPlaying={isPlaying} onTrackSelect={handleTrackSelect} />;
      case 'library':
        return <LibraryScreen tracks={tracks} currentTrack={currentTrack} isPlaying={isPlaying} isImporting={isImporting} importProgress={importProgress} onTrackSelect={handleTrackSelect} onRemoveTrack={removeTrack} onImport={importFiles} />;
      case 'favorites':
        return <FavoritesScreen likedTracks={likedTracks} currentTrack={currentTrack} isPlaying={isPlaying} onTrackSelect={handleTrackSelect} onToggleLike={toggleLike} />;
      default:
        return null;
    }
  };

  return (
    <ThemeProvider>
      <div className="h-screen w-full relative overflow-hidden">
        <AnimatedBackground />

        <div className="relative z-10 flex h-full">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-28 md:pb-24 scrollbar-thin">
            <div className="max-w-5xl mx-auto">{renderScreen()}</div>
          </main>
        </div>

        <AudioPlayer
          track={currentTrack}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          waveform={currentTrack?.waveform}
          lyrics={currentTrack?.lyrics}
          isLiked={isCurrentLiked}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrev={handlePrev}
          onSeek={seek}
          onVolumeChange={setVolume}
          onLikeToggle={() => currentTrack && toggleLike(currentTrack.id)}
          onEditLyrics={() => {
            if (!currentTrack) return;
          }}
        />

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </ThemeProvider>
  );
}
