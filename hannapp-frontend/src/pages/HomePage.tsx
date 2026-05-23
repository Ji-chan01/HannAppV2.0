import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import CommentModal from '../components/CommentModal';
import StoryModal from '../components/StoryModal';
import type { Story } from '../components/StoryModal';
import './HomePage.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isDayMode, setIsDayMode] = useState(false);

  /* ─── Story state ─────────────────────────────── */
  const [storyOpen, setStoryOpen] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);
  const [addStoryOpen, setAddStoryOpen] = useState(false);

  /* ─── Story pagination ─────────────────────────────── */
  const STORIES_PER_PAGE = 5;
  const [storiesPage, setStoriesPage] = useState(0);
  const storiesRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  /* ─── Mock stories (replace with API data later) ── */
  const STORIES: Story[] = [
    {
      id: 1,
      name: 'Hannah Watson',
      avatar: '/assets/images/dp/avatar-3.png',
      image: '/assets/testImages/2785e4160c717d329d7770799f68ff3a.jpg',
      time: '2 hours ago',
    },
    {
      id: 2,
      name: 'Liam Bennett',
      avatar: '/assets/images/dp/avatar-men.png',
      image: '/assets/testImages/IMG_20240515_004422.jpg',
      time: '5 hours ago',
    },
    {
      id: 3,
      name: 'Sophia Rose',
      avatar: '/assets/images/dp/avatar-3.png',
      image: '/assets/testImages/2785e4160c717d329d7770799f68ff3a.jpg',
      time: '8 hours ago',
    },
    {
      id: 4,
      name: 'Ethan Dev',
      avatar: '/assets/images/dp/avatar-men.png',
      image: '/assets/testImages/IMG_20240515_004422.jpg',
      time: '12 hours ago',
    },
    {
      id: 5,
      name: 'Lily Moore',
      avatar: '/assets/images/dp/avatar-3.png',
      image: '/assets/testImages/2785e4160c717d329d7770799f68ff3a.jpg',
      time: '1 day ago',
    },
    {
      id: 6,
      name: 'Lily Moore2',
      avatar: '/assets/images/dp/avatar-3.png',
      image: '/assets/testImages/IMG_20240515_004422.jpg',
      time: '1 day ago',
    },
  ];

  const openStory = (i: number) => { setStoryIndex(i); setStoryOpen(true); };

  /* ─── Pagination helpers ──────────────────────────── */
  const totalStories = STORIES.length;
  // Advance by (STORIES_PER_PAGE - 1) so the blurred item becomes the first item of the next page
  const pageStart = storiesPage * (STORIES_PER_PAGE - 1);
  const pageEnd = Math.min(pageStart + STORIES_PER_PAGE, totalStories);
  const visibleStories = STORIES.slice(pageStart, pageEnd);
  const hasNextPage = pageEnd < totalStories;
  const hasPrevPage = storiesPage > 0;

  /* ─── Scroll check for homepage stories strip ─── */
  const checkScroll = () => {
    if (storiesRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = storiesRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollStories = (direction: 'left' | 'right') => {
    if (storiesRef.current) {
      const amount = 240;
      storiesRef.current.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    checkScroll();

    if (!storiesRef.current) return;

    // Use ResizeObserver to detect width changes (e.g., when thumbnails or child items load)
    const observer = new ResizeObserver(() => {
      checkScroll();
    });
    observer.observe(storiesRef.current);

    window.addEventListener('resize', checkScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  useEffect(() => {
    document.title = "HannApp";
  }, []);

  useEffect(() => {
    const originalWindowAdd = window.addEventListener;
    const originalDocumentAdd = document.addEventListener;

    const windowListeners: { type: string; listener: any; options?: any }[] = [];
    const documentListeners: { type: string; listener: any; options?: any }[] = [];

    (window as any).addEventListener = function (type: string, listener: any, options?: any) {
      const stack = new Error().stack || '';
      if (stack.includes('functionDom.js') || stack.includes('fetchData.js') || stack.includes('post.js')) {
        windowListeners.push({ type, listener, options });
      }
      return originalWindowAdd.call(window, type, listener, options);
    };

    (document as any).addEventListener = function (type: string, listener: any, options?: any) {
      const stack = new Error().stack || '';
      if (stack.includes('functionDom.js') || stack.includes('fetchData.js') || stack.includes('post.js')) {
        documentListeners.push({ type, listener, options });
      }
      return originalDocumentAdd.call(document, type, listener, options);
    };

    const scripts = [
      '/assets/scripts/homepage/functionDom.js',
      '/assets/scripts/homepage/fetchData.js',
      '/assets/scripts/homepage/post.js'
    ];

    const scriptElements: HTMLScriptElement[] = [];
    const timestamp = Date.now();

    scripts.forEach((src) => {
      const script = document.createElement('script');
      script.src = `${src}?t=${timestamp}`;
      script.type = 'module';
      script.async = true;
      document.body.appendChild(script);
      scriptElements.push(script);
    });

    return () => {
      window.addEventListener = originalWindowAdd;
      document.addEventListener = originalDocumentAdd;

      windowListeners.forEach(({ type, listener, options }) => {
        window.removeEventListener(type, listener, options);
      });
      documentListeners.forEach(({ type, listener, options }) => {
        document.removeEventListener(type, listener, options);
      });

      scriptElements.forEach((script) => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, []);

  return (
    <div className={`home-page-wrapper bg-[var(--smoky-black)] pt-12 min-h-screen w-full text-[var(--light-gray)] font-[var(--ff-poppins)] relative transition-colors duration-200 ${isDayMode ? 'day bg-white text-black' : ''}`}>
      <Header isDayMode={isDayMode} setIsDayMode={setIsDayMode} />

      <main className="main-container flex p-8 px-6 w-full max-w-full gap-6">
        <aside className="left-sidebar flex-[1.1] w-[40rem] flex flex-col gap-3 sticky top-12 max-h-max">

          {/* ── TOP: Clickable Profile Card ─────────────────── */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); navigate('/profile'); }}
            className="sidebar-profile-card flex items-center gap-3 bg-[var(--eerie-black)] shadow-[var(--box-shadow)] rounded-[16px] w-full p-3 hover:bg-[var(--jet)] transition-colors duration-150 group"
          >
            <div className="relative flex-shrink-0">
              <img
                className="myProfilePic rounded-full h-12 w-12 object-cover border-2 border-[var(--gradient-yellow)]/60 shadow-[var(--box-shadow)]"
                src="/assets/gifs/loading.gif"
                alt="Profile"
              />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[var(--eerie-black)]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span id="sidebarFullName" className="profile_name text-white text-sm font-semibold truncate leading-tight group-hover:text-[var(--orange-yellow-crayola)] transition-colors">Loading...</span>
              <span className="user_name text-[var(--light-gray)] text-xs truncate">Loading...</span>
            </div>
            <i className="fa-solid fa-chevron-right text-[var(--light-gray)] text-xs ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>

          {/* ── MIDDLE: Navigation Links ──────────────────────── */}
          <nav className="flex flex-col w-full overflow-hidden border-t border-b border-[var(--jet)] py-4">
            {[
              { icon: 'fa-solid fa-user-plus', label: 'Friend Requests', href: '#' },
              { icon: 'fa-solid fa-film', label: 'Reels', href: '#' },
              { icon: 'fa-solid fa-bag-shopping', label: 'Shop', href: '#' },
              { icon: 'fa-solid fa-users', label: 'Groups', href: '#' },
            ].map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                onClick={(e) => e.preventDefault()}
                className="flex items-center gap-3 px-4 py-3 text-[var(--light-gray)] hover:bg-[var(--jet)] hover:text-white transition-colors duration-150 group"
              >
                <div className="w-9 h-9 rounded-full bg-[var(--smoky-black)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--gradient-yellow)]/15 transition-colors">
                  <i className={`${icon} text-sm text-[var(--gradient-yellow)]`} />
                </div>
                <span className="text-sm font-medium">{label}</span>
              </a>
            ))}
          </nav>

          {/* ── BOTTOM: Games ────────────────────────────────── */}
          <div className="flex flex-col w-full p-4 gap-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h5 className="text-white font-bold text-xl">Games</h5>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-[var(--gradient-yellow)] text-sm font-semibold hover:underline"
              >
                Show all
              </a>
            </div>

            {/* 2-column grid */}
            <div className="grid grid-cols-2 gap-2">
              {/* Tetris placeholder */}
              <button
                className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[var(--jet)] transition-colors cursor-pointer group"
                onClick={() => { }}
                aria-label="Play Tetris"
              >
                <div className="w-full aspect-square rounded-xl overflow-hidden shadow-md">
                  <img
                    src="/assets/images/games/tetris.png"
                    alt="Tetris"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <span className="text-[var(--light-gray)] text-xs font-medium truncate w-full text-center group-hover:text-white transition-colors">Tetris</span>
              </button>
            </div>
          </div>

        </aside>

        <section className="middle w-full h-full p-[15px_20px] flex flex-col flex-[3] gap-0 min-w-0">
          <div className="w-full relative">
            {/* ── Prev page button ─────────────────────────────── */}
            {hasPrevPage && (
              <button
                type="button"
                onClick={() => setStoriesPage(p => p - 1)}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center shadow-lg border border-white/15 transition-all cursor-pointer"
                aria-label="Previous stories"
              >
                <i className="fa-solid fa-chevron-left text-xs" />
              </button>
            )}

            {/* ── Stories strip (max-width keeps it inside the middle column) ── */}
            <div
              ref={storiesRef}
              className="flex gap-3 pb-8 overflow-x-hidden max-w-full"
            >
              {/* Add Story tile – always visible */}
              <button
                onClick={() => setAddStoryOpen(true)}
                className="flex-shrink-0 flex flex-col items-center gap-1.5 cursor-pointer group"
                aria-label="Add your story"
              >
                <div className="relative w-[7rem] h-[10.75rem] rounded-xl overflow-hidden border border-[var(--gradient-yellow)]/60 group-hover:border-[var(--gradient-yellow)] transition-colors bg-[var(--smoky-black)]">

                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[var(--gradient-yellow)] flex items-center justify-center shadow-md">
                    <i className="fa-solid fa-plus text-[10px] text-black" />
                  </div>
                  <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[12px] text-[var(--light-gray)] font-medium w-16 text-center truncate leading-tight">
                    Add Story
                  </span>
                </div>
              </button>

              {/* ── Friends' story tiles (current page batch) ─── */}
              {visibleStories.map((story, localIdx) => {
                const globalIdx = pageStart + localIdx;
                // The last tile in the batch is blurred if there's a next page
                const isLastTile = localIdx === visibleStories.length - 1;
                const showBlur = isLastTile && hasNextPage;

                return (
                  <div key={story.id} className="relative flex-shrink-0">
                    <button
                      onClick={() => !showBlur && openStory(globalIdx)}
                      className={`flex flex-col items-center gap-1.5 cursor-pointer group ${showBlur ? 'pointer-events-none' : ''}`}
                      aria-label={`View ${story.name}'s story`}
                      tabIndex={showBlur ? -1 : 0}
                    >
                      <div
                        className="relative w-[7rem] h-[10.75rem] rounded-xl overflow-hidden"
                        style={showBlur ? { filter: 'blur(4px)', transform: 'scale(0.97)', transition: 'filter 0.2s' } : {}}
                      >
                        <img
                          src={story.image}
                          alt={story.name}
                          className="w-full h-full object-cover brightness-75 group-hover:brightness-90 transition-all duration-200"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
                        <div className="absolute top-1.5 left-1.5 w-7 h-7 rounded-full border-2 border-[var(--gradient-yellow)] overflow-hidden shadow-md">
                          <img src={story.avatar} alt={story.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="absolute bottom-1.5 left-0 right-0 text-left ml-1 text-[12px] text-white font-semibold px-0.5 leading-tight truncate">
                          {story.name}
                        </span>
                      </div>
                    </button>

                    {/* ── Blurred "Next" overlay ─── */}
                    {showBlur && (
                      <button
                        type="button"
                        onClick={() => setStoriesPage(p => p + 1)}
                        aria-label="Show next stories"
                        className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1.5 cursor-pointer rounded-xl bg-black/30 backdrop-blur-[2px] transition-all hover:bg-black/40"
                      >
                        <div className="w-9 h-9 rounded-full bg-white/20 border border-white/40 flex items-center justify-center shadow-lg backdrop-blur-sm">
                          <i className="fa-solid fa-chevron-right text-white text-sm" />
                        </div>
                        <span className="text-white text-[11px] font-semibold tracking-wide drop-shadow">Next</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <form id="postForm" className="create-post w-full gap-2 p-[0.8rem_1rem] border border-[var(--jet)] flex relative" encType="multipart/form-data">
            <div className="dp-container flex-shrink-0">
              <div className="profile-picture w-12 h-12 rounded-full overflow-hidden flex border border-white">
                <img className="myProfilePic w-full h-full object-cover" src="/assets/gifs/loading.gif" alt="" />
              </div>
            </div>

            <div className="inputs flex flex-col gap-2 w-full">
              <div className="upper-part border-b border-[var(--jet)] w-full flex relative">
                <input id="createPost" className="w-full bg-[var(--smoky-black)] text-[var(--light-gray)] border-none rounded-[0.5rem] p-4 outline-none placeholder-gray-500" type="text" placeholder="Loading webpage..." />
              </div>
              <div id="postImagesCont" className="post-images hidden gap-2 h-max">
                <div data-post-img-item="0" className="post-image-cont relative border-[1.3px] border-white h-20 w-20 overflow-hidden rounded-[0.5rem] shadow-[0_0_0.2rem_var(--light-gray)]">
                  <img className="post-img w-full h-full object-cover" style={{ background: 'white' }} src="" alt="" />
                  <i data-delete-img="0" className="fa-regular fa-trash-can absolute right-1.5 top-1.5 text-white rounded-full bg-black/40 p-1.5 text-[11px] cursor-pointer hover:bg-black/60 active:bg-black/80"></i>
                </div>
                <div data-post-img-item="1" className="post-image-cont relative border-[1.3px] border-white h-20 w-20 overflow-hidden rounded-[0.5rem] shadow-[0_0_0.2rem_var(--light-gray)]">
                  <img className="w-full h-full object-cover" style={{ background: 'white' }} src="" alt="" />
                  <i data-delete-img="1" className="fa-regular fa-trash-can absolute right-1.5 top-1.5 text-white rounded-full bg-black/40 p-1.5 text-[11px] cursor-pointer hover:bg-black/60 active:bg-black/80"></i>
                </div>
                <div data-post-img-item="2" className="post-image-cont relative border-[1.3px] border-white h-20 w-20 overflow-hidden rounded-[0.5rem] shadow-[0_0_0.2rem_var(--light-gray)]">
                  <img className="w-full h-full object-cover" style={{ background: 'white' }} src="" alt="" />
                  <i data-delete-img="2" className="fa-regular fa-trash-can absolute right-1.5 top-1.5 text-white rounded-full bg-black/40 p-1.5 text-[11px] cursor-pointer hover:bg-black/60 active:bg-black/80"></i>
                </div>
                <div data-post-img-item="3" className="post-image-cont relative border-[1.3px] border-white h-20 w-20 overflow-hidden rounded-[0.5rem] shadow-[0_0_0.2rem_var(--light-gray)]">
                  <img className="w-full h-full object-cover" style={{ background: 'white' }} src="" alt="" />
                  <i data-delete-img="3" className="fa-regular fa-trash-can absolute right-1.5 top-1.5 text-white rounded-full bg-black/40 p-1.5 text-[11px] cursor-pointer hover:bg-black/60 active:bg-black/80"></i>
                </div>
              </div>
              <p className="error hidden text-red-500 font-semibold text-xs pointer-events-none"></p>
              <div className="lower-part flex justify-between w-full relative items-center">
                <div className="file-uploads flex items-center gap-1.5">
                  <label htmlFor="pic-upload" className="label-upload-pic flex items-center justify-center border-none p-1.5 rounded-full cursor-pointer hover:bg-[var(--jet)] text-[var(--light-gray)] transition-colors">
                    <i className="fa-solid fa-image text-sm"></i>
                  </label>
                  <input id="pic-upload" className="hidden" type="file" accept="image/*" />

                  <label htmlFor="vid-upload" className="label-upload-pic flex items-center justify-center border-none p-1.5 rounded-full cursor-pointer hover:bg-[var(--jet)] text-[var(--light-gray)] transition-colors">
                    <i className="fa-solid fa-video text-sm"></i>
                  </label>
                  <input id="vid-upload" className="hidden" type="file" accept="video/*" />

                  <label htmlFor="emoji-upload" className="label-upload-pic flex items-center justify-center border-none p-1.5 rounded-full cursor-pointer hover:bg-[var(--jet)] text-[var(--light-gray)] transition-colors">
                    <i className="fa-regular fa-face-smile text-sm"></i>
                  </label>
                  <input id="emoji-upload" className="hidden" type="file" accept="image/*" />
                </div>
                <button type="submit" id="postNow" className="btn btn-primary rounded-full text-xs font-bold px-8 py-2 tracking-wide uppercase border border-white hover:shadow-[0_0_0.5rem_#fff] bg-[var(--smoky-black)] text-[var(--light-gray)] cursor-pointer transition-all">Post</button>
                <p className="warning opacity-0 absolute bottom-[-5px] text-red-500 text-xs font-semibold transition-opacity duration-200">You need to enter input first!</p>
              </div>
            </div>
          </form>

          <div className="feeds flex flex-col w-full" id="feeds"></div>
        </section>

        <aside className="right-sidebar flex-1 flex flex-col gap-6">
          <div className="following-container sticky top-[-2rem] flex flex-col gap-2">
            <h4 className="text-white font-bold px-2 text-2xl">Following</h4>
            <div className="line-separator w-[100%] align-self-center h-[1px] bg-[var(--jet)] mx-auto"></div>
            <div id="followingProfiles" className="following-profiles-cont overflow-y-auto h-[25rem] max-h-[25rem]"></div>
          </div>

          <footer className="footer sticky top-[29rem] bg-transparent border-none p-0 rounded-none flex flex-col">
            <ul className="additional-settings flex flex-row flex-wrap list-none gap-[0.7rem] gap-y-2 p-0 m-0">
              <li><a href="#" className="ul-link text-gray-500 text-xs hover:underline" onClick={(e) => e.preventDefault()}>About Us</a></li>
              <li><a href="#" className="ul-link text-gray-500 text-xs hover:underline" onClick={(e) => e.preventDefault()}>Terms and Services</a></li>
              <li><a href="#" className="ul-link text-gray-500 text-xs hover:underline" onClick={(e) => e.preventDefault()}>Privacy Policy</a></li>
              <li><a href="#" className="ul-link text-gray-500 text-xs hover:underline" onClick={(e) => e.preventDefault()}>Hannah AI</a></li>
              <li><a href="#" className="ul-link text-gray-500 text-xs hover:underline" onClick={(e) => e.preventDefault()}>Services</a></li>
              <li><a href="#" className="ul-link text-gray-500 text-xs hover:underline" onClick={(e) => e.preventDefault()}>Privacy Center</a></li>
              <li><a href="#" className="ul-link text-gray-500 text-xs hover:underline" onClick={(e) => e.preventDefault()}>Developers</a></li>
              <li><a href="#" className="ul-link text-gray-500 text-xs hover:underline" onClick={(e) => e.preventDefault()}>Terms</a></li>
              <li><a href="#" className="ul-link text-gray-500 text-xs hover:underline" onClick={(e) => e.preventDefault()}>Help</a></li>
            </ul>
            <div className="copyright mt-[25px] text-gray-500 text-[10px]">© 2024 HannApp</div>
          </footer>
        </aside>

        {/* ── CommentModal ───────────────────────── */}
        <CommentModal isDayMode={isDayMode} />

        {/* ── StoryModal ─────────────────────────── */}
        {storyOpen && (
          <StoryModal
            stories={STORIES}
            initialIndex={storyIndex}
            onClose={() => setStoryOpen(false)}
          />
        )}

        {/* ── Add Story upload modal ─────────────── */}
        {addStoryOpen && (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setAddStoryOpen(false); }}
          >
            <div className="bg-[var(--eerie-black)] border border-[var(--jet)] rounded-2xl p-8 w-full max-w-xs flex flex-col items-center gap-5 shadow-2xl">
              <h3 className="text-white font-bold text-lg">Add to Your Story</h3>
              <p className="text-[var(--light-gray)] text-xs text-center">
                Share a photo or video that disappears after 24 hours.
              </p>

              {/* Upload zone */}
              <label
                htmlFor="story-upload"
                className="w-full h-36 border-2 border-dashed border-[var(--gradient-yellow)]/50 hover:border-[var(--gradient-yellow)] rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group"
              >
                <i className="fa-solid fa-cloud-arrow-up text-3xl text-[var(--gradient-yellow)]/70 group-hover:text-[var(--gradient-yellow)] transition-colors" />
                <span className="text-[var(--light-gray)] text-xs">Click to upload photo / video</span>
                <input id="story-upload" type="file" accept="image/*,video/*" className="hidden" />
              </label>

              {/* Action buttons */}
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setAddStoryOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[var(--jet)] text-[var(--light-gray)] text-sm font-semibold hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setAddStoryOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[var(--gradient-yellow)] hover:bg-[#d48c10] text-black text-sm font-bold transition-colors cursor-pointer"
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="profile-modal">
          <a className="profile" href="#" onClick={(e) => { e.preventDefault(); navigate('/profile'); }}>
            <div className="profile-picture">
              <img className="myProfilePic" src="/assets/gifs/loading.gif" alt="" />
            </div>
            <div className="handle">
              <h4 className="profile_name">Loading...</h4>
              <p className="user_name text-muted">Loading...</p>
            </div>
          </a>
          <div>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/settings?entry_point=account_settings'); }} className="menu-item">
              <span><i className="fa-solid fa-wrench"></i></span>
              <h3>Account Settings</h3>
            </a>
            <div id="logout_btn" className="menu-item">
              <span><i className="fa-solid fa-right-from-bracket"></i></span>
              <h3>Log Out</h3>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
