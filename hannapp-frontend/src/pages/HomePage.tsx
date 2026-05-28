import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header, { formatDpUrl } from '../components/Header';
import CommentModal from '../components/CommentModal';
import StoryModal from '../components/StoryModal';
import type { Story } from '../components/StoryModal';
import HomeLeftSidebar from '../components/HomeLeftSidebar';
import HomeRightSidebar from '../components/HomeRightSidebar';
import { loadFromLocalStorage } from '../utils/cryptoUtils';
import { timeConversion } from '../utils/timeConverter';
import './HomePage.css';

interface Post {
  post_id: number;
  full_name: string;
  username: string;
  profile_picture: string;
  postAt: string;
  caption: string;
  content: string;
  image?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  likes: number;
  commentsCount?: number;
  id?: number; // poster's user ID for profile links
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isDayMode, setIsDayMode] = useState(false);

  // Auth/User state
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Feed/Post States
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [allPostsFetched, setAllPostsFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Interaction States
  const [likes, setLikes] = useState<Record<number | string, { count: number; liked: boolean }>>({});
  const [bookmarks, setBookmarks] = useState<Record<number | string, boolean>>({});

  // Comment Modal States
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | number | null>(null);

  // Creating post form states
  const [caption, setCaption] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [warningMsg, setWarningMsg] = useState('');

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

  // Load user
  useEffect(() => {
    document.title = "HannApp";

    const loadUser = async () => {
      try {
        let user_data = await loadFromLocalStorage("Hannah143", "user_data");
        if (!user_data) {
          user_data = {
            userId: 1,
            username: "@guest_user",
            first_name: "Guest",
            last_name: "Visitor",
            dp: "/assets/images/dp/avatar-men.png"
          };
        }
        setCurrentUser(user_data);
      } catch (err) {
        console.error('Failed loading user info:', err);
      }
    };

    loadUser();
  }, []);

  // Fetch posts API helper
  const fetchPosts = async (currentPage: number) => {
    if (isLoading || allPostsFetched) return;
    setIsLoading(true);

    try {
      const activeUserId = currentUser?.userId || 1;
      const res = await fetch(`http://127.0.0.1:8000/api/fetch-post/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: activeUserId, page: currentPage })
      });

      if (!res.ok) throw new Error("API failed");
      const jsonData = await res.json();

      if (jsonData.posts && jsonData.posts.length > 0) {
        const mapped: Post[] = jsonData.posts.map((p: any) => ({
          post_id: p.post_id,
          full_name: p.full_name,
          username: p.username,
          profile_picture: p.profile_picture,
          postAt: p.postAt,
          caption: p.caption,
          content: p.content,
          image: p.image ? `http://127.0.0.1:8000/media/${p.image}` : undefined,
          image2: p.image2 ? `http://127.0.0.1:8000/media/${p.image2}` : undefined,
          image3: p.image3 ? `http://127.0.0.1:8000/media/${p.image3}` : undefined,
          image4: p.image4 ? `http://127.0.0.1:8000/media/${p.image4}` : undefined,
          likes: p.likes || 0,
          commentsCount: 0,
          id: p.id
        }));

        setPosts(prev => [...prev, ...mapped]);
        setPage(currentPage + 1);
      } else {
        if (currentPage === 1) {
          loadMockPosts();
        } else {
          setAllPostsFetched(true);
        }
      }
    } catch (error) {
      console.warn("Backend API offline. Loading sample mock posts fallback...", error);
      if (currentPage === 1) {
        loadMockPosts();
      } else {
        setAllPostsFetched(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadMockPosts = () => {
    const samplePosts: Post[] = [
      {
        post_id: 101,
        full_name: "John Watson",
        username: "@hannah_w",
        profile_picture: "/assets/images/dp/avatar-3.png",
        postAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        caption: "Serene escapes 🌲🏔️",
        content: "Spending the weekend in the mountains, disconnected from the noise. The fresh alpine air is exactly what I needed!",
        image: "/assets/testImages/2785e4160c717d329d7770799f68ff3a.jpg",
        likes: 124,
        commentsCount: 1,
        id: 101
      },
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
    ];
    setPosts(samplePosts);
    setAllPostsFetched(true);
  };

  // Trigger initial fetch when currentUser loads
  useEffect(() => {
    if (currentUser) {
      fetchPosts(1);
    }
  }, [currentUser]);

  // Infinite Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;

      if (scrollPosition >= pageHeight - 200) {
        fetchPosts(page);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, isLoading, allPostsFetched]);

  // Post Submission
  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!caption.trim() && selectedFiles.length === 0) {
      setWarningMsg("You need to enter input first!");
      setTimeout(() => setWarningMsg(''), 3000);
      return;
    }

    const formData = new FormData();
    formData.append('userId', currentUser.userId);
    formData.append('caption_content', caption);
    formData.append('page', page.toString());

    selectedFiles.forEach((file, index) => {
      formData.append(`image${index + 1}`, file);
    });

    try {
      const res = await fetch("http://127.0.0.1:8000/api/create-post/", {
        method: "POST",
        body: formData
      });

      if (!res.ok) throw new Error("POST failed");
      const data = await res.json();

      if (data.success && data.post) {
        // Prepend new post
        const p = data.post;
        const newPost: Post = {
          post_id: p.post_id,
          full_name: p.full_name || `${currentUser.first_name} ${currentUser.last_name}`,
          username: p.username || currentUser.username,
          profile_picture: p.profile_picture || currentUser.dp,
          postAt: p.postAt || new Date().toISOString(),
          caption: p.caption || caption,
          content: p.content || '',
          image: p.image ? `http://127.0.0.1:8000/media/${p.image}` : undefined,
          image2: p.image2 ? `http://127.0.0.1:8000/media/${p.image2}` : undefined,
          image3: p.image3 ? `http://127.0.0.1:8000/media/${p.image3}` : undefined,
          image4: p.image4 ? `http://127.0.0.1:8000/media/${p.image4}` : undefined,
          likes: p.likes || 0,
          commentsCount: 0,
          id: currentUser.userId
        };
        setPosts(prev => [newPost, ...prev]);
      } else {
        // Fallback simulated success
        simulateNewPostAddition();
      }

      // Reset form
      setCaption('');
      setSelectedFiles([]);
      setFilePreviews([]);
    } catch (err) {
      console.warn("POST failed, simulating new post locally...", err);
      simulateNewPostAddition();
    }
  };

  const simulateNewPostAddition = () => {
    const newPost: Post = {
      post_id: Date.now(),
      full_name: `${currentUser.first_name} ${currentUser.last_name}`,
      username: currentUser.username,
      profile_picture: currentUser.dp,
      postAt: new Date().toISOString(),
      caption: caption,
      content: '',
      image: filePreviews[0] || undefined,
      image2: filePreviews[1] || undefined,
      image3: filePreviews[2] || undefined,
      image4: filePreviews[3] || undefined,
      likes: 0,
      commentsCount: 0,
      id: currentUser.userId
    };
    setPosts(prev => [newPost, ...prev]);
    setCaption('');
    setSelectedFiles([]);
    setFilePreviews([]);
  };

  // Image Upload Handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (selectedFiles.length + files.length > 4) {
      setErrorMsg("You've reached the maximum number of images allowed.");
      setTimeout(() => setErrorMsg(''), 7000);
      return;
    }
    const newFiles = [...selectedFiles, ...files].slice(0, 4);
    setSelectedFiles(newFiles);
    setFilePreviews(newFiles.map(file => URL.createObjectURL(file)));
  };

  const removeFile = (idx: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== idx);
    setSelectedFiles(newFiles);
    setFilePreviews(newFiles.map(file => URL.createObjectURL(file)));
  };

  // Interaction handlers
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

  /* ─── Pagination helpers ──────────────────────────── */
  const openStory = (i: number) => { setStoryIndex(i); setStoryOpen(true); };
  const totalStories = STORIES.length;
  const pageStart = storiesPage * (STORIES_PER_PAGE - 1);
  const pageEnd = Math.min(pageStart + STORIES_PER_PAGE, totalStories);
  const visibleStories = STORIES.slice(pageStart, pageEnd);
  const hasNextPage = pageEnd < totalStories;
  const hasPrevPage = storiesPage > 0;

  const checkScroll = () => {
    if (storiesRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = storiesRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    if (!storiesRef.current) return;

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

  return (
    <div className={`home-page-wrapper bg-[var(--smoky-black)] pt-12 min-h-screen w-full text-[var(--light-gray)] font-[var(--ff-poppins)] relative transition-colors duration-200 ${isDayMode ? 'day bg-white text-black' : ''}`}>
      <Header isDayMode={isDayMode} setIsDayMode={setIsDayMode} currentUser={currentUser} />

      <main className="main-container flex p-8 px-6 w-full max-w-full gap-6">
        <HomeLeftSidebar currentUser={currentUser} />

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
              className="flex gap-3 pb-4 overflow-x-hidden max-w-full"
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

          <form id="postForm" onSubmit={handlePostSubmit} className="create-post w-full gap-2 p-[0.8rem_1rem] border border-[var(--jet)] flex relative" encType="multipart/form-data">
            <div className="dp-container flex-shrink-0">
              <div className="profile-picture w-12 h-12 rounded-full overflow-hidden flex border border-white">
                <img className="myProfilePic w-full h-full object-cover" src={currentUser ? formatDpUrl(currentUser.dp) : '/assets/gifs/loading.gif'} alt="" />
              </div>
            </div>

            <div className="inputs flex flex-col gap-2 w-full">
              <div className="upper-part border-b border-[var(--jet)] w-full flex relative">
                <input
                  id="createPost"
                  className="w-full bg-[var(--smoky-black)] text-[var(--light-gray)] border-none rounded-[0.5rem] p-4 outline-none placeholder-gray-500"
                  type="text"
                  placeholder={currentUser ? `What's on your mind, ${currentUser.first_name}?` : 'Loading webpage...'}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </div>

              {/* Upload Previews */}
              {filePreviews.length > 0 && (
                <div id="postImagesCont" className="post-images flex gap-2 h-max active">
                  {filePreviews.map((src, idx) => (
                    <div key={idx} className="post-image-cont relative active border-[1.3px] border-white h-20 w-20 overflow-hidden rounded-[0.5rem] shadow-[0_0_0.2rem_var(--light-gray)]">
                      <img className="post-img w-full h-full object-cover" style={{ background: 'white' }} src={src} alt="" />
                      <i onClick={() => removeFile(idx)} className="fa-regular fa-trash-can absolute right-1.5 top-1.5 text-white rounded-full bg-black/40 p-1.5 text-[11px] cursor-pointer hover:bg-black/60 active:bg-black/80"></i>
                    </div>
                  ))}
                </div>
              )}

              {errorMsg && <p className="error active show text-red-500 font-semibold text-xs pointer-events-none">{errorMsg}</p>}

              <div className="lower-part flex justify-between w-full relative items-center">
                <div className="file-uploads flex items-center gap-1.5">
                  <label htmlFor="pic-upload" className="label-upload-pic flex items-center justify-center border-none p-1.5 rounded-full cursor-pointer hover:bg-[var(--jet)] text-[var(--light-gray)] transition-colors">
                    <i className="fa-solid fa-image text-sm"></i>
                  </label>
                  <input id="pic-upload" className="hidden" type="file" accept="image/*" multiple onChange={handleFileChange} />

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
                {warningMsg && <p className="warning active absolute bottom-[-5px] text-red-500 text-xs font-semibold transition-opacity duration-200">{warningMsg}</p>}
              </div>
            </div>
          </form>

          {/* Dynamic Feed Post Cards */}
          <div className="feeds flex flex-col w-full" id="feeds">
            {posts.length > 0 ? (
              posts.map((post) => {
                const hasLiked = likes[post.post_id]?.liked ?? false;
                const likesCount = likes[post.post_id]?.count ?? post.likes;
                const hasBookmarked = bookmarks[post.post_id] ?? false;

                // Collect valid images for the post
                const imagesArr = [post.image, post.image2, post.image3, post.image4].filter(Boolean) as string[];
                const numImages = imagesArr.length;

                let layoutClass = 'single-image';
                if (numImages === 2) layoutClass = 'two-images';
                else if (numImages === 3) layoutClass = 'three-images';
                else if (numImages >= 4) layoutClass = 'four-images';

                return (
                  <div key={post.post_id} className="feed">
                    <div className="feed-header">
                      <div className="dp-container">
                        <div className="profile-picture">
                          <img src={formatDpUrl(post.profile_picture)} alt="" loading="lazy" />
                        </div>
                      </div>
                      <div className="poster-container-info">
                        <div className="feed-header-container">
                          <div className="poster-infos">
                            <div className="name">
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigate(`/profile?p=${post.id || post.post_id}`);
                                }}
                                className="profile-link"
                              >
                                <h4>{post.full_name}</h4>
                              </a>
                              <p className="text-muted">&bull;</p>
                              <p className="text-muted">{timeConversion(post.postAt)}</p>
                            </div>
                            <div className="time">
                              <p className="text-muted">{post.username}</p>
                            </div>
                          </div>
                          <p href="#">
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

                          {numImages > 0 && (
                            <div className="facebook-post">
                              <div className="see-more">
                                <i className="fa-regular fa-eye"></i>
                                <p>See more</p>
                              </div>
                              <div className={`image-grid ${layoutClass}`}>
                                {imagesArr.map((src, imgIdx) => (
                                  <img key={imgIdx} className="photo-post" src={src} loading="lazy" alt="" />
                                ))}
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
              })
            ) : (
              <div className="feed">
                <div className="noFriends text-center p-8">
                  <div className="text-header">
                    <h1>Your <span className="change">feed</span> is waiting!</h1>
                    <p className="mt-2 text-xs">Experience a vibrant feed filled with exciting updates.</p>
                  </div>
                  <a href="#" onClick={(e) => e.preventDefault()} className="mt-4 inline-block bg-[var(--gradient-yellow)] text-black px-6 py-2 rounded-full font-bold text-xs uppercase tracking-wider">Find Friends</a>
                </div>
              </div>
            )}
          </div>
        </section>

        <HomeRightSidebar userId={currentUser?.userId} />

        {/* ── CommentModal ───────────────────────── */}
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
      </main>
    </div>
  );
};

export default HomePage;
