import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AnimatedBackground } from './components/AnimatedBackground';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { MiniPlayer } from './components/MiniPlayer';
import { HomeScreen } from './screens/HomeScreen';
import { SearchScreen } from './screens/SearchScreen';
import { LibraryScreen } from './screens/LibraryScreen';
import { FavoritesScreen } from './screens/FavoritesScreen';
import { tracks } from './data/musicData';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentTrackId, setCurrentTrackId] = useState<number | null>(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likedTracks, setLikedTracks] = useState<Set<number>>(new Set([1, 2, 3]));

  const currentTrack = currentTrackId ? tracks.find((t) => t.id === currentTrackId) || null : null;

  const handleTrackSelect = (trackId: number) => {
    setCurrentTrackId(trackId);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (!currentTrack) return;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    setCurrentTrackId(tracks[nextIndex].id);
  };

  const toggleLike = () => {
    if (!currentTrack) return;
    setLikedTracks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(currentTrack.id)) {
        newSet.delete(currentTrack.id);
      } else {
        newSet.add(currentTrack.id);
      }
      return newSet;
    });
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen onTrackSelect={handleTrackSelect} />;
      case 'search':
        return <SearchScreen onTrackSelect={handleTrackSelect} />;
      case 'library':
        return <LibraryScreen onTrackSelect={handleTrackSelect} />;
      case 'favorites':
        return <FavoritesScreen onTrackSelect={handleTrackSelect} />;
      default:
        return <HomeScreen onTrackSelect={handleTrackSelect} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="size-full relative overflow-hidden">
        <AnimatedBackground />

        <div className="relative z-10 flex h-full">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="max-w-6xl mx-auto">{renderScreen()}</div>
          </main>
        </div>

        <MiniPlayer
          track={currentTrack}
          isPlaying={isPlaying}
          isLiked={currentTrack ? likedTracks.has(currentTrack.id) : false}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onLikeToggle={toggleLike}
        />

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </ThemeProvider>
  );
}
