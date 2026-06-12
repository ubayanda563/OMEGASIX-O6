import { useMemo } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { formatTimeCode } from '../data/audioUtils';

interface LyricsEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lyrics: string;
  currentTime: number;
  onLyricsChange: (value: string) => void;
  onSave: () => void;
}

export function LyricsEditor({ open, onOpenChange, lyrics, currentTime, onLyricsChange, onSave }: LyricsEditorProps) {
  const currentTimestamp = useMemo(() => formatTimeCode(currentTime), [currentTime]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Lyrics Editor</DialogTitle>
          <DialogDescription>
            Tap the current timestamp button to stamp timecodes into your lyrics and save as a local .lrc-ready text.
          </DialogDescription>
        </DialogHeader>
        <textarea
          value={lyrics}
          onChange={(event) => onLyricsChange(event.target.value)}
          rows={12}
          className="w-full rounded-3xl border border-white/10 bg-background/80 px-4 py-3 text-sm text-foreground outline-none shadow-inner"
          placeholder="Enter lyrics here…"
        />
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={() => onLyricsChange((prev) => `${prev}\n${currentTimestamp} `)}>
            Stamp {currentTimestamp}
          </Button>
          <Button type="button" onClick={onSave}>Save Lyrics</Button>
        </div>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
