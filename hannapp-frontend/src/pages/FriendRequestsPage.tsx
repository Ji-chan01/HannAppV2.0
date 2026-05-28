import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header, { formatDpUrl } from '../components/Header';
import HomeLeftSidebar from '../components/HomeLeftSidebar';
import HomeRightSidebar from '../components/HomeRightSidebar';
import { loadFromLocalStorage } from '../utils/cryptoUtils';
import './FriendRequestsPage.css';

interface FriendRequest {
  id: number;
  userId: number;
  name: string;
  username: string;
  dp: string;
  mutualFriends: number;
  sentAt: string;
}

const MOCK_REQUESTS: FriendRequest[] = [
  {
    id: 1,
    userId: 201,
    name: 'Marcus Aurelius',
    username: '@marcus_stoic',
    dp: '/assets/images/dp/avatar-men.png',
    mutualFriends: 5,
    sentAt: '2 minutes ago',
  },
  {
    id: 2,
    userId: 202,
    name: 'Hannah Abbott',
    username: '@hannah_dev',
    dp: '/assets/images/dp/avatar-3.png',
    mutualFriends: 12,
    sentAt: '1 hour ago',
  },
  {
    id: 3,
    userId: 203,
    name: 'Carlos Reyes',
    username: '@carlos_r',
    dp: '/assets/images/dp/avatar-men.png',
    mutualFriends: 3,
    sentAt: '3 hours ago',
  },
  {
    id: 4,
    userId: 204,
    name: 'Sofia Torres',
    username: '@sofia_t',
    dp: '/assets/images/dp/avatar-3.png',
    mutualFriends: 0,
    sentAt: 'Yesterday',
  },
  {
    id: 5,
    userId: 205,
    name: 'Ethan Park',
    username: '@ethan_park',
    dp: '/assets/images/dp/avatar-men.png',
    mutualFriends: 8,
    sentAt: '2 days ago',
  },
];

type RequestStatus = 'pending' | 'accepted' | 'declined';

const FriendRequestsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isDayMode, setIsDayMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [statuses, setStatuses] = useState<Record<number, RequestStatus>>({});
  const [isLoading, setIsLoading] = useState(true);

  /* ── Load current user ───────────────────────── */
  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await loadFromLocalStorage('Hannah143', 'user_data');
        if (data) setCurrentUser(data);
      } catch (err) {
        console.error('Failed to load user', err);
      }
    };
    loadUser();
  }, []);

  /* ── Load friend requests ────────────────────── */
  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      try {
        const userId = currentUser?.userId;
        if (!userId) throw new Error('No userId');
        const res = await fetch(`http://127.0.0.1:8000/api/friend-requests/?userId=${userId}`);
        if (!res.ok) throw new Error('API failed');
        const data = await res.json();
        setRequests(data.requests || MOCK_REQUESTS);
      } catch {
        // Fall back to mocks when offline
        setRequests(MOCK_REQUESTS);
      } finally {
        setIsLoading(false);
      }
    };

    // Wait until we have the user before fetching (or just load mocks)
    if (currentUser !== null) {
      fetchRequests();
    } else {
      // Still load mocks if user hasn't loaded yet after a brief wait
      const t = setTimeout(() => {
        setRequests(MOCK_REQUESTS);
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [currentUser]);

  const handleAccept = (id: number) => {
    setStatuses((prev) => ({ ...prev, [id]: 'accepted' }));
  };

  const handleDecline = (id: number) => {
    setStatuses((prev) => ({ ...prev, [id]: 'declined' }));
  };

  const handleUndo = (id: number) => {
    setStatuses((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const pendingCount = requests.filter((r) => !statuses[r.id]).length;

  return (
    <div className={`fr-page-wrapper ${isDayMode ? 'day' : ''}`}>
      <Header isDayMode={isDayMode} setIsDayMode={setIsDayMode} currentUser={currentUser} />

      <main className="fr-main">
        <HomeLeftSidebar currentUser={currentUser} />

        {/* ── Centre column ───────────────────────── */}
        <section className="fr-content">
          {/* Page header */}
          <div className="fr-page-header">
            <div className="fr-page-title-row">
              <h2 className="fr-page-title">Friend Requests</h2>
              {pendingCount > 0 && (
                <span className="fr-count-badge">{pendingCount}</span>
              )}
            </div>
            <p className="fr-page-subtitle">
              People who want to connect with you
            </p>
          </div>

          {/* Request list */}
          <div className="fr-list">
            {isLoading ? (
              /* Skeleton loaders */
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="fr-card fr-skeleton">
                  <div className="fr-skeleton-avatar" />
                  <div className="fr-skeleton-lines">
                    <div className="fr-skeleton-line wide" />
                    <div className="fr-skeleton-line narrow" />
                  </div>
                </div>
              ))
            ) : requests.length === 0 ? (
              <div className="fr-empty">
                <i className="fa-solid fa-user-check fr-empty-icon" />
                <h3>No pending requests</h3>
                <p>You're all caught up! Any new requests will appear here.</p>
              </div>
            ) : (
              requests.map((req) => {
                const status = statuses[req.id];

                return (
                  <div
                    key={req.id}
                    className={`fr-card${status === 'accepted' ? ' fr-accepted' : status === 'declined' ? ' fr-declined' : ''}`}
                  >
                    {/* Avatar */}
                    <div
                      className="fr-avatar-wrap"
                      onClick={() => navigate(`/profile?p=${req.userId}`)}
                      title={`View ${req.name}'s profile`}
                    >
                      <img
                        className="fr-avatar"
                        src={formatDpUrl(req.dp)}
                        alt={req.name}
                      />
                      <span className="fr-avatar-online" />
                    </div>

                    {/* Info */}
                    <div className="fr-info">
                      <button
                        className="fr-name"
                        onClick={() => navigate(`/profile?p=${req.userId}`)}
                      >
                        {req.name}
                      </button>
                      <span className="fr-username">{req.username}</span>
                      <div className="fr-meta">
                        {req.mutualFriends > 0 && (
                          <span className="fr-mutual">
                            <i className="fa-solid fa-user-group" />
                            {req.mutualFriends} mutual friend{req.mutualFriends !== 1 ? 's' : ''}
                          </span>
                        )}
                        <span className="fr-time">
                          <i className="fa-regular fa-clock" />
                          {req.sentAt}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="fr-actions">
                      {!status ? (
                        <>
                          <button
                            className="fr-btn fr-btn-accept"
                            onClick={() => handleAccept(req.id)}
                          >
                            <i className="fa-solid fa-check" />
                            Accept
                          </button>
                          <button
                            className="fr-btn fr-btn-decline"
                            onClick={() => handleDecline(req.id)}
                          >
                            <i className="fa-solid fa-xmark" />
                            Decline
                          </button>
                        </>
                      ) : (
                        <div className="fr-status-row">
                          <span className={`fr-status-tag ${status}`}>
                            <i
                              className={
                                status === 'accepted'
                                  ? 'fa-solid fa-circle-check'
                                  : 'fa-solid fa-circle-xmark'
                              }
                            />
                            {status === 'accepted' ? 'Accepted' : 'Declined'}
                          </span>
                          <button
                            className="fr-undo-btn"
                            onClick={() => handleUndo(req.id)}
                          >
                            Undo
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <HomeRightSidebar userId={currentUser?.userId} />
      </main>
    </div>
  );
};

export default FriendRequestsPage;
