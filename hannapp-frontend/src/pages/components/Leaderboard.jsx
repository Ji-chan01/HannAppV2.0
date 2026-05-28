import React, { memo, useState, useRef, useEffect } from 'react';

const MEDAL_COLORS = ['#fbbf24', '#9ca3af', '#b45309'];
const MEDAL_LABELS = ['🥇', '🥈', '🥉'];

const Leaderboard = memo(({ entries, showSaveModal, currentScore, onSubmit }) => {
  const [name, setName] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (showSaveModal && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showSaveModal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(name, currentScore);
    setName('');
  };

  return (
    <div className="glass-panel p-4 flex flex-col gap-3" style={{ minWidth: 180 }}>
      {/* Header */}
      <div className="flex items-center gap-2 border-b pb-2" style={{ borderColor: 'rgba(124,58,237,0.25)' }}>
        <span style={{ fontSize: '1rem' }}>🏆</span>
        <span style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#a78bfa',
        }}>
          Leaderboard
        </span>
      </div>

      {/* Entries */}
      <div className="flex flex-col gap-1" style={{ maxHeight: 280, overflowY: 'auto' }}>
        {entries.map((entry, i) => (
          <div
            key={i}
            className="lb-row"
            style={{
              background: i < 3 ? `rgba(${i === 0 ? '251,191,36' : i === 1 ? '156,163,175' : '180,83,9'},0.08)` : 'transparent',
            }}
          >
            <span
              className="lb-rank"
              style={{ color: i < 3 ? MEDAL_COLORS[i] : '#6366f1' }}
            >
              {i < 3 ? MEDAL_LABELS[i] : `#${i + 1}`}
            </span>
            <span className="lb-name">{entry.name}</span>
            <span className="lb-score">{entry.score.toLocaleString()}</span>
          </div>
        ))}
        {entries.length === 0 && (
          <p style={{ fontSize: '0.7rem', color: '#475569', textAlign: 'center', padding: '1rem 0' }}>
            No scores yet
          </p>
        )}
      </div>

      {/* Save score modal (inline) */}
      {showSaveModal && (
        <div
          style={{
            background: 'rgba(10,10,20,0.95)',
            border: '1px solid rgba(124,58,237,0.5)',
            borderRadius: '8px',
            padding: '0.9rem',
            marginTop: '0.25rem',
          }}
        >
          <p style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '0.6rem',
            letterSpacing: '0.12em',
            color: '#34d399',
            textTransform: 'uppercase',
            marginBottom: '0.4rem',
            textAlign: 'center',
          }}>
            🎉 New High Score!
          </p>
          <p style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '1.1rem',
            fontWeight: 700,
            color: '#a78bfa',
            textAlign: 'center',
            marginBottom: '0.6rem',
          }}>
            {currentScore.toLocaleString()}
          </p>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <input
              ref={inputRef}
              className="lb-input"
              type="text"
              placeholder="Enter your name…"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={12}
              id="input-player-name"
            />
            <button
              type="submit"
              className="btn-primary"
              style={{ fontSize: '0.7rem', padding: '0.45rem 1rem' }}
              id="btn-save-score"
            >
              Save Score
            </button>
          </form>
        </div>
      )}
    </div>
  );
});
Leaderboard.displayName = 'Leaderboard';

export default Leaderboard;
