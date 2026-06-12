<div align="center">

<img src="https://img.shields.io/badge/O6-OMEGASIX-0A84FF?style=for-the-badge&labelColor=030306&color=0A84FF" alt="OMEGASIX" />

# OMEGASIX (O6)

### Fully offline music player — plays audio files directly from your device storage.
### No internet required. No accounts. No streaming. Just your music.

![Vite](https://img.shields.io/badge/Vite-6.3-646CFF?style=flat-square&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Offline](https://img.shields.io/badge/Works-Offline-22C55E?style=flat-square)

</div>

---

## What is O6?

**OMEGASIX** is a fully offline, browser-based music player. Import audio files from your device — MP3, FLAC, WAV, AAC, OGG, M4A — and they are stored locally using IndexedDB. Nothing is uploaded anywhere. Everything stays on your device.

---

## Features

| Feature | Detail |
|---|---|
| 🎵 **Local file playback** | MP3, FLAC, WAV, AAC, OGG, M4A, Opus |
| 📁 **Folder import** | Drag & drop a whole folder at once |
| 🏷️ **Auto metadata** | Reads ID3 tags for title, artist, album, artwork |
| 💾 **Persistent library** | Files stored in IndexedDB — survives page reloads |
| ❤️ **Favorites** | Like tracks and view them in a dedicated tab |
| 🔍 **Search** | Filter your library by title, artist, or album |
| 🌙 **Dark / Light mode** | Animated theme toggle |
| 📱 **Responsive** | Desktop sidebar + mobile bottom nav |
| 🔊 **Full player** | Full-screen player with artwork, seek, volume, shuffle, repeat |
| ⌨️ **Media keys** | Lock screen controls via Media Session API |
| 🚫 **Zero backend** | No server, no API, no login required |

---

## Quick Start

### Prerequisites

Make sure you have one of the following installed:

| Tool | Version | Install |
|---|---|---|
| **Node.js** | 18+ | [nodejs.org](https://nodejs.org) |
| **pnpm** (recommended) | 8+ | `npm install -g pnpm` |
| **npm** | 9+ | Comes with Node.js |

---

### 1. Clone the repo

```bash
git clone https://github.com/ubayanda563/OMEGASIX-O6.git
cd OMEGASIX-O6
```

---

### 2. Install dependencies

**With pnpm (recommended):**
```bash
pnpm install
```

**With npm:**
```bash
npm install
```

> ⚠️ The project uses `pnpm-workspace.yaml`. If you use npm and hit peer dependency warnings, run:
> ```bash
> npm install --legacy-peer-deps
> ```

---

### 3. Start the development server

**With pnpm:**
```bash
pnpm dev
```

**With npm:**
```bash
npm run dev
```

The app will open at **http://localhost:5173**

---

### 4. Build for production

```bash
pnpm build
# or
npm run build
```

Output goes to the `dist/` folder. Serve it with any static host or locally:

```bash
pnpm dlx serve dist
# or
npx serve dist
```

---

## Running in GitHub Codespaces

1. Open the repo on GitHub and click **Code → Open with Codespaces**
2. Once the Codespace is ready, open the terminal and run:

```bash
pnpm install
pnpm dev
```

3. Codespaces will prompt you to open the forwarded port — click **Open in Browser**
4. If the port doesn't auto-forward, go to the **Ports** tab and open port `5173`

---

## How to use the app

### Importing music
1. Open the **Library** tab
2. Either:
   - **Drag and drop** audio files or a folder onto the import zone
   - Click **Browse Files** to pick individual tracks
   - Click **Open Folder** to import an entire folder at once
3. Tracks are automatically read for metadata (title, artist, album, artwork)
4. Your library persists between sessions — no need to re-import

### Playing music
- Click any track to play it
- Use the **mini player** at the bottom to control playback
- Tap the track artwork or the **↑ arrow** to open the full-screen player
- **Media keys** on your keyboard / headphones work automatically

### Full player controls

| Control | Action |
|---|---|
| **⏮** | Previous track (or restart if > 3s in) |
| **⏯** | Play / Pause |
| **⏭** | Next track |
| **⇄** | Toggle shuffle |
| **↻** | Cycle repeat (off → all → one) |
| **♡** | Like / unlike track |
| Progress bar | Click anywhere to seek |
| Volume bar | Click anywhere to set volume |

---

## Project structure

```
OMEGASIX-O6/
├── index.html
├── vite.config.ts
├── package.json
└── src/
    ├── main.tsx                    # App entry point
    ├── styles/
    │   ├── theme.css               # CSS variables (colours, glass, spacing)
    │   ├── globals.css             # Global resets
    │   └── tailwind.css            # Tailwind entry
    └── app/
        ├── App.tsx                 # Root component — wires all state
        ├── contexts/
        │   └── ThemeContext.tsx     # Dark / light mode
        ├── data/
        │   ├── db.ts               # IndexedDB schema + CRUD helpers
        │   └── musicData.ts        # Supported file types, constants
        ├── hooks/
        │   ├── useAudioPlayer.ts   # HTML5 Audio playback engine
        │   └── useLibrary.ts       # File import + IndexedDB library
        ├── components/
        │   ├── Logo.tsx            # O6 / OMEGASIX mark
        │   ├── AudioPlayer.tsx     # Full-screen player overlay
        │   ├── MiniPlayer.tsx      # Bottom mini player bar
        │   ├── Sidebar.tsx         # Desktop nav (O6 logo top-left)
        │   ├── BottomNav.tsx       # Mobile bottom nav
        │   ├── ImportZone.tsx      # Drag & drop file importer
        │   ├── GlassPanel.tsx      # Reusable glass surface
        │   ├── GlassButton.tsx     # Reusable glass button
        │   ├── AnimatedBackground.tsx # Animated blob background
        │   └── ui/                 # shadcn/ui components (37 components)
        └── screens/
            ├── HomeScreen.tsx      # Home — featured + recent tracks
            ├── LibraryScreen.tsx   # Library — all tracks + importer
            ├── SearchScreen.tsx    # Search — filter by title/artist/album
            └── FavoritesScreen.tsx # Favorites — liked tracks
```

---

## Supported audio formats

| Format | Extension |
|---|---|
| MP3 | `.mp3` |
| FLAC | `.flac` |
| WAV | `.wav` |
| AAC | `.aac` |
| OGG Vorbis | `.ogg` |
| M4A / AAC | `.m4a` |
| Opus | `.opus` |
| WebM Audio | `.weba` |

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite 6 |
| Styling | Tailwind CSS 4 + CSS variables |
| Animation | Motion (Framer Motion) |
| UI components | shadcn/ui (Radix UI) |
| Icons | Lucide React |
| Audio metadata | music-metadata-browser |
| Storage | IndexedDB (via custom `db.ts`) |
| Routing | React Router v7 |

---

## Troubleshooting

**`pnpm: command not found`**
```bash
npm install -g pnpm
```

**Port 5173 already in use**
```bash
pnpm dev --port 3000
```

**Tracks not showing after import**
- Make sure the file format is in the supported list above
- Try refreshing — IndexedDB data persists between sessions
- Check the browser console for errors (F12)

**App looks broken / unstyled**
```bash
pnpm install  # re-install dependencies
pnpm dev      # restart dev server
```

**`music-metadata-browser` not found**
```bash
pnpm install music-metadata-browser
```

---

## License

MIT — free to use, modify, and distribute.

---

<div align="center">
Built with ♪ by <strong>ubayanda563</strong>
</div>
