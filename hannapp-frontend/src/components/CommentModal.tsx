import React from 'react';

interface CommentModalProps {
  isDayMode?: boolean;
}

const CommentModal: React.FC<CommentModalProps> = ({ isDayMode }) => {
  return (
    <div
      className={`comment-section invisible fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center transition-all ${isDayMode ? 'day' : ''}`}
    >
      <div
        className="card bg-[var(--eerie-black)] border border-[var(--jet)] w-[100%] max-w-lg rounded-2xl p-6 shadow-2xl scale-110 opacity-0 transition-all duration-300"
      >
        <div className="comment-header flex justify-between items-center border-b border-[var(--jet)] pb-4 mb-4">
          <h3 className="text-lg font-bold text-white relative">Comments</h3>
          <button
            id="closeCommentModal"
            className="text-[var(--light-gray)] hover:text-white font-bold bg-transparent border-none cursor-pointer text-base"
          >
            ✕
          </button>
        </div>

        <div
          id="commentContainer"
          className="comment-container max-h-[300px] overflow-y-auto flex flex-col gap-4 mb-4"
        ></div>

        <div className="comment-field flex items-center gap-3 border-t border-[var(--jet)] pt-4">
          <div className="w-8 h-8 rounded-full overflow-hidden flex border border-white">
            <img
              className="myProfilePic user-dp w-full h-full object-cover"
              src="/assets/gifs/loading.gif"
              alt="Current User"
            />
          </div>
          <input
            id="setComment"
            type="text"
            placeholder="Add a comment..."
            className="bg-[var(--smoky-black)] border border-[var(--jet)] rounded-full px-4 py-2 flex-1 text-sm text-[var(--light-gray)] outline-none focus:border-[var(--gradient-yellow)]"
          />
          <button
            className="send-message text-[var(--gradient-yellow)] bg-transparent border-none cursor-pointer p-1 text-base"
          >
            <i className="fa-regular fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
