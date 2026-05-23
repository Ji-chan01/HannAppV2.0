import React from 'react';

interface CommentModalProps {
  isDayMode?: boolean;
}

const CommentModal: React.FC<CommentModalProps> = ({ isDayMode }) => {
  return (
    <div
      className={`comment-section${isDayMode ? ' day' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          document.getElementById('closeCommentModal')?.click();
        }
      }}
    >
      <div
        className="card"
      >
        <div className="comment-header">
          <h3 className="text-lg text-center font-bold text-white relative">Comments</h3>
          <button
            id="closeCommentModal"
            className="absolute right-0 top-0 text-[var(--light-gray)] hover:text-white font-bold bg-transparent border-none cursor-pointer text-base"
          >
            ✕
          </button>
        </div>

        <div
          id="commentContainer"
          className="comment-container"
        ></div>

        <div className="comment-field">
          <img
            className="myProfilePic user-dp"
            src="/assets/gifs/loading.gif"
            alt="Current User"
          />
          <input
            id="setComment"
            type="text"
            placeholder="Add a comment..."
          />
          <button
            className="send-message"
          >
            <i className="fa-regular fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
