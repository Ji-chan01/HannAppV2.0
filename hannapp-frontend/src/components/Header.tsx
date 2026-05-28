import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MessageChatWindow from './MessageChatWindow';
import type { Contact, OpenChat, ChatMessage } from './MessageChatWindow';
import { loadFromLocalStorage } from '../utils/cryptoUtils';

interface HeaderProps {
  isDayMode: boolean;
  setIsDayMode: (val: boolean) => void;
  currentUser?: {
    userId: number;
    username: string;
    first_name: string;
    last_name: string;
    dp: string;
  };
}

interface SearchUser {
  id: number;
  name: string;
  username: string;
  dp: string;
}

const MOCK_MESSAGES: Contact[] = [
  {
    id: 1,
    name: 'Alice Reyes',
    lastMessage: 'Hey! Did you see the new post? 😄',
    time: '2m ago',
    unread: 3,
    online: true,
  },
  {
    id: 2,
    name: 'Ben Cruz',
    lastMessage: 'Thanks for following me!',
    time: '15m ago',
    unread: 1,
    online: false,
  },
  {
    id: 3,
    name: 'Carla Lim',
    lastMessage: "Sure, let's catch up soon.",
    time: '1h ago',
    unread: 0,
    online: true,
  },
  {
    id: 4,
    name: 'Diego Santos',
    lastMessage: 'Nice photo! Where was that taken?',
    time: '3h ago',
    unread: 0,
    online: false,
  },
];

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function formatDpUrl(url?: string): string {
  if (!url) return '/assets/images/dp/avatar-men.png';
  if (url.startsWith('http') || url.startsWith('/assets/')) {
    return url;
  }
  if (url.startsWith('/media/')) {
    return `http://127.0.0.1:8000${url}`;
  }
  if (url.startsWith('/')) {
    return `http://127.0.0.1:8000${url}`;
  }
  return `http://127.0.0.1:8000/media/${url}`;
}

const Header: React.FC<HeaderProps> = ({ isDayMode, setIsDayMode, currentUser }) => {
  const navigate = useNavigate();
  const [showMsgList, setShowMsgList] = useState(false);
  const [openChats, setOpenChats] = useState<OpenChat[]>([]);
  const msgBtnRef = useRef<HTMLAnchorElement>(null);
  const msgListRef = useRef<HTMLDivElement>(null);

  // Profile and Search states
  const [user, setUser] = useState<any>(currentUser || null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Load user data if not passed as prop
  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
      return;
    }
    const loadUser = async () => {
      try {
        const data = await loadFromLocalStorage('Hannah143', 'user_data');
        if (data) {
          setUser(data);
        }
      } catch (err) {
        console.error('Failed to load user data in Header', err);
      }
    };
    loadUser();
  }, [currentUser]);

  // Click outside handlers
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      // Message list popup outside click
      if (
        msgListRef.current &&
        !msgListRef.current.contains(e.target as Node) &&
        msgBtnRef.current &&
        !msgBtnRef.current.contains(e.target as Node)
      ) {
        setShowMsgList(false);
      }

      // Profile modal dropdown outside click
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }

      // Search results container outside click
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchActive(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search fetching
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      try {
        const userId = user?.userId || 1;
        const res = await fetch(`http://127.0.0.1:8000/api/search-users/?q=${encodeURIComponent(searchQuery)}&userId=${userId}`);
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        if (data.friends) {
          setSearchResults(data.friends);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error('Error searching users:', err);
      }
    };

    const timer = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, user]);

  const handleLogout = () => {
    localStorage.removeItem('user_data');
    localStorage.removeItem('profile');
    navigate('/login');
  };

  const totalUnread = MOCK_MESSAGES.reduce((sum, m) => sum + m.unread, 0);

  function openChat(contact: Contact) {
    setShowMsgList(false);
    if (openChats.find((c) => c.contact.id === contact.id)) return;
    setOpenChats((prev) => [
      ...prev,
      {
        contact,
        messages: [
          {
            id: 1,
            text: contact.lastMessage,
            sent: false,
            time: contact.time,
          } as ChatMessage,
        ],
        input: '',
      },
    ]);
  }

  function closeChat(contactId: number) {
    setOpenChats((prev) => prev.filter((c) => c.contact.id !== contactId));
  }

  function sendMessage(contactId: number) {
    setOpenChats((prev) =>
      prev.map((chat) => {
        if (chat.contact.id !== contactId || !chat.input.trim()) return chat;
        return {
          ...chat,
          messages: [
            ...chat.messages,
            {
              id: Date.now(),
              text: chat.input.trim(),
              sent: true,
              time: 'Just now',
            } as ChatMessage,
          ],
          input: '',
        };
      })
    );
  }

  function updateInput(contactId: number, value: string) {
    setOpenChats((prev) =>
      prev.map((chat) =>
        chat.contact.id === contactId ? { ...chat, input: value } : chat
      )
    );
  }

  const userDisplayName = user ? `${user.first_name} ${user.last_name}` : 'Loading...';
  const userHandle = user ? user.username : '@loading';
  const userDp = user ? formatDpUrl(user.dp) : '/assets/gifs/loading.gif';

  return (
    <>
      <header className="header">
        <div className="left-section">
          <a
            id="logo"
            href="/home"
            onClick={(e) => {
              e.preventDefault();
              localStorage.removeItem('profile');
              navigate('/home');
            }}
          >
            <h1>
              HannApp
              <div className="aurora">
                <div className="aurora__item"> </div>
                <div className="aurora__item"> </div>
                <div className="aurora__item"> </div>
                <div className="aurora__item"> </div>
              </div>
            </h1>
          </a>

          <div className="search-bar" ref={searchRef}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              id="searchUsers"
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchActive(true);
              }}
              onFocus={() => setIsSearchActive(true)}
            />
            {isSearchActive && searchQuery && (
              <div className="searched-items-cont active">
                {searchResults.length > 0 ? (
                  searchResults.map((su) => (
                    <div
                      key={su.id}
                      className="searched-item"
                      onClick={() => {
                        setSearchQuery('');
                        setIsSearchActive(false);
                        navigate(`/profile?p=${su.id}`);
                      }}
                    >
                      <div className="profile-picture">
                        <img className="myProfilePic" src={formatDpUrl(su.dp)} alt={su.name} />
                      </div>
                      <div className="search_names">
                        <h4 className="name_username">{su.name}</h4>
                        <p className="text-muted">{su.username}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="searched-item text-muted text-xs p-3">No matching profiles found</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="right-section">
          <div className="menu-items">
            <a
              href="/home"
              className="menu-item"
              onClick={(e) => {
                e.preventDefault();
                navigate('/home');
              }}
            >
              <span>
                <i className="fa-solid fa-house"></i>
              </span>
              <h6>Home</h6>
            </a>

            {/* Messages Button */}
            <a
              href="#"
              className="menu-item msg-btn-anchor"
              ref={msgBtnRef}
              onClick={(e) => {
                e.preventDefault();
                setShowMsgList((v) => !v);
              }}
              title="Messages"
            >
              <span className="msg-icon-wrap">
                <i className="fa-solid fa-message"></i>
                {totalUnread > 0 && (
                  <span className="msg-badge">{totalUnread}</span>
                )}
              </span>
            </a>

            <a
              href="#"
              className="menu-item"
              onClick={(e) => e.preventDefault()}
            >
              <span>
                <i className="fa-regular fa-bookmark"></i>
              </span>
            </a>
            <a
              href="#"
              className="menu-item"
              onClick={(e) => e.preventDefault()}
            >
              <span>
                <i className="fa-solid fa-bell"></i>
              </span>
            </a>
          </div>

          <div
            className="profile-dropdown"
            ref={profileRef}
            onClick={() => setIsProfileOpen((v) => !v)}
          >
            <div className="profile-picture">
              <img
                className="myProfilePic user-dp"
                src={userDp}
                alt=""
              />
            </div>
            <p className="profile_name user_name">{userDisplayName}</p>
            <i className="fa-solid fa-sort-down"></i>

            {/* Profile Dropdown Modal */}
            {isProfileOpen && (
              <div
                className="profile-modal active"
                onClick={(e) => e.stopPropagation()}
              >
                <a
                  href="/profile"
                  className="profile"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsProfileOpen(false);
                    navigate(`/profile?p=${user?.userId || 1}`);
                  }}
                >
                  <div className="profile-picture">
                    <img className="myProfilePic user-dp" src={userDp} alt="" />
                  </div>
                  <div className="handle">
                    <h4 className="profile_name">{userDisplayName}</h4>
                    <p className="user_name text-muted">{userHandle}</p>
                  </div>
                </a>
                <div>
                  <a
                    href="/settings?entry_point=account_settings"
                    className="menu-item"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsProfileOpen(false);
                      navigate('/settings?entry_point=account_settings');
                    }}
                  >
                    <span><i className="fa-solid fa-wrench"></i></span>
                    <h3>Account Settings</h3>
                  </a>
                  <div id="logout_btn" className="menu-item" onClick={handleLogout}>
                    <span><i className="fa-solid fa-right-from-bracket"></i></span>
                    <h3>Log Out</h3>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Message List Popup */}
        {showMsgList && (
          <div className="msg-list-popup" ref={msgListRef}>
            <div className="msg-list-header">
              <h4>Messages</h4>
              <button className="msg-list-new-btn" title="New Message">
                <i className="fa-solid fa-pen-to-square"></i>
              </button>
            </div>
            <div className="msg-list-body">
              {MOCK_MESSAGES.map((msg) => (
                <div
                  key={msg.id}
                  className={`msg-list-item${msg.unread > 0 ? ' unread' : ''}`}
                  onClick={() => openChat(msg)}
                >
                  <div className="msg-list-avatar">
                    <div className="msg-avatar-initials">
                      {getInitials(msg.name)}
                    </div>
                    {msg.online && <span className="msg-online-dot"></span>}
                  </div>
                  <div className="msg-list-info">
                    <div className="msg-list-name">{msg.name}</div>
                    <div className="msg-list-preview">{msg.lastMessage}</div>
                  </div>
                  <div className="msg-list-meta">
                    <span className="msg-list-time">{msg.time}</span>
                    {msg.unread > 0 && (
                      <span className="msg-unread-count">{msg.unread}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Chat windows rendered via portal — escapes header's stacking context */}
      <MessageChatWindow
        openChats={openChats}
        onClose={closeChat}
        onSend={sendMessage}
        onInputChange={updateInput}
      />
    </>
  );
};

export default Header;
