// Grid dimensions
export const COLS = 10;
export const ROWS = 20;

// Tetromino definitions: shape matrices + color class
export const TETROMINOES = {
  I: {
    shapes: [
      [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
      [[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]],
      [[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]],
      [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],
    ],
    color: 'piece-I',
    hex: '#06b6d4',
  },
  J: {
    shapes: [
      [[1,0,0],[1,1,1],[0,0,0]],
      [[0,1,1],[0,1,0],[0,1,0]],
      [[0,0,0],[1,1,1],[0,0,1]],
      [[0,1,0],[0,1,0],[1,1,0]],
    ],
    color: 'piece-J',
    hex: '#3b82f6',
  },
  L: {
    shapes: [
      [[0,0,1],[1,1,1],[0,0,0]],
      [[0,1,0],[0,1,0],[0,1,1]],
      [[0,0,0],[1,1,1],[1,0,0]],
      [[1,1,0],[0,1,0],[0,1,0]],
    ],
    color: 'piece-L',
    hex: '#f97316',
  },
  O: {
    shapes: [
      [[0,1,1,0],[0,1,1,0],[0,0,0,0]],
      [[0,1,1,0],[0,1,1,0],[0,0,0,0]],
      [[0,1,1,0],[0,1,1,0],[0,0,0,0]],
      [[0,1,1,0],[0,1,1,0],[0,0,0,0]],
    ],
    color: 'piece-O',
    hex: '#eab308',
  },
  S: {
    shapes: [
      [[0,1,1],[1,1,0],[0,0,0]],
      [[0,1,0],[0,1,1],[0,0,1]],
      [[0,0,0],[0,1,1],[1,1,0]],
      [[1,0,0],[1,1,0],[0,1,0]],
    ],
    color: 'piece-S',
    hex: '#22c55e',
  },
  T: {
    shapes: [
      [[0,1,0],[1,1,1],[0,0,0]],
      [[0,1,0],[0,1,1],[0,1,0]],
      [[0,0,0],[1,1,1],[0,1,0]],
      [[0,1,0],[1,1,0],[0,1,0]],
    ],
    color: 'piece-T',
    hex: '#a855f7',
  },
  Z: {
    shapes: [
      [[1,1,0],[0,1,1],[0,0,0]],
      [[0,0,1],[0,1,1],[0,1,0]],
      [[0,0,0],[1,1,0],[0,1,1]],
      [[0,1,0],[1,1,0],[1,0,0]],
    ],
    color: 'piece-Z',
    hex: '#ef4444',
  },
};

export const TETROMINO_KEYS = Object.keys(TETROMINOES);

// Scoring: points per lines cleared (Tetris classic)
export const SCORE_TABLE = [0, 100, 300, 500, 800];

// Level thresholds: lines needed to level up
export const LINES_PER_LEVEL = 10;

// Drop interval in ms per level (lower = faster)
export function getDropInterval(level) {
  const base = 800;
  const min = 80;
  return Math.max(min, base - (level - 1) * 70);
}

// Initial leaderboard entries
export const INITIAL_LEADERBOARD = [
  { name: 'NovaStar',  score: 12400 },
  { name: 'CyberAce',  score: 8750  },
  { name: 'PixelKing', score: 6300  },
  { name: 'GridWolf',  score: 4100  },
  { name: 'ByteRush',  score: 2200  },
];
