export interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: number;
  image: string;
  genre: string;
}

export const tracks: Track[] = [
  {
    id: 1,
    title: 'Midnight Dreams',
    artist: 'Luna Eclipse',
    album: 'Cosmic Journey',
    duration: 243,
    image: 'https://images.unsplash.com/photo-1730537456020-cd3bfd7c491e?w=400',
    genre: 'Electronic',
  },
  {
    id: 2,
    title: 'Neon Lights',
    artist: 'Electric Pulse',
    album: 'City Nights',
    duration: 198,
    image: 'https://images.unsplash.com/photo-1730537455982-13fd2b5efb03?w=400',
    genre: 'Pop',
  },
  {
    id: 3,
    title: 'Acoustic Soul',
    artist: 'Harmony String',
    album: 'Unplugged Sessions',
    duration: 276,
    image: 'https://images.unsplash.com/photo-1730537456013-8dfd862f0036?w=400',
    genre: 'Acoustic',
  },
  {
    id: 4,
    title: 'Sunset Boulevard',
    artist: 'The Wanderers',
    album: 'Road Trip',
    duration: 214,
    image: 'https://images.unsplash.com/photo-1619983081593-e2ba5b543168?w=400',
    genre: 'Rock',
  },
  {
    id: 5,
    title: 'Digital Dreams',
    artist: 'Synth Wave',
    album: 'Retro Future',
    duration: 189,
    image: 'https://images.unsplash.com/photo-1761682704492-b7ed11edfda7?w=400',
    genre: 'Electronic',
  },
  {
    id: 6,
    title: 'Ocean Waves',
    artist: 'Ambient Flow',
    album: 'Natural Sounds',
    duration: 312,
    image: 'https://images.unsplash.com/photo-1618172842918-3eabce30c912?w=400',
    genre: 'Ambient',
  },
  {
    id: 7,
    title: 'Thunder Road',
    artist: 'Rock Legends',
    album: 'Greatest Hits',
    duration: 267,
    image: 'https://images.unsplash.com/photo-1571115764660-4d836c9f7f0b?w=400',
    genre: 'Rock',
  },
  {
    id: 8,
    title: 'Velvet Sky',
    artist: 'Dream Pop',
    album: 'Celestial',
    duration: 224,
    image: 'https://images.unsplash.com/photo-1736882178500-f99bbe22d77d?w=400',
    genre: 'Pop',
  },
  {
    id: 9,
    title: 'Jazz Nights',
    artist: 'Smooth Collective',
    album: 'Late Night Sessions',
    duration: 298,
    image: 'https://images.unsplash.com/photo-1666185761628-00a3655f4f7b?w=400',
    genre: 'Jazz',
  },
];

export const genres = ['All', 'Electronic', 'Pop', 'Rock', 'Acoustic', 'Ambient', 'Jazz'];

export const playlists = [
  {
    id: 1,
    name: 'Chill Vibes',
    trackCount: 24,
    image: 'https://images.unsplash.com/photo-1618172842918-3eabce30c912?w=400',
  },
  {
    id: 2,
    name: 'Workout Mix',
    trackCount: 18,
    image: 'https://images.unsplash.com/photo-1619983081593-e2ba5b543168?w=400',
  },
  {
    id: 3,
    name: 'Focus Flow',
    trackCount: 32,
    image: 'https://images.unsplash.com/photo-1736882178500-f99bbe22d77d?w=400',
  },
];
