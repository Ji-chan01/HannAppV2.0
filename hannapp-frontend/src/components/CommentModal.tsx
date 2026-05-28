import React, { useState, useEffect } from 'react';
import { formatDpUrl } from './Header';
import { timeConversion } from '../utils/timeConverter';
import { loadFromLocalStorage } from '../utils/cryptoUtils';

interface CommentUser {
  full_name: string;
  dp: string;
}

interface Comment {
  commentAt: string;
  content: string;
  user: CommentUser;
}

interface CommentModalProps {
  isDayMode?: boolean;
  isOpen: boolean;
  postId: string | number | null;
  userId: string | number | null;
  onClose: () => void;
}

const CommentModal: React.FC<CommentModalProps> = ({
  isDayMode,
  isOpen,
  postId,
  userId,
  onClose,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserDp, setCurrentUserDp] = useState('/assets/gifs/loading.gif');

  // Load current user avatar
  useEffect(() => {
    const loadAvatar = async () => {
      try {
        const user_data = await loadFromLocalStorage('Hannah143', 'user_data');
        if (user_data?.dp) {
          setCurrentUserDp(formatDpUrl(user_data.dp));
        }
      } catch (e) {
        console.error('Failed to load user avatar in CommentModal', e);
      }
    };
    loadAvatar();
  }, []);

  // Fetch comments
  const fetchComments = async () => {
    if (!postId || !isOpen) return;
    setIsLoading(true);
    try {
      const activeUserId = userId || 1;
      const res = await fetch(`http://127.0.0.1:8000/api/comment/?postId=${postId}&userId=${activeUserId}`);
      if (!res.ok) throw new Error('Failed to fetch comments');
      const data = await res.json();
      if (data.comments) {
        setComments(data.comments);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.warn('API error fetching comments, using fallback...', error);
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId, isOpen, userId]);

  // Submit comment
  const handleSubmitComment = async () => {
    if (!commentInput.trim() || !postId) return;
    const activeUserId = userId || 1;
    const currentCommentText = commentInput.trim();

    // Optimistically update comments
    const newCommentObj: Comment = {
      commentAt: new Date().toISOString(),
      content: currentCommentText,
      user: {
        full_name: 'You',
        dp: currentUserDp,
      },
    };

    setComments((prev) => [...prev, newCommentObj]);
    setCommentInput('');

    try {
      const res = await fetch('http://127.0.0.1:8000/api/comment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: postId.toString(),
          userId: activeUserId.toString(),
          inputComment: currentCommentText,
        }),
      });

      if (!res.ok) throw new Error('POST failed');
    } catch (e) {
      console.error('Failed to submit comment:', e);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`comment-section active${isDayMode ? ' day' : ''}`}
      style={{ visibility: 'visible' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="card"
        style={{ opacity: 1, transform: 'scale(1)' }}
      >
        <div className="comment-header">
          <h3 className="text-lg text-center font-bold text-white relative">Comments</h3>
          <button
            id="closeCommentModal"
            className="absolute right-0 top-0 text-[var(--light-gray)] hover:text-white font-bold bg-transparent border-none cursor-pointer text-base"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div
          id="commentContainer"
          className="comment-container"
        >
          {isLoading ? (
            <div className="text-center py-4 text-xs text-muted">Loading comments...</div>
          ) : comments.length > 0 ? (
            comments.map((c, i) => (
              <div key={i} className="main-comment">
                <div className="comment-details">
                  <div className="profile-picture">
                    <img
                      src={formatDpUrl(c.user.dp)}
                      alt={c.user.full_name}
                    />
                  </div>
                  <div className="comment-body">
                    <div>
                      <a href="" onClick={(e) => e.preventDefault()}>
                        <h5>{c.user.full_name}</h5>
                      </a>
                      <p className="text-muted" style={{ fontSize: '0.7rem' }}>
                        {timeConversion(c.commentAt)}
                      </p>
                    </div>
                    <p>{c.content}</p>
                    <p className="text-muted">Reply</p>
                  </div>
                </div>
                <div className="reaction">
                  <i style={{ cursor: 'pointer' }} className="fa-regular fa-heart animate-heart"></i>
                  <p className="text-muted">0</p>
                </div>
              </div>
            ))
          ) : (
            <div
              className="main-comment"
              style={{ display: 'block', borderBottom: 'none', marginTop: '1rem' }}
            >
              <h2 style={{ color: 'var(--light-gray)' }}>Be the first one to comment!</h2>
              <p style={{ color: 'var(--light-gray)', fontSize: '0.6rem' }}>
                Keep the comment section respectful and kind to everyone. Let's spread positivity!
              </p>
            </div>
          )}
        </div>

        <div className="comment-field">
          <img
            className="myProfilePic user-dp"
            src={currentUserDp}
            alt="Current User"
          />
          <input
            id="setComment"
            type="text"
            placeholder="Add a comment..."
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSubmitComment();
              }
            }}
          />
          <button
            className="send-message"
            onClick={handleSubmitComment}
          >
            <i className="fa-regular fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
