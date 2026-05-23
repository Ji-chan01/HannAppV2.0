import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ─── Types ──────────────────────────────────────────────────────────────── */
export interface Story {
  id: number;
  name: string;
  avatar: string;
  image: string;
  time: string;
  isOwn?: boolean;          // true → "Add Story" tile was clicked
}

interface StoryModalProps {
  stories: Story[];
  initialIndex: number;    // which story to open first
  onClose: () => void;
}

/* ─── Progress bar for a single story ───────────────────────────────────── */
const STORY_DURATION_MS = 5000;

const StoryModal: React.FC<StoryModalProps> = ({ stories, initialIndex, onClose }) => {
  const [idx, setIdx]             = useState(initialIndex);
  const [liked, setLiked]         = useState(false);
  const [comment, setComment]     = useState('');
  const [progress, setProgress]   = useState(0);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [paused, setPaused]       = useState(false);
  const intervalRef               = useRef<ReturnType<typeof setInterval> | null>(null);
  const story                     = stories[idx];

  /* ── Auto-advance timer ── */
  const startTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setProgress(0);
    const step   = 50;                              // ms per tick
    let elapsed  = 0;

    intervalRef.current = setInterval(() => {
      elapsed += step;
      setProgress((elapsed / STORY_DURATION_MS) * 100);
      if (elapsed >= STORY_DURATION_MS) {
        clearInterval(intervalRef.current!);
        setIdx(prev => {
          if (prev < stories.length - 1) return prev + 1;
          onClose();
          return prev;
        });
      }
    }, step);
  }, [stories.length, onClose]);

  useEffect(() => {
    if (!paused) startTimer();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [idx, paused, startTimer]);

  const goNext = () => {
    if (idx < stories.length - 1) setIdx(i => i + 1);
    else onClose();
  };

  const goPrev = () => {
    if (idx > 0) setIdx(i => i - 1);
  };

  /* Close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    /* ── Backdrop ─────────────────────────────────────────────────────── */
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-md"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* ── Story card ─────────────────────────────────────────────────── */}
      <div
        className="relative flex flex-col w-full max-w-sm h-[90vh] rounded-2xl overflow-hidden shadow-2xl select-none"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >

        {/* ── Progress bars row ───────────────────────────────────────── */}
        <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2">
          {stories.map((_, i) => (
            <div key={i} className="flex-1 h-[3px] rounded-full bg-white/30 overflow-hidden">
              <div
                className="h-full bg-white transition-none rounded-full"
                style={{
                  width: i < idx ? '100%' : i === idx ? `${progress}%` : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* ── Full-screen story image ─────────────────────────────────── */}
        <img
          src={story.image}
          alt={story.name}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* ── Gradient overlays ──────────────────────────────────────── */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />

        {/* ── Top bar: avatar + name + time + menu + close ───────────── */}
        <div className="absolute top-0 left-0 right-0 z-30 flex items-center gap-3 px-4 pt-7 pb-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[var(--gradient-yellow)] shrink-0 shadow-lg">
            <img src={story.avatar} alt={story.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm leading-tight truncate">{story.name}</p>
            <p className="text-white/60 text-[11px]">{story.time}</p>
          </div>

          {/* Menu button */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Story menu"
            >
              <i className="fa-solid fa-ellipsis-vertical text-sm" />
            </button>

            {/* Dropdown menu */}
            {menuOpen && (
              <div className="absolute right-0 top-10 bg-[var(--eerie-black)] border border-[var(--jet)] rounded-xl shadow-xl w-44 py-1 z-50">
                {[
                  { icon: 'fa-share-nodes',   label: 'Share Story'  },
                  { icon: 'fa-flag',          label: 'Report'       },
                  { icon: 'fa-volume-xmark',  label: 'Mute'         },
                ].map(({ icon, label }) => (
                  <button
                    key={label}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-[var(--light-gray)] hover:bg-white/10 text-sm text-left cursor-pointer transition-colors"
                  >
                    <i className={`fa-solid ${icon} w-4 text-center`} />
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close story"
          >
            <i className="fa-solid fa-xmark text-base" />
          </button>
        </div>

        {/* ── Tap zones: prev / next ─────────────────────────────────── */}
        <div className="absolute inset-0 z-10 flex">
          <button
            className="w-1/3 h-full cursor-pointer opacity-0"
            onClick={goPrev}
            aria-label="Previous story"
          />
          <div className="w-1/3 h-full" />
          <button
            className="w-1/3 h-full cursor-pointer opacity-0"
            onClick={goNext}
            aria-label="Next story"
          />
        </div>

        {/* ── Prev / Next arrow buttons (visible) ────────────────────── */}
        {idx > 0 && (
          <button
            onClick={goPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white transition-all cursor-pointer shadow-lg"
            aria-label="Previous"
          >
            <i className="fa-solid fa-chevron-left text-sm" />
          </button>
        )}
        {idx < stories.length - 1 && (
          <button
            onClick={goNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white transition-all cursor-pointer shadow-lg"
            aria-label="Next"
          >
            <i className="fa-solid fa-chevron-right text-sm" />
          </button>
        )}

        {/* ── Bottom bar: heart + comment input ──────────────────────── */}
        <div className="absolute bottom-0 left-0 right-0 z-30 flex items-center gap-3 px-4 py-4">
          {/* Comment input */}
          <div className="flex-1 flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 gap-2 border border-white/20">
            <input
              type="text"
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Reply to story…"
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder-white/50 min-w-0"
              onFocus={() => setPaused(true)}
              onBlur={() => { if (!comment) setPaused(false); }}
            />
            {comment && (
              <button
                onClick={() => { setComment(''); setPaused(false); }}
                className="text-white/70 hover:text-white cursor-pointer transition-colors shrink-0"
              >
                <i className="fa-solid fa-paper-plane text-[var(--gradient-yellow)]" />
              </button>
            )}
          </div>

          {/* Heart reaction */}
          <button
            onClick={() => setLiked(l => !l)}
            className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all cursor-pointer shrink-0 ${
              liked
                ? 'bg-red-500/20 border-red-400 text-red-400 scale-110'
                : 'bg-white/10 border-white/20 text-white hover:text-red-400 hover:border-red-400'
            }`}
            aria-label="Like story"
          >
            <i className={`${liked ? 'fa-solid' : 'fa-regular'} fa-heart text-sm`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryModal;
