import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDpUrl } from './Header';

interface HomeLeftSidebarProps {
  /** Optionally highlight the active game card (e.g. 'tetris') */
  activeGame?: string;
  currentUser?: {
    userId: number;
    username: string;
    first_name: string;
    last_name: string;
    dp: string;
  };
}

const NAV_LINKS = [
  { icon: 'fa-solid fa-user-plus',    label: 'Friend Requests' },
  { icon: 'fa-solid fa-film',         label: 'Reels'           },
  { icon: 'fa-solid fa-bag-shopping', label: 'Shop'            },
  { icon: 'fa-solid fa-users',        label: 'Groups'          },
];

const HomeLeftSidebar: React.FC<HomeLeftSidebarProps> = ({ activeGame, currentUser }) => {
  const navigate = useNavigate();

  const userDisplayName = currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'Guest Visitor';
  const userHandle = currentUser ? currentUser.username : '@guest_user';
  const userDp = currentUser ? formatDpUrl(currentUser.dp) : '/assets/images/dp/avatar-men.png';

  return (
    <aside className="left-sidebar flex-[1.1] w-[40rem] flex flex-col gap-3 sticky top-12 max-h-max">

      {/* ── Profile Card ──────────────────────────────── */}
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); navigate(`/profile?p=${currentUser?.userId || 1}`); }}
        className="sidebar-profile-card flex items-center gap-3 bg-[var(--eerie-black)] shadow-[var(--box-shadow)] rounded-[16px] w-full p-3 hover:bg-[var(--jet)] transition-colors duration-150 group"
      >
        <div className="relative flex-shrink-0">
          <img
            className="myProfilePic rounded-full h-12 w-12 object-cover border-2 border-[var(--gradient-yellow)]/60 shadow-[var(--box-shadow)]"
            src={userDp}
            alt="Profile"
          />
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[var(--eerie-black)]" />
        </div>
        <div className="flex flex-col min-w-0">
          <span
            id="sidebarFullName"
            className="profile_name text-white text-sm font-semibold truncate leading-tight group-hover:text-[var(--orange-yellow-crayola)] transition-colors"
          >
            {userDisplayName}
          </span>
          <span className="user_name text-[var(--light-gray)] text-xs truncate">
            {userHandle}
          </span>
        </div>
        <i className="fa-solid fa-chevron-right text-[var(--light-gray)] text-xs ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
      </a>

      {/* ── Navigation Links ───────────────────────────── */}
      <nav className="flex flex-col w-full overflow-hidden border-t border-b border-[var(--jet)] py-4">
        {NAV_LINKS.map(({ icon, label }) => (
          <a
            key={label}
            href="#"
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

      {/* ── Games ─────────────────────────────────────── */}
      <div className="flex flex-col w-full p-4 gap-3">
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

        <div className="grid grid-cols-2 gap-2">
          {/* Tetris */}
          <button
            className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-colors cursor-pointer group ${
              activeGame === 'tetris'
                ? 'bg-[var(--gradient-yellow)]/10 ring-1 ring-[var(--gradient-yellow)]/40'
                : 'hover:bg-[var(--jet)]'
            }`}
            onClick={() => navigate('/games/tetris')}
            aria-label="Play Tetris"
          >
            <div className="w-full aspect-square rounded-xl overflow-hidden shadow-md">
              <img
                src="/assets/images/games/tetris.png"
                alt="Tetris"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <span className={`text-xs font-medium truncate w-full text-center transition-colors ${
              activeGame === 'tetris' ? 'text-[var(--gradient-yellow)]' : 'text-[var(--light-gray)] group-hover:text-white'
            }`}>
              Tetris
            </span>
          </button>
        </div>
      </div>

    </aside>
  );
};

export default HomeLeftSidebar;
