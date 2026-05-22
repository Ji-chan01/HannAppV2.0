import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './ProfilePage.css';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [isDayMode, setIsDayMode] = useState(false);

  // ── Cover Photo State ──
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [coverMode, setCoverMode] = useState<'idle' | 'editing' | 'saved'>('idle');
  const [imageOffsetY, setImageOffsetY] = useState(50); // percentage: 0=top, 100=bottom
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartOffset = useRef(50);
  const coverContainerRef = useRef<HTMLDivElement>(null);

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCoverPhoto(url);
    setImageOffsetY(50);
    setCoverMode('editing');
    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  const handleDragStart = (e: React.PointerEvent<HTMLDivElement>) => {
    if (coverMode !== 'editing') return;
    isDragging.current = true;
    dragStartY.current = e.clientY;
    dragStartOffset.current = imageOffsetY;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleDragMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || coverMode !== 'editing') return;
    const container = coverContainerRef.current;
    if (!container) return;
    const containerH = container.getBoundingClientRect().height;
    const deltaY = e.clientY - dragStartY.current;
    // Each pixel of drag translates to a percentage shift based on container height
    const deltaPercent = (deltaY / containerH) * 100;
    const newOffset = Math.min(100, Math.max(0, dragStartOffset.current - deltaPercent));
    setImageOffsetY(newOffset);
  };

  const handleDragEnd = () => {
    isDragging.current = false;
  };

  const handleSaveChanges = () => {
    setCoverMode('saved');
  };

  const handleCancel = () => {
    if (coverPhoto) URL.revokeObjectURL(coverPhoto);
    setCoverPhoto(null);
    setImageOffsetY(50);
    setCoverMode('idle');
  };

  useEffect(() => {
    document.title = 'HannApp';
  }, []);

  // ── Dynamic script loader with event-listener tracking and cleanup ──
  useEffect(() => {
    const originalWindowAdd = window.addEventListener;
    const originalDocumentAdd = document.addEventListener;

    const windowListeners: { type: string; listener: any; options?: any }[] = [];
    const documentListeners: { type: string; listener: any; options?: any }[] = [];

    (window as any).addEventListener = function (type: string, listener: any, options?: any) {
      const stack = new Error().stack || '';
      if (stack.includes('profileDom.js') || stack.includes('fetchProfile.js')) {
        windowListeners.push({ type, listener, options });
      }
      return originalWindowAdd.call(window, type, listener, options);
    };

    (document as any).addEventListener = function (type: string, listener: any, options?: any) {
      const stack = new Error().stack || '';
      if (stack.includes('profileDom.js') || stack.includes('fetchProfile.js')) {
        documentListeners.push({ type, listener, options });
      }
      return originalDocumentAdd.call(document, type, listener, options);
    };

    const scripts = [
      '/assets/scripts/profiles/profileDom.js',
      '/assets/scripts/profiles/fetchProfile.js',
    ];

    const scriptElements: HTMLScriptElement[] = [];
    const timestamp = Date.now();

    scripts.forEach((src, index) => {
      const script = document.createElement('script');
      script.src = `${src}?t=${timestamp}`;
      // profileDom.js is NOT a module; fetchProfile.js IS a module
      script.type = index === 1 ? 'module' : 'text/javascript';
      script.async = true;
      document.body.appendChild(script);
      scriptElements.push(script);
    });

    return () => {
      // Restore originals
      window.addEventListener = originalWindowAdd;
      document.addEventListener = originalDocumentAdd;

      windowListeners.forEach(({ type, listener, options }) =>
        window.removeEventListener(type, listener, options)
      );
      documentListeners.forEach(({ type, listener, options }) =>
        document.removeEventListener(type, listener, options)
      );

      scriptElements.forEach((script) => {
        if (script.parentNode) script.parentNode.removeChild(script);
      });
    };
  }, [navigate]);

  return (
    <div className={`profile-page-wrapper bg-[#000000] min-h-screen w-full text-[var(--light-gray)] font-[var(--ff-poppins)] pt-[5rem] relative ${isDayMode ? 'day' : ''}`}>

      {/* ── HEADER ── */}
      <Header isDayMode={isDayMode} setIsDayMode={setIsDayMode} />

      {/* ── PROFILE MODAL (dropdown) ── */}
      <div className="profile-modal">
        <a href="/profile" className="profile" onClick={(e) => { e.preventDefault(); navigate('/profile'); }}>
          <div className="profile-picture">
            <img className="user-dp" src="/assets/gifs/loading.gif" alt="" />
          </div>
          <div className="handle">
            <h4 className="user_name">Loading...</h4>
            <p className="user_username text-muted">Loading...</p>
          </div>
        </a>
        <div>
          <a
            href="/settings?entry_point=account_settings"
            className="menu-item"
            onClick={(e) => { e.preventDefault(); navigate('/settings?entry_point=account_settings'); }}
          >
            <span><i className="fa-solid fa-wrench"></i></span><h3>Account Settings</h3>
          </a>
          <div id="logout_btn" className="menu-item">
            <span><i className="fa-solid fa-right-from-bracket"></i></span><h3>Log Out</h3>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTAINER (Exact width and layout matching screenshot) ── */}
      <main className="mx-auto max-w-[1000px] w-full flex flex-col pt-4 px-4 md:px-0">

        {/* ── HERO BANNER SECTION ── */}
        <section className="w-full relative">
          {/* Hidden file input for cover photo */}
          <input
            ref={coverFileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCoverFileChange}
          />

          {/* Cover Photo Container */}
          <div
            ref={coverContainerRef}
            className="w-full h-[230px] bg-[#1c1c1e] rounded-none relative overflow-hidden select-none"
            style={coverMode === 'editing' ? { cursor: 'grab' } : {}}
            onPointerDown={handleDragStart}
            onPointerMove={handleDragMove}
            onPointerUp={handleDragEnd}
            onPointerLeave={handleDragEnd}
          >
            {/* Cover image */}
            {coverPhoto && (
              <img
                src={coverPhoto}
                alt="Cover"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                style={{ objectPosition: `center ${imageOffsetY}%` }}
                draggable={false}
              />
            )}

            {/* Dark overlay hint when dragging in editing mode */}
            {coverMode === 'editing' && coverPhoto && (
              <div className="absolute inset-0 bg-black/20 pointer-events-none flex items-center justify-center">
                <span className="text-white text-xs font-semibold bg-black/50 px-3 py-1.5 rounded-full select-none">
                  <i className="fa-solid fa-up-down mr-1.5"></i>Drag to reposition
                </span>
              </div>
            )}

            {/* Bottom-right action buttons */}
            <div
              className="absolute bottom-3 right-3 flex items-center gap-2 z-20"
              onPointerDown={(e) => e.stopPropagation()}
            >
              {coverMode === 'idle' || coverMode === 'saved' ? (
                // Add Cover Photo button
                <button
                  onClick={() => coverFileInputRef.current?.click()}
                  className="flex items-center gap-2 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white text-xs font-semibold px-4 py-2 rounded-none border border-white/30 hover:border-white/60 transition-all cursor-pointer"
                >
                  <i className="fa-solid fa-camera text-[11px]"></i>
                  {coverMode === 'saved' ? 'Change Cover Photo' : 'Add Cover Photo'}
                </button>
              ) : (
                // Save Changes + Cancel buttons (editing mode)
                <>
                  <button
                    onClick={handleSaveChanges}
                    className="flex items-center gap-2 bg-[#e89b15] hover:bg-[#d48c10] text-white text-xs font-semibold px-4 py-2 rounded-none border border-[#e89b15] transition-all cursor-pointer"
                  >
                    <i className="fa-solid fa-check text-[11px]"></i>
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white text-xs font-semibold px-4 py-2 rounded-none border border-white/40 hover:border-white/70 transition-all cursor-pointer"
                  >
                    <i className="fa-solid fa-xmark text-[11px]"></i>
                    Cancel
                  </button>
                </>
              )}
            </div>

          </div>

          {/* Overlapping Profile Info Container */}
          <div className="relative flex items-end pl-6 md:pl-10 -mt-[-20px] z-10 w-full gap-5">
            {/* Avatar Circle with Thick White Border */}
            <div className="w-[150px] h-[150px] rounded-full border-[5px] border-white bg-[#000000] overflow-hidden flex items-center justify-center shrink-0 shadow-lg">
              <img
                className="profile-dp w-full h-full object-cover"
                src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/></svg>"
                alt="Profile Avatar"
              />
            </div>

            {/* Name, Handle, Bio and Buttons placed to the right of avatar, overlapping the banner */}
            <div className="flex flex-col flex-1 pb-2">
              <h1 className="profile_name text-[22px] font-bold text-white tracking-wide leading-tight">Juan Teodoro</h1>
              <p className="profile_username text-[#888888] font-normal text-sm mt-0.5">@denielle</p>
              <p className="text-sm text-white font-normal mt-2">Bio here</p>

              {/* Square Action Buttons aligned directly below the bio */}
              <div className="top-buttons flex items-center gap-3 mt-3.5">
                <button
                  id="addFriend"
                  className="bg-[#e89b15] hover:bg-[#d48c10] text-white font-semibold px-8 py-3 rounded-none text-[13px] tracking-wide transition-all border border-[#e89b15] cursor-pointer"
                >
                  Friends
                </button>
                <button
                  id="sendMessage"
                  className="bg-transparent border border-white hover:bg-white/10 text-white font-semibold px-8 py-3 rounded-none text-[13px] tracking-wide transition-all cursor-pointer"
                >
                  Message
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── NAVIGATION TABS BAR ── */}
        <section className="posts-cont w-full mt-8">
          <header className="bot-sec bg-[#1c1c1e] border-none py-4 px-8 rounded-none">
            <div className="control-bot-style flex justify-between items-center w-full">
              <div className="left-sec">
                <ul className="left-nav flex items-center gap-8">
                  <li>
                    <button
                      id="postBtn"
                      className="nav-link active text-[#e89b15] font-semibold text-xs transition-all cursor-pointer bg-transparent border-none p-0 outline-none"
                    >
                      Post
                    </button>
                  </li>
                  <li>
                    <button
                      className="nav-link text-[#888888] hover:text-white font-semibold text-xs transition-all cursor-pointer bg-transparent border-none p-0 outline-none"
                    >
                      Friends
                    </button>
                  </li>
                </ul>
              </div>
              <div className="right-sec">
                <ul className="right-nav flex items-center gap-8">
                  <li>
                    <button
                      className="nav-link text-[#888888] hover:text-white font-semibold text-xs transition-all cursor-pointer bg-transparent border-none p-0 outline-none"
                    >
                      Photos
                    </button>
                  </li>
                  <li>
                    <button
                      className="nav-link text-[#888888] hover:text-white font-semibold text-xs transition-all cursor-pointer bg-transparent border-none p-0 outline-none"
                    >
                      Videos
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Hidden aboutBtn for legacy event-listener compatibility */}
            <button id="aboutBtn" className="hidden"></button>
          </header>

          {/* ── TWO-COLUMN GRID CONTENT ── */}
          <section className="nav-cont py-6 grid grid-cols-1 md:grid-cols-10 gap-6 items-start w-full">

            {/* LEFT COLUMN (Width ~ 35% on desktop: About & Featured) */}
            <div
              id="about"
              className="flex flex-col gap-6 md:col-span-4 bg-transparent p-0 border-none shadow-none"
            >
              {/* About Section */}
              <div className="w-full">
                <h3 className="text-[25px] font-bold text-white mb-4">
                  About
                </h3>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-xs">
                    <i className="fa-solid fa-house text-white text-sm w-4 text-center shrink-0"></i>
                    <span className="text-[#a0a0a0]">Bititong, Masbate, Phililppines</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <i className="fa-solid fa-location-dot text-white text-sm w-4 text-center shrink-0"></i>
                    <span className="text-[#a0a0a0]">Kinamaligan, Masbate, Phililppines</span>
                  </div>

                  {/* Keep gender/birthday for legacy data population, hidden to match screenshot */}
                  <div className="hidden">
                    <span id="birthday">July 20, 2004</span>
                    <span id="gender">Female</span>
                  </div>
                </div>
              </div>

              {/* Featured Section */}
              <div className="w-full mt-2">
                <h3 className="text-[25px] font-bold text-white mb-4">
                  Featured
                </h3>

                <div className="grid grid-cols-3 gap-2">
                  <div className="aspect-square bg-[#1c1c1e] rounded-[4px] border-none transition-all cursor-pointer"></div>
                  <div className="aspect-square bg-[#1c1c1e] rounded-[4px] border-none transition-all cursor-pointer"></div>
                  <div className="aspect-square bg-[#1c1c1e] rounded-[4px] border-none transition-all cursor-pointer"></div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN (Width ~ 65% on desktop: Posts) */}
            <div
              id="post"
              className="flex flex-col gap-0 md:col-span-6 w-full"
            >
              {/* Post 1 */}
              <div className="posts">
                <div className="feed-header">
                  <div className="dp-container">
                    <div className="profile-picture">
                      <img className="myProfilePic user-dp" src="/assets/images/dp/avatar-3.png" alt="" loading="lazy" />
                    </div>
                  </div>
                  <div className="poster-container-info">
                    <div className="feed-header-container">
                      <div className="poster-infos">
                        <div className="name">
                          <a href="#" className="profile-link">
                            <h4 className="profile_name">Juan Teodoro</h4>
                          </a>
                          <p className="text-muted">&bull;</p>
                          <p className="text-muted">2 hours ago</p>
                        </div>
                        <div className="time">
                          <p className="text-muted profile_username">@denielle</p>
                        </div>
                      </div>
                      <p>
                        <span className="edit" data-edit-id="101">
                          <span className="options"></span>
                        </span>
                      </p>
                    </div>
                    <div className="photo">
                      <div style={{ padding: 0 }}>
                        <p>Serene escapes 🌲🏔️</p>
                        <h1>Spending the weekend in the mountains, disconnected from the noise. The fresh alpine air is exactly what I needed!</h1>
                      </div>
                      <div className="facebook-post">
                        <div className="see-more">
                          <i className="fa-regular fa-eye"></i>
                          <p>See more</p>
                        </div>
                        <div className="image-grid single-image">
                          <img className="photo-post" src="/assets/testImages/2785e4160c717d329d7770799f68ff3a.jpg" loading="lazy" alt="" />
                        </div>
                      </div>
                      <div className="reactions">
                        <div>
                          <i data-like-id="101" className="like fa-regular fa-heart"></i>
                          <h1>124</h1>
                        </div>
                        <div>
                          <i data-comment-id="101" className="comment fa-regular fa-comment-dots"></i>
                          <h1>1</h1>
                        </div>
                        <div>
                          <i data-bookmark-id="101" className="bookmark fa-regular fa-bookmark"></i>
                          <h1>0</h1>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Post 2 */}
              <div className="posts">
                <div className="feed-header">
                  <div className="dp-container">
                    <div className="profile-picture">
                      <img className="myProfilePic user-dp" src="/assets/images/dp/avatar-men.png" alt="" loading="lazy" />
                    </div>
                  </div>
                  <div className="poster-container-info">
                    <div className="feed-header-container">
                      <div className="poster-infos">
                        <div className="name">
                          <a href="#" className="profile-link">
                            <h4 className="profile_name">Juan Teodoro</h4>
                          </a>
                          <p className="text-muted">&bull;</p>
                          <p className="text-muted">5 hours ago</p>
                        </div>
                        <div className="time">
                          <p className="text-muted profile_username">@denielle</p>
                        </div>
                      </div>
                      <p>
                        <span className="edit" data-edit-id="102">
                          <span className="options"></span>
                        </span>
                      </p>
                    </div>
                    <div className="photo">
                      <div style={{ padding: 0 }}>
                        <p>Cozy Coding Setup 💻☕</p>
                        <h1>Updated my workspace with some new mechanical keycaps and ambient desk lighting. Productivity has officially doubled!</h1>
                      </div>
                      <div className="facebook-post">
                        <div className="see-more">
                          <i className="fa-regular fa-eye"></i>
                          <p>See more</p>
                        </div>
                        <div className="image-grid single-image">
                          <img className="photo-post" src="/assets/testImages/IMG_20240515_004422.jpg" loading="lazy" alt="" />
                        </div>
                      </div>
                      <div className="reactions">
                        <div>
                          <i data-like-id="102" className="like fa-regular fa-heart"></i>
                          <h1>85</h1>
                        </div>
                        <div>
                          <i data-comment-id="102" className="comment fa-regular fa-comment-dots"></i>
                          <h1>0</h1>
                        </div>
                        <div>
                          <i data-bookmark-id="102" className="bookmark fa-regular fa-bookmark"></i>
                          <h1>0</h1>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Post 3 */}
              <div className="posts">
                <div className="feed-header">
                  <div className="dp-container">
                    <div className="profile-picture">
                      <img className="myProfilePic user-dp" src="/assets/images/dp/avatar-3.png" alt="" loading="lazy" />
                    </div>
                  </div>
                  <div className="poster-container-info">
                    <div className="feed-header-container">
                      <div className="poster-infos">
                        <div className="name">
                          <a href="#" className="profile-link">
                            <h4 className="profile_name">Juan Teodoro</h4>
                          </a>
                          <p className="text-muted">&bull;</p>
                          <p className="text-muted">1 day ago</p>
                        </div>
                        <div className="time">
                          <p className="text-muted profile_username">@denielle</p>
                        </div>
                      </div>
                      <p>
                        <span className="edit" data-edit-id="103">
                          <span className="options"></span>
                        </span>
                      </p>
                    </div>
                    <div className="photo">
                      <div style={{ padding: 0 }}>
                        <p>UI Design Updates! 🚀</p>
                        <h1>Just finished designing the new user profile dashboard! The clean aesthetics and unified color palette feel so premium. What do you all think?</h1>
                      </div>
                      <div className="reactions">
                        <div>
                          <i data-like-id="103" className="like fa-regular fa-heart"></i>
                          <h1>42</h1>
                        </div>
                        <div>
                          <i data-comment-id="103" className="comment fa-regular fa-comment-dots"></i>
                          <h1>3</h1>
                        </div>
                        <div>
                          <i data-bookmark-id="103" className="bookmark fa-regular fa-bookmark"></i>
                          <h1>0</h1>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Post 4 */}
              <div className="posts">
                <div className="feed-header">
                  <div className="dp-container">
                    <div className="profile-picture">
                      <img className="myProfilePic user-dp" src="/assets/images/dp/avatar-men.png" alt="" loading="lazy" />
                    </div>
                  </div>
                  <div className="poster-container-info">
                    <div className="feed-header-container">
                      <div className="poster-infos">
                        <div className="name">
                          <a href="#" className="profile-link">
                            <h4 className="profile_name">Juan Teodoro</h4>
                          </a>
                          <p className="text-muted">&bull;</p>
                          <p className="text-muted">2 days ago</p>
                        </div>
                        <div className="time">
                          <p className="text-muted profile_username">@denielle</p>
                        </div>
                      </div>
                      <p>
                        <span className="edit" data-edit-id="104">
                          <span className="options"></span>
                        </span>
                      </p>
                    </div>
                    <div className="photo">
                      <div style={{ padding: 0 }}>
                        <p>Nature walk photography 🌸✨</p>
                        <h1>A beautiful morning walk capture! Nature never fails to amaze.</h1>
                      </div>
                      <div className="facebook-post">
                        <div className="see-more">
                          <i className="fa-regular fa-eye"></i>
                          <p>See more</p>
                        </div>
                        <div className="image-grid single-image">
                          <img className="photo-post" src="/assets/testImages/2785e4160c717d329d7770799f68ff3a.jpg" loading="lazy" alt="" />
                        </div>
                      </div>
                      <div className="reactions">
                        <div>
                          <i data-like-id="104" className="like fa-regular fa-heart"></i>
                          <h1>95</h1>
                        </div>
                        <div>
                          <i data-comment-id="104" className="comment fa-regular fa-comment-dots"></i>
                          <h1>2</h1>
                        </div>
                        <div>
                          <i data-bookmark-id="104" className="bookmark fa-regular fa-bookmark"></i>
                          <h1>0</h1>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Post 5 */}
              <div className="posts">
                <div className="feed-header">
                  <div className="dp-container">
                    <div className="profile-picture">
                      <img className="myProfilePic user-dp" src="/assets/images/dp/avatar-3.png" alt="" loading="lazy" />
                    </div>
                  </div>
                  <div className="poster-container-info">
                    <div className="feed-header-container">
                      <div className="poster-infos">
                        <div className="name">
                          <a href="#" className="profile-link">
                            <h4 className="profile_name">Juan Teodoro</h4>
                          </a>
                          <p className="text-muted">&bull;</p>
                          <p className="text-muted">3 days ago</p>
                        </div>
                        <div className="time">
                          <p className="text-muted profile_username">@denielle</p>
                        </div>
                      </div>
                      <p>
                        <span className="edit" data-edit-id="105">
                          <span className="options"></span>
                        </span>
                      </p>
                    </div>
                    <div className="photo">
                      <div style={{ padding: 0 }}>
                        <p>Engineering Thoughts ⚡</p>
                        <h1>Scaling frontend applications requires a solid balance of clean component architecture and reusable styled-systems. Tailwind CSS v4 is a game changer!</h1>
                      </div>
                      <div className="reactions">
                        <div>
                          <i data-like-id="105" className="like fa-regular fa-heart"></i>
                          <h1>156</h1>
                        </div>
                        <div>
                          <i data-comment-id="105" className="comment fa-regular fa-comment-dots"></i>
                          <h1>8</h1>
                        </div>
                        <div>
                          <i data-bookmark-id="105" className="bookmark fa-regular fa-bookmark"></i>
                          <h1>0</h1>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── COMMENT SECTION MODAL ── */}
            <div className="comment-section invisible fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center transition-all">
              <div className="card bg-[var(--eerie-black)] border border-[var(--jet)] w-[90%] max-w-lg rounded-2xl p-6 shadow-2xl scale-110 opacity-0 transition-all duration-300">
                <div className="comment-header flex justify-between items-center border-b border-[var(--jet)] pb-4 mb-4">
                  <h3 className="text-lg font-bold text-white">Comments</h3>
                  <button id="closeCommentModal" className="text-[var(--light-gray)] hover:text-white font-bold bg-transparent border-none cursor-pointer text-base">✕</button>
                </div>

                <div id="commentContainer" className="comment-container max-h-[300px] overflow-y-auto flex flex-col gap-4 mb-4"></div>

                <div className="comment-field flex items-center gap-3 border-t border-[var(--jet)] pt-4">
                  <div className="w-8 h-8 rounded-full overflow-hidden flex border border-white">
                    <img className="user-dp w-full h-full object-cover" src="/assets/gifs/loading.gif" alt="Current User" />
                  </div>
                  <input
                    id="setComment"
                    type="text"
                    placeholder="Add a comment..."
                    className="bg-[var(--smoky-black)] border border-[var(--jet)] rounded-full px-4 py-2 flex-1 text-sm text-[var(--light-gray)] outline-none focus:border-[var(--gradient-yellow)]"
                  />
                  <button className="send-message text-[var(--gradient-yellow)] bg-transparent border-none cursor-pointer p-1 text-base">
                    <i className="fa-regular fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </div>

          </section>
        </section>
      </main>
    </div>
  );
};

export default ProfilePage;
