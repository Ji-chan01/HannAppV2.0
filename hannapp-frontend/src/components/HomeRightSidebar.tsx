import React, { useState, useEffect } from 'react';
import { loadFromLocalStorage } from '../utils/cryptoUtils';
import { formatDpUrl } from './Header';

interface Friend {
  username: string;
  dp: string;
}

interface HomeRightSidebarProps {
  friends?: Friend[];
  userId?: number;
}

const FOOTER_LINKS = [
  'About Us', 'Terms and Services', 'Privacy Policy',
  'Hannah AI', 'Services', 'Privacy Center',
  'Developers', 'Terms', 'Help',
];

const HomeRightSidebar: React.FC<HomeRightSidebarProps> = ({ friends: initialFriends, userId }) => {
  const [friends, setFriends] = useState<Friend[]>(initialFriends || []);

  useEffect(() => {
    if (initialFriends) {
      setFriends(initialFriends);
      return;
    }

    const fetchFriends = async () => {
      let activeUserId = userId;
      if (!activeUserId) {
        try {
          const user_data = await loadFromLocalStorage('Hannah143', 'user_data');
          activeUserId = user_data?.userId || 1;
        } catch (e) {
          activeUserId = 1;
        }
      }

      try {
        const res = await fetch(`http://127.0.0.1:8000/api/friends/?userId=${activeUserId}`);
        if (!res.ok) throw new Error('API failed');
        const data = await res.json();
        if (data.friends && data.friends.length > 0) {
          setFriends(data.friends);
        } else {
          loadMockFriends();
        }
      } catch (e) {
        console.warn('API backend offline, loading mock friends...', e);
        loadMockFriends();
      }
    };

    const loadMockFriends = () => {
      const mockFriends = [
        { username: '@sophia_w', dp: '/assets/images/dp/avatar-3.png' },
        { username: '@daniel_k', dp: '/assets/images/dp/avatar-men.png' },
        { username: '@lily_rose', dp: '/assets/images/dp/avatar-3.png' },
        { username: '@ethan_dev', dp: '/assets/images/dp/avatar-men.png' }
      ];
      setFriends(mockFriends);
    };

    fetchFriends();
  }, [initialFriends, userId]);

  return (
    <aside className="right-sidebar flex-1 flex flex-col gap-6">
      {/* ── Following ──────────────────────────────────── */}
      <div className="following-container sticky top-[-2rem] flex flex-col gap-2">
        <h4 className="text-white font-bold px-2 text-xl">Online Friends</h4>
        <div className="line-separator w-[100%] align-self-center h-[1px] bg-[var(--jet)] mx-auto" />
        <div
          id="followingProfiles"
          className="following-profiles-cont overflow-y-auto h-[25rem] max-h-[25rem] flex flex-col gap-3 py-2"
        >
          {friends.map((friend, idx) => (
            <div key={idx} className="following-profile flex items-center justify-between p-2 rounded-xl hover:bg-[var(--jet)] transition-colors duration-150">
              <div className="left flex items-center gap-3">
                <div className="profile-picture w-10 h-10 rounded-full overflow-hidden border border-white">
                  <img
                    className="w-full h-full object-cover"
                    src={formatDpUrl(friend.dp)}
                    alt={friend.username}
                  />
                </div>
                <h6 className="text-white font-semibold text-sm">{friend.username}</h6>
              </div>
              <div className="active w-2.5 h-2.5 bg-green-500 rounded-full border border-[var(--smoky-black)]" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="footer sticky top-[29rem] bg-transparent border-none p-0 rounded-none flex flex-col">
        <ul className="additional-settings flex flex-row flex-wrap list-none gap-[0.7rem] gap-y-2 p-0 m-0">
          {FOOTER_LINKS.map((label) => (
            <li key={label}>
              <a
                href="#"
                className="ul-link text-gray-500 text-xs hover:underline"
                onClick={(e) => e.preventDefault()}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <div className="copyright mt-[25px] text-gray-500 text-[10px]">
          © 2024 HannApp
        </div>
      </footer>
    </aside>
  );
};

export default HomeRightSidebar;
