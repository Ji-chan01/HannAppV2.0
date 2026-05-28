import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

export interface Contact {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

export interface ChatMessage {
  id: number;
  text: string;
  sent: boolean;
  time: string;
}

export interface OpenChat {
  contact: Contact;
  messages: ChatMessage[];
  input: string;
}

interface MessageChatWindowProps {
  openChats: OpenChat[];
  onClose: (contactId: number) => void;
  onSend: (contactId: number) => void;
  onInputChange: (contactId: number, value: string) => void;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const ChatWindow: React.FC<{
  chat: OpenChat;
  index: number;
  onClose: (id: number) => void;
  onSend: (id: number) => void;
  onInputChange: (id: number, val: string) => void;
}> = ({ chat, index, onClose, onSend, onInputChange }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.messages]);

  const rightOffset = `${1 + index * 21.5}rem`;

  return (
    <div
      className="chat-window"
      style={{ right: rightOffset, bottom: 0, position: 'fixed' }}
    >
      {/* Chat Header */}
      <div className="chat-win-header">
        <div className="chat-win-avatar">
          <div className="msg-avatar-initials small">{getInitials(chat.contact.name)}</div>
          {chat.contact.online && <span className="msg-online-dot"></span>}
        </div>
        <div className="chat-win-title">
          <span className="chat-win-name">{chat.contact.name}</span>
          <span className="chat-win-status">
            {chat.contact.online ? 'Active now' : 'Offline'}
          </span>
        </div>
        <div className="chat-win-actions">
          <button title="Video call">
            <i className="fa-solid fa-video"></i>
          </button>
          <button title="Voice call">
            <i className="fa-solid fa-phone"></i>
          </button>
          <button title="Close" onClick={() => onClose(chat.contact.id)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="chat-win-messages">
        {chat.messages.map((m) => (
          <div
            key={m.id}
            className={`chat-bubble-wrap${m.sent ? ' sent' : ' received'}`}
          >
            {!m.sent && (
              <div className="chat-bubble-avatar">
                <div className="msg-avatar-initials xs">
                  {getInitials(chat.contact.name)}
                </div>
              </div>
            )}
            <div className="chat-bubble">
              <span>{m.text}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="chat-win-input-row">
        <button className="chat-emoji-btn" title="Emoji">
          <i className="fa-regular fa-face-smile"></i>
        </button>
        <input
          type="text"
          className="chat-win-input"
          placeholder="Aa"
          value={chat.input}
          onChange={(e) => onInputChange(chat.contact.id, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSend(chat.contact.id);
          }}
        />
        <button
          className="chat-send-btn"
          onClick={() => onSend(chat.contact.id)}
          title="Send"
        >
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
};

const MessageChatWindow: React.FC<MessageChatWindowProps> = ({
  openChats,
  onClose,
  onSend,
  onInputChange,
}) => {
  return ReactDOM.createPortal(
    <>
      {openChats.map((chat, idx) => (
        <ChatWindow
          key={chat.contact.id}
          chat={chat}
          index={idx}
          onClose={onClose}
          onSend={onSend}
          onInputChange={onInputChange}
        />
      ))}
    </>,
    document.body
  );
};

export default MessageChatWindow;
