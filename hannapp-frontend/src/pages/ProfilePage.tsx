import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header, { formatDpUrl } from '../components/Header';
import CommentModal from '../components/CommentModal';
import { loadFromLocalStorage } from '../utils/cryptoUtils';
import { timeConversion } from '../utils/timeConverter';
import './ProfilePage.css';

interface ProfilePost {
  post_id: number;
  full_name: string;
  username: string;
  profile_picture: string;
  postAt: string;
  caption: string;
  content: string;
  image?: string;
  likes: number;
  commentsCount?: number;
  id?: number;
}

interface UserProfile {
  username: string;
  first_name: string;
  last_name: string;
  dp: string;
  birthday?: string;
  gender?: string;
  bio?: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const profileId = searchParams.get('p') || '1'; // Default profile to view

  const [isDayMode, setIsDayMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'about'>('posts');

  // Auth and Profile details
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profileUser, setProfileUser] = useState<UserProfile | null>(null);
  const [isFriend, setIsFriend] = useState(false);

  // Profile Feed states
  const [posts, setPosts] = useState<ProfilePost[]>([]);
  const [page, setPage] = useState(1);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);

  // Interaction States
  const [likes, setLikes] = useState<Record<number | string, { count: number; liked: boolean }>>({});
  const [bookmarks, setBookmarks] = useState<Record<number | string, boolean>>({});

  // Comment Modal States
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | number | null>(null);

  // Cover photo repositioning
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [coverMode, setCoverMode] = useState<'idle' | 'editing' | 'saved'>('idle');
  const [imageOffsetY, setImageOffsetY] = useState(50);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const coverContainerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartOffset = useRef(50);

  // Load current user and profile data
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        let loggedIn = await loadFromLocalStorage("Hannah143", "user_data");
        if (!loggedIn) {
          loggedIn = {
            userId: 1,
            username: "@guest_user",
            first_name: "Guest",
            last_name: "Visitor",
            dp: "/assets/images/dp/avatar-men.png",
            birthday: "2004-07-20",
            gender: "Female"
          };
        }
        setCurrentUser(loggedIn);

        // Fetch profile user information from backend API
        const res = await fetch(`http://127.0.0.1:8000/api/fetch-post-profile/?userId=${profileId}&user=${loggedIn.userId}`);
        if (!res.ok) throw new Error('API offline');
        const data = await res.json();

        if (data.profile && data.profile[profileId]) {
          setProfileUser(data.profile[profileId]);
          setIsFriend(data.isFriend || false);
        } else {
          loadMockProfile();
        }
      } catch (e) {
        console.warn('API error, using mock profile details fallback...', e);
        loadMockProfile();
      }
    };

    const loadMockProfile = () => {
      // Mock profile fallback
      const mockProfiles: Record<string, UserProfile> = {
        '101': {
          first_name: 'Hannah',
          last_name: 'Watson',
          username: '@hannah_w',
          dp: '/assets/images/dp/avatar-3.png',
          birthday: '2004-07-20',
          gender: 'Female',
          bio: 'Masbate mountaineer and adventure seeker 🌲🏔️'
        },
        '102': {
          first_name: 'Liam',
          last_name: 'Bennett',
          username: '@liam_b',
          dp: '/assets/images/dp/avatar-men.png',
          birthday: '1999-05-15',
          gender: 'Male',
          bio: 'Full Stack Engineer | Mechanically Inclined 💻☕'
        }
      };

      const selected = mockProfiles[profileId] || {
        first_name: 'Juan',
        last_name: 'Teodoro',
        username: '@denielle',
        dp: '/assets/images/dp/avatar-3.png',
        birthday: '2004-07-20',
        gender: 'Female',
        bio: 'Frontend enthusiast. HannApp architect.'
      };

      setProfileUser(selected);
      setIsFriend(true);
    };

    loadProfileData();
    setPage(1);
    setPosts([]);
  }, [profileId]);

  // Fetch User Posts on Profile
  const fetchProfilePosts = async (currentPage: number) => {
    if (isLoadingPosts) return;
    setIsLoadingPosts(true);

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/fetch-post-profile/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: profileId, page: currentPage }),
      });

      if (!res.ok) throw new Error('API failed');
      const data = await res.json();

      if (data.posts && data.posts.length > 0) {
        const mapped: ProfilePost[] = data.posts.map((p: any) => ({
          post_id: p.post_id,
          full_name: p.full_name,
          username: p.username,
          profile_picture: p.profile_picture,
          postAt: p.postAt,
          caption: p.caption,
          content: p.content,
          image: p.image ? `http://127.0.0.1:8000/media/${p.image}` : undefined,
          likes: p.likes || 0,
          commentsCount: 0,
          id: p.id
        }));
        setPosts(prev => [...prev, ...mapped]);
        setPage(currentPage + 1);
      } else {
        if (currentPage === 1) {
          loadMockProfilePosts();
        }
      }
    } catch (e) {
      console.warn('API error listing profile posts, loading fallback mocks...', e);
      if (currentPage === 1) {
        loadMockProfilePosts();
      }
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const loadMockProfilePosts = () => {
    const mockPosts: Record<string, ProfilePost[]> = {
      '101': [
        {
          post_id: 101,
          full_name: "Hannah Watson",
          username: "@hannah_w",
          profile_picture: "/assets/images/dp/avatar-3.png",
          postAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          caption: "Serene escapes 🌲🏔️",
          content: "Spending the weekend in the mountains, disconnected from the noise. The fresh alpine air is exactly what I needed!",
          image: "/assets/testImages/2785e4160c717d329d7770799f68ff3a.jpg",
          likes: 124,
          commentsCount: 1,
          id: 101
        }
      ],
      '102': [
        {
          post_id: 102,
          full_name: "Liam Bennett",
          username: "@liam_b",
          profile_picture: "/assets/images/dp/avatar-men.png",
          postAt: new Date(Date.now() - 3600000 * 5).toISOString(),
          caption: "Cozy Coding Setup 💻☕",
          content: "Updated my workspace with some new mechanical keycaps and ambient desk lighting. Productivity has officially doubled!",
          image: "/assets/testImages/IMG_20240515_004422.jpg",
          likes: 85,
          commentsCount: 0,
          id: 102
        }
      ]
    };

    const selectedPosts = mockPosts[profileId] || [
      {
        post_id: 103,
        full_name: profileUser ? `${profileUser.first_name} ${profileUser.last_name}` : "Juan Teodoro",
        username: profileUser ? profileUser.username : "@denielle",
        profile_picture: profileUser ? profileUser.dp : "/assets/images/dp/avatar-3.png",
        postAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        caption: "UI Design Updates! 🚀",
        content: "Just finished designing the new user profile dashboard! The clean aesthetics and unified color palette feel so premium. What do you all think?",
        likes: 42,
        commentsCount: 3,
        id: 103
      },
      {
        post_id: 104,
        full_name: profileUser ? `${profileUser.first_name} ${profileUser.last_name}` : "Juan Teodoro",
        username: profileUser ? profileUser.username : "@denielle",
        profile_picture: profileUser ? profileUser.dp : "/assets/images/dp/avatar-men.png",
        postAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        caption: "Nature walk photography 🌸✨",
        content: "A beautiful morning walk capture! Nature never fails to amaze.",
        image: "/assets/testImages/2785e4160c717d329d7770799f68ff3a.jpg",
        likes: 95,
        commentsCount: 2,
        id: 104
      }
    ];

    setPosts(selectedPosts);
  };

  // Trigger posts load on profileUser load
  useEffect(() => {
    if (profileUser) {
      fetchProfilePosts(1);
    }
  }, [profileUser]);

  // Scroll pagination listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;

      if (scrollPosition >= pageHeight - 200) {
        fetchProfilePosts(page);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, isLoadingPosts]);

  // Cover photo change handlers
  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCoverPhoto(url);
    setImageOffsetY(50);
    setCoverMode('editing');
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
    const deltaPercent = (deltaY / containerH) * 100;
    const newOffset = Math.min(100, Math.max(0, dragStartOffset.current - deltaPercent));
    setImageOffsetY(newOffset);
  };

  const handleDragEnd = () => {
    isDragging.current = false;
  };

  // Interactions
  const toggleLike = (postId: number) => {
    setLikes(prev => {
      const current = prev[postId] || { count: posts.find(p => p.post_id === postId)?.likes || 0, liked: false };
      const liked = !current.liked;
      return {
        ...prev,
        [postId]: {
          count: liked ? current.count + 1 : Math.max(0, current.count - 1),
          liked
        }
      };
    });
  };

  const toggleBookmark = (postId: number) => {
    setBookmarks(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const isOwnProfile = currentUser && currentUser.userId?.toString() === profileId;
  const displayName = profileUser ? `${profileUser.first_name} ${profileUser.last_name}` : 'Loading...';
  const handleName = profileUser ? profileUser.username : '@loading';
  const displayDp = profileUser ? formatDpUrl(profileUser.dp) : '/assets/gifs/loading.gif';
  const formattedBirthday = profileUser?.birthday ? new Date(profileUser.birthday).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'July 20, 2004';
  const formattedGender = profileUser?.gender ? profileUser.gender : 'Female';

  return (
    <div className={`profile-page-wrapper bg-[#000000] min-h-screen w-full text-[var(--light-gray)] font-[var(--ff-poppins)] pt-[5rem] relative ${isDayMode ? 'day' : ''}`}>
      <Header isDayMode={isDayMode} setIsDayMode={setIsDayMode} currentUser={currentUser} />

      <main className="mx-auto max-w-[1000px] w-full flex flex-col pt-4 px-4 md:px-0">
        {/* ── HERO BANNER SECTION ── */}
        <section className="w-full relative">
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
            {coverPhoto && (
              <img
                src={coverPhoto}
                alt="Cover"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                style={{ objectPosition: `center ${imageOffsetY}%` }}
                draggable={false}
              />
            )}

            {coverMode === 'editing' && coverPhoto && (
              <div className="absolute inset-0 bg-black/20 pointer-events-none flex items-center justify-center">
                <span className="text-white text-xs font-semibold bg-black/50 px-3 py-1.5 rounded-full select-none">
                  <i className="fa-solid fa-up-down mr-1.5"></i>Drag to reposition
                </span>
              </div>
            )}

            {isOwnProfile && (
              <div
                className="absolute bottom-3 right-3 flex items-center gap-2 z-20"
                onPointerDown={(e) => e.stopPropagation()}
              >
                {coverMode === 'idle' || coverMode === 'saved' ? (
                  <button
                    onClick={() => coverFileInputRef.current?.click()}
                    className="flex items-center gap-2 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white text-xs font-semibold px-4 py-2 rounded-none border border-white/30 hover:border-white/60 transition-all cursor-pointer"
                  >
                    <i className="fa-solid fa-camera text-[11px]"></i>
                    {coverMode === 'saved' ? 'Change Cover Photo' : 'Add Cover Photo'}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setCoverMode('saved')}
                      className="flex items-center gap-2 bg-[#e89b15] hover:bg-[#d48c10] text-white text-xs font-semibold px-4 py-2 rounded-none border border-[#e89b15] transition-all cursor-pointer"
                    >
                      <i className="fa-solid fa-check text-[11px]"></i>
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setCoverPhoto(null);
                        setCoverMode('idle');
                      }}
                      className="flex items-center gap-2 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white text-xs font-semibold px-4 py-2 rounded-none border border-white/40 hover:border-white/70 transition-all cursor-pointer"
                    >
                      <i className="fa-solid fa-xmark text-[11px]"></i>
                      Cancel
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Overlapping Profile Info Container */}
          <div className="relative flex items-end pl-6 md:pl-10 -mt-[-20px] z-10 w-full gap-5">
            <div className="w-[150px] h-[150px] rounded-full border-[5px] border-white bg-[#000000] overflow-hidden flex items-center justify-center shrink-0 shadow-lg">
              <img
                className="profile-dp w-full h-full object-cover"
                src={displayDp}
                alt="Profile Avatar"
              />
            </div>

            <div className="flex flex-col flex-1 pb-2">
              <h1 className="profile_name text-[22px] font-bold text-white tracking-wide leading-tight">{displayName}</h1>
              <p className="profile_username text-[#888888] font-normal text-sm mt-0.5">{handleName}</p>
              <p className="text-sm text-white font-normal mt-2">{profileUser?.bio || "Bio here"}</p>

              {!isOwnProfile && (
                <div className="top-buttons flex items-center gap-3 mt-3.5" style={{ display: 'flex' }}>
                  <button
                    id="addFriend"
                    className="bg-[#e89b15] hover:bg-[#d48c10] text-white font-semibold px-8 py-3 rounded-none text-[13px] tracking-wide transition-all border border-[#e89b15] cursor-pointer"
                  >
                    {isFriend ? 'Friends' : 'Add Friend'}
                  </button>
                  <button
                    id="sendMessage"
                    className="bg-transparent border border-white hover:bg-white/10 text-white font-semibold px-8 py-3 rounded-none text-[13px] tracking-wide transition-all cursor-pointer"
                  >
                    Message
                  </button>
                </div>
              )}
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
                      className={`nav-link text-xs transition-all cursor-pointer bg-transparent border-none p-0 outline-none font-semibold ${activeTab === 'posts' ? 'text-[#e89b15] active' : 'text-[#888888]'}`}
                      onClick={() => setActiveTab('posts')}
                    >
                      Post
                    </button>
                  </li>
                  <li>
                    <button
                      className="nav-link text-[#888888] hover:text-white font-semibold text-xs transition-all cursor-pointer bg-transparent border-none p-0 outline-none"
                      onClick={(e) => e.preventDefault()}
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
          </header>

          {/* ── TWO-COLUMN GRID CONTENT ── */}
          <section className="nav-cont py-6 grid grid-cols-1 md:grid-cols-10 gap-6 items-start w-full">
            {/* LEFT COLUMN: About & Featured Info */}
            <div id="about" className="flex flex-col gap-6 md:col-span-4 bg-transparent p-0 border-none shadow-none">
              <div className="w-full">
                <h3 className="text-[25px] font-bold text-white mb-4">About</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-xs">
                    <i className="fa-solid fa-house text-white text-sm w-4 text-center shrink-0"></i>
                    <span className="text-[#a0a0a0]">Bititong, Masbate, Phililppines</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <i className="fa-solid fa-location-dot text-white text-sm w-4 text-center shrink-0"></i>
                    <span className="text-[#a0a0a0]">Kinamaligan, Masbate, Phililppines</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <i className="fa-solid fa-cake-candles text-white text-sm w-4 text-center shrink-0"></i>
                    <span className="text-[#a0a0a0]">Born on: {formattedBirthday}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <i className="fa-solid fa-venus-mars text-white text-sm w-4 text-center shrink-0"></i>
                    <span className="text-[#a0a0a0]">Gender: {formattedGender}</span>
                  </div>
                </div>
              </div>

              <div className="w-full mt-2">
                <h3 className="text-[25px] font-bold text-white mb-4">Featured</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className="aspect-square bg-[#1c1c1e] rounded-[4px] border-none transition-all cursor-pointer"></div>
                  <div className="aspect-square bg-[#1c1c1e] rounded-[4px] border-none transition-all cursor-pointer"></div>
                  <div className="aspect-square bg-[#1c1c1e] rounded-[4px] border-none transition-all cursor-pointer"></div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Posts Feed */}
            {activeTab === 'posts' && (
              <div id="post" className="flex flex-col gap-0 md:col-span-6 w-full">
                {posts.map((post) => {
                  const hasLiked = likes[post.post_id]?.liked ?? false;
                  const likesCount = likes[post.post_id]?.count ?? post.likes;
                  const hasBookmarked = bookmarks[post.post_id] ?? false;

                  return (
                    <div key={post.post_id} className="posts">
                      <div className="feed-header">
                        <div className="dp-container">
                          <div className="profile-picture">
                            <img className="myProfilePic user-dp" src={displayDp} alt="" loading="lazy" />
                          </div>
                        </div>
                        <div className="poster-container-info">
                          <div className="feed-header-container">
                            <div className="poster-infos">
                              <div className="name">
                                <a href="#" onClick={(e) => e.preventDefault()} className="profile-link">
                                  <h4 className="profile_name">{displayName}</h4>
                                </a>
                                <p className="text-muted">&bull;</p>
                                <p className="text-muted">{timeConversion(post.postAt)}</p>
                              </div>
                              <div className="time">
                                <p className="text-muted profile_username">{handleName}</p>
                              </div>
                            </div>
                            <p>
                              <span className="edit">
                                <span className="options"></span>
                              </span>
                            </p>
                          </div>
                          <div className="photo">
                            <div style={{ padding: 0 }}>
                              <p>{post.caption}</p>
                              <h1>{post.content}</h1>
                            </div>

                            {post.image && (
                              <div className="facebook-post">
                                <div className="see-more">
                                  <i className="fa-regular fa-eye"></i>
                                  <p>See more</p>
                                </div>
                                <div className="image-grid single-image">
                                  <img className="photo-post" src={post.image} loading="lazy" alt="" />
                                </div>
                              </div>
                            )}

                            <div className="reactions">
                              <div onClick={() => toggleLike(post.post_id)}>
                                <i
                                  className={`like cursor-pointer ${hasLiked ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}`}
                                  style={{ color: hasLiked ? 'crimson' : '' }}
                                ></i>
                                <h1>{likesCount}</h1>
                              </div>
                              <div
                                onClick={() => {
                                  setActiveCommentPostId(post.post_id);
                                  setCommentModalOpen(true);
                                }}
                              >
                                <i className="comment fa-regular fa-comment-dots cursor-pointer"></i>
                                <h1>{post.commentsCount ?? 0}</h1>
                              </div>
                              <div onClick={() => toggleBookmark(post.post_id)}>
                                <i
                                  className={`bookmark cursor-pointer ${hasBookmarked ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark'}`}
                                  style={{ color: hasBookmarked ? 'gold' : '' }}
                                ></i>
                                <h1>0</h1>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </section>
      </main>

      {/* ── COMMENT SECTION MODAL ── */}
      <CommentModal
        isDayMode={isDayMode}
        isOpen={commentModalOpen}
        postId={activeCommentPostId}
        userId={currentUser?.userId}
        onClose={() => {
          setCommentModalOpen(false);
          setActiveCommentPostId(null);
        }}
      />
    </div>
  );
};

export default ProfilePage;
