import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header, { formatDpUrl } from '../components/Header';
import HomeLeftSidebar from '../components/HomeLeftSidebar';
import HomeRightSidebar from '../components/HomeRightSidebar';
import { loadFromLocalStorage } from '../utils/cryptoUtils';
import './ReelsPage.css';

interface Reel {
  id: number;
  userId: number;
  uploaderName: string;
  uploaderUsername: string;
  uploaderDp: string;
  caption: string;
  videoUrl: string;
  likes: number;
  comments: number;
  reposts: number;
}

const MOCK_REELS: Reel[] = [
  {
    id: 1,
    userId: 101,
    uploaderName: 'Hannah Watson',
    uploaderUsername: '@hannah_w',
    uploaderDp: '/assets/images/dp/avatar-3.png',
    caption: 'Sunset vibes 🌅 Nothing beats this golden hour magic. Feeling grateful for moments like these. #GoldenHour #Sunset #Vibes',
    videoUrl: 'https://res.cloudinary.com/dddhjvwqr/video/upload/v1779945307/FDownloader.net-1299707968980730-_1080p_pdg5am.mp4',
    likes: 1248,
    comments: 84,
    reposts: 32,
  },
  {
    id: 2,
    userId: 102,
    uploaderName: 'Marcus Cruz',
    uploaderUsername: '@marcus_c',
    uploaderDp: '/assets/images/dp/avatar-men.png',
    caption: 'City nights never get old 🌆✨ The energy of this place is unmatched. Who else loves exploring at night? #CityLife #NightVibes',
    videoUrl: 'https://res.cloudinary.com/dddhjvwqr/video/upload/v1779945347/FDownloader.net-1944047222941502-_1080p_ug48kl.mp4',
    likes: 3572,
    comments: 210,
    reposts: 97,
  },
  {
    id: 3,
    userId: 103,
    uploaderName: 'Sofia Reyes',
    uploaderUsername: '@sofia_r',
    uploaderDp: '/assets/images/dp/avatar-3.png',
    caption: 'Adventure awaits 🏔️🌿 Every step forward is a step closer to something amazing. Keep going! #Adventure #Nature #Explore',
    videoUrl: 'https://res.cloudinary.com/dddhjvwqr/video/upload/v1779945532/FDownloader.net-1314014950907752-_1440p_wyfvmg.mp4',
    likes: 892,
    comments: 56,
    reposts: 18,
  },
];

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K';
  return String(n);
}

const ReelsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isDayMode, setIsDayMode]   = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [reels]       = useState<Reel[]>(MOCK_REELS);
  const [index, setIndex]   = useState(0);
  const [liked,  setLiked]  = useState<Record<number, boolean>>({});
  const [saved,  setSaved]  = useState<Record<number, boolean>>({});
  const [reposted, setReposted] = useState<Record<number, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>({});
  const [repostCounts, setRepostCounts] = useState<Record<number, number>>({});
  const [muted, setMuted]   = useState(false);
  const [playing, setPlaying] = useState(true);
  const [captionExpanded, setCaptionExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showNav, setShowNav] = useState(false);
  const [showEndBanner, setShowEndBanner] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const navTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reel = reels[index];
  const isFirst = index === 0;
  const isLast  = index === reels.length - 1;

  /* ── Load user ───────────────────────────────── */
  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await loadFromLocalStorage('Hannah143', 'user_data');
        if (data) setCurrentUser(data);
      } catch { /* ignore */ }
    };
    loadUser();
  }, []);

  /* ── Initialise like/repost counts from data ─ */
  useEffect(() => {
    const lc: Record<number, number> = {};
    const rc: Record<number, number> = {};
    reels.forEach((r) => { lc[r.id] = r.likes; rc[r.id] = r.reposts; });
    setLikeCounts(lc);
    setRepostCounts(rc);
  }, [reels]);

  /* ── Reset video + UI on index change ───────── */
  useEffect(() => {
    setCaptionExpanded(false);
    setProgress(0);
    setPlaying(true);
    setShowEndBanner(false);
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  }, [index]);

  /* ── Track video progress ────────────────────── */
  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (v && v.duration) {
      setProgress((v.currentTime / v.duration) * 100);
    }
  };

  /* ── Seek on progress bar click ─────────────── */
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const bar = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - bar.left) / bar.width;
    v.currentTime = pct * v.duration;
  };

  /* ── Play / pause toggle ─────────────────────── */
  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else          { v.pause(); setPlaying(false); }
  }, []);

  /* ── Show nav arrows briefly on mouse move ─── */
  const handleMouseMove = () => {
    setShowNav(true);
    if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
    navTimeoutRef.current = setTimeout(() => setShowNav(false), 2500);
  };

  /* ── Keyboard navigation ─────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        if (!isLast) setIndex((i) => i + 1);
        else setShowEndBanner(true);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        if (showEndBanner) { setShowEndBanner(false); }
        else if (!isFirst) setIndex((i) => i - 1);
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'm') {
        setMuted((m) => !m);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isFirst, isLast, showEndBanner, togglePlay]);

  /* ── Like toggle ─────────────────────────────── */
  const toggleLike = (id: number) => {
    setLiked((prev) => {
      const wasLiked = prev[id];
      setLikeCounts((lc) => ({ ...lc, [id]: lc[id] + (wasLiked ? -1 : 1) }));
      return { ...prev, [id]: !wasLiked };
    });
  };

  /* ── Save toggle ─────────────────────────────── */
  const toggleSave = (id: number) => {
    setSaved((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  /* ── Repost toggle ───────────────────────────── */
  const toggleRepost = (id: number) => {
    setReposted((prev) => {
      const was = prev[id];
      setRepostCounts((rc) => ({ ...rc, [id]: rc[id] + (was ? -1 : 1) }));
      return { ...prev, [id]: !was };
    });
  };

  const CAPTION_LIMIT = 100;
  const shortCaption  = reel.caption.length > CAPTION_LIMIT && !captionExpanded
    ? reel.caption.slice(0, CAPTION_LIMIT) + '…'
    : reel.caption;

  return (
    <div className={`reels-page-wrapper${isDayMode ? ' day' : ''}`}>
      <Header isDayMode={isDayMode} setIsDayMode={setIsDayMode} currentUser={currentUser} />

      <main className="reels-main">
        <HomeLeftSidebar currentUser={currentUser} />

        {/* ── Centre: video player ───────────────── */}
        <section className="reels-center" onMouseMove={handleMouseMove}>

          {/* Video stage */}
          <div className="reels-stage">

            {showEndBanner ? (
              <div className="reels-end-banner">
                <i className="fa-solid fa-film" />
                <p>You've watched all reels!</p>
                <div className="reels-end-actions">
                  <button className="reels-end-btn-secondary" onClick={() => setShowEndBanner(false)}>
                    <i className="fa-solid fa-chevron-left" /> Back
                  </button>
                  <button className="reels-end-btn-primary" onClick={() => { setShowEndBanner(false); setIndex(0); }}>
                    <i className="fa-solid fa-rotate-left" /> Watch again
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* ── VIDEO ───────────────────────────── */}
                <video
                  ref={videoRef}
                  key={reel.id}
                  className="reels-video"
                  src={reel.videoUrl}
                  autoPlay
                  loop
                  playsInline
                  muted={muted}
                  onTimeUpdate={handleTimeUpdate}
                  onClick={togglePlay}
                />

                {/* ── Play/Pause overlay icon ─────────── */}
                {!playing && (
                  <div className="reels-play-overlay" onClick={togglePlay}>
                    <i className="fa-solid fa-play" />
                  </div>
                )}

                {/* ── Progress bar ────────────────────── */}
                <div className="reels-progress-bar" onClick={handleSeek}>
                  <div className="reels-progress-fill" style={{ width: `${progress}%` }} />
                </div>

                {/* ── Top controls (mute, index) ───────── */}
                <div className={`reels-top-controls${showNav ? ' visible' : ''}`}>
                  <span className="reels-index-label">{index + 1} / {reels.length}</span>
                  <button
                    className="reels-ctrl-btn"
                    onClick={() => setMuted((m) => !m)}
                    title={muted ? 'Unmute' : 'Mute'}
                  >
                    <i className={`fa-solid ${muted ? 'fa-volume-xmark' : 'fa-volume-high'}`} />
                  </button>
                </div>

                {/* ── Uploader info + caption overlay ─── */}
                <div className="reels-overlay">
                  <div className="reels-uploader">
                    <img
                      className="reels-dp"
                      src={formatDpUrl(reel.uploaderDp)}
                      alt={reel.uploaderName}
                      onClick={() => navigate(`/profile?p=${reel.userId}`)}
                    />
                    <div className="reels-uploader-info">
                      <button
                        className="reels-uploader-name"
                        onClick={() => navigate(`/profile?p=${reel.userId}`)}
                      >
                        {reel.uploaderName}
                      </button>
                      <span className="reels-uploader-handle">{reel.uploaderUsername}</span>
                    </div>
                    <button className="reels-follow-btn">Follow</button>
                  </div>

                  <p className="reels-caption">
                    {shortCaption}
                    {reel.caption.length > CAPTION_LIMIT && (
                      <button
                        className="reels-caption-toggle"
                        onClick={() => setCaptionExpanded((v) => !v)}
                      >
                        {captionExpanded ? ' less' : ' more'}
                      </button>
                    )}
                  </p>
                </div>

                {/* ── Right-side action buttons ────────── */}
                <div className="reels-actions">
                  {/* Like */}
                  <button
                    className={`reels-action-btn${liked[reel.id] ? ' active-like' : ''}`}
                    onClick={() => toggleLike(reel.id)}
                    title="Like"
                  >
                    <i className={`${liked[reel.id] ? 'fa-solid' : 'fa-regular'} fa-heart`} />
                    <span>{formatCount(likeCounts[reel.id] ?? reel.likes)}</span>
                  </button>

                  {/* Comment */}
                  <button
                    className="reels-action-btn"
                    title="Comment"
                  >
                    <i className="fa-regular fa-comment-dots" />
                    <span>{formatCount(reel.comments)}</span>
                  </button>

                  {/* Save */}
                  <button
                    className={`reels-action-btn${saved[reel.id] ? ' active-save' : ''}`}
                    onClick={() => toggleSave(reel.id)}
                    title={saved[reel.id] ? 'Unsave' : 'Save'}
                  >
                    <i className={`${saved[reel.id] ? 'fa-solid' : 'fa-regular'} fa-bookmark`} />
                    <span>{saved[reel.id] ? 'Saved' : 'Save'}</span>
                  </button>

                  {/* Repost */}
                  <button
                    className={`reels-action-btn${reposted[reel.id] ? ' active-repost' : ''}`}
                    onClick={() => toggleRepost(reel.id)}
                    title="Repost"
                  >
                    <i className="fa-solid fa-retweet" />
                    <span>{formatCount(repostCounts[reel.id] ?? reel.reposts)}</span>
                  </button>
                </div>

                {/* ── Previous button ──────────────────── */}
                {!isFirst && (
                  <button
                    className={`reels-nav-btn reels-nav-prev${showNav ? ' visible' : ''}`}
                    onClick={() => setIndex((i) => i - 1)}
                    title="Previous reel"
                  >
                    <i className="fa-solid fa-chevron-up" />
                  </button>
                )}

                {/* ── Next button — always shown; triggers end-banner on last ── */}
                <button
                  className={`reels-nav-btn reels-nav-next${showNav ? ' visible' : ''}`}
                  onClick={() => {
                    if (!isLast) setIndex((i) => i + 1);
                    else setShowEndBanner(true);
                  }}
                  title={isLast ? 'End of reels' : 'Next reel'}
                >
                  <i className="fa-solid fa-chevron-down" />
                </button>
              </>
            )}
          </div>

          {/* ── Reel dots indicator ──────────────── */}
          <div className="reels-dots">
            {reels.map((_, i) => (
              <button
                key={i}
                className={`reels-dot${i === index ? ' active' : ''}`}
                onClick={() => setIndex(i)}
                aria-label={`Go to reel ${i + 1}`}
              />
            ))}
          </div>
        </section>

        <HomeRightSidebar userId={currentUser?.userId} />
      </main>
    </div>
  );
};

export default ReelsPage;
