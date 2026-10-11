import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Users,
  Bot,
  RotateCcw,
  Trophy,
  Sparkles,
  Flame,
  RefreshCw,
  Volume2,
  VolumeX,
  Palette,
  Check,
} from 'lucide-react';

type Player = 'X' | 'O';
type Board = Array<Player | null>;
type GameMode = 'PVC' | 'PVP'; // Player vs Computer | Player vs Player
type Difficulty = 'EASY' | 'MEDIUM' | 'MASTER';
type UiTheme = 'classic' | 'minimalist' | 'retro' | 'modern' | 'futuristic' | 'neon';

interface ScoreBoard {
  xWins: number;
  oWins: number;
  draws: number;
  currentStreak: number;
}

const WINNING_COMBOS = [
  [0, 1, 2], // Row 1
  [3, 4, 5], // Row 2
  [6, 7, 8], // Row 3
  [0, 3, 6], // Col 1
  [1, 4, 7], // Col 2
  [2, 5, 8], // Col 3
  [0, 4, 8], // Diagonal 1
  [2, 4, 6], // Diagonal 2
];

const THEMES: Record<
  UiTheme,
  {
    name: string;
    description: string;
    boardBg: string;
    cellBg: string;
    cellHover: string;
    cellBorder: string;
    xColor: string;
    oColor: string;
    winningCellBg: string;
    accentGlow: string;
    containerBg: string;
  }
> = {
  classic: {
    name: 'Classic',
    description: 'Timeless slate & warm wood aesthetic',
    containerBg: 'bg-white dark:bg-[#1e1e1e] border-slate-200 dark:border-white/10',
    boardBg: 'bg-slate-100 dark:bg-black/30 border-slate-200 dark:border-white/10',
    cellBg: 'bg-white dark:bg-[#18181b] border-slate-200 dark:border-white/10 text-slate-900 dark:text-white',
    cellHover: 'hover:bg-slate-50 dark:hover:bg-white/5',
    cellBorder: 'border-slate-200 dark:border-white/10',
    xColor: 'text-blue-600 dark:text-sky-400',
    oColor: 'text-rose-600 dark:text-rose-400',
    winningCellBg: 'bg-emerald-500 text-white ring-4 ring-emerald-400/40 shadow-lg shadow-emerald-500/30',
    accentGlow: '',
  },
  minimalist: {
    name: 'Minimalist',
    description: 'Monochrome ink geometry & hairline contrast',
    containerBg: 'bg-white dark:bg-[#141414] border-black/10 dark:border-white/10',
    boardBg: 'bg-transparent border-black/20 dark:border-white/20',
    cellBg: 'bg-transparent border-black/10 dark:border-white/10 text-black dark:text-white',
    cellHover: 'hover:bg-black/[0.03] dark:hover:bg-white/[0.04]',
    cellBorder: 'border-black/20 dark:border-white/20',
    xColor: 'text-black dark:text-white font-light',
    oColor: 'text-black/80 dark:text-white/80 font-light',
    winningCellBg: 'bg-black text-white dark:bg-white dark:text-black font-bold',
    accentGlow: '',
  },
  retro: {
    name: 'Retro 8-Bit',
    description: 'Arcade cabinet CRT glow & pixel nostalgia',
    containerBg: 'bg-[#0f0e17] text-[#fffffe] border-[#f25f4c]/30 shadow-2xl',
    boardBg: 'bg-[#181622] border-[#e53170]/40',
    cellBg: 'bg-[#232136] border-[#e53170]/30 text-[#fffffe]',
    cellHover: 'hover:bg-[#2e2b47]',
    cellBorder: 'border-[#e53170]/50',
    xColor: 'text-[#ff8906] drop-shadow-[0_0_8px_#ff8906]',
    oColor: 'text-[#e53170] drop-shadow-[0_0_8px_#e53170]',
    winningCellBg: 'bg-[#ff8906] text-[#0f0e17] shadow-[0_0_15px_#ff8906] font-black',
    accentGlow: 'shadow-[0_0_20px_rgba(255,137,6,0.2)]',
  },
  modern: {
    name: 'Modern Glass',
    description: 'Frosted glassmorphism with vivid soft gradients',
    containerBg: 'bg-white/80 dark:bg-[#18181b]/80 backdrop-blur-md border-slate-200/80 dark:border-white/10 shadow-xl',
    boardBg: 'bg-slate-100/60 dark:bg-black/40 backdrop-blur-sm border-slate-200 dark:border-white/10',
    cellBg: 'bg-white/90 dark:bg-white/5 border-slate-200/70 dark:border-white/10 text-slate-900 dark:text-white shadow-xs',
    cellHover: 'hover:bg-blue-50/60 dark:hover:bg-white/10',
    cellBorder: 'border-slate-200/70 dark:border-white/10',
    xColor: 'text-blue-600 dark:text-sky-400 drop-shadow-sm',
    oColor: 'text-purple-600 dark:text-pink-400 drop-shadow-sm',
    winningCellBg: 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105',
    accentGlow: '',
  },
  futuristic: {
    name: 'Futuristic HUD',
    description: 'Cyberpunk laser grids & high-tech telemetry',
    containerBg: 'bg-[#050811] text-[#00f0ff] border-[#00f0ff]/30 shadow-[0_0_30px_rgba(0,240,255,0.1)]',
    boardBg: 'bg-[#0b1329] border-[#00f0ff]/40 shadow-inner',
    cellBg: 'bg-[#071026] border-[#00f0ff]/30 text-[#00f0ff]',
    cellHover: 'hover:bg-[#0e214d]',
    cellBorder: 'border-[#00f0ff]/40',
    xColor: 'text-[#00f0ff] drop-shadow-[0_0_10px_#00f0ff]',
    oColor: 'text-[#ff007f] drop-shadow-[0_0_10px_#ff007f]',
    winningCellBg: 'bg-[#00f0ff] text-[#050811] shadow-[0_0_20px_#00f0ff] font-black scale-105',
    accentGlow: 'shadow-[0_0_25px_rgba(0,240,255,0.25)]',
  },
  neon: {
    name: 'Neon Glow',
    description: 'Deep OLED darkness with radiant cathode tube lights',
    containerBg: 'bg-[#090a0f] text-white border-pink-500/30 shadow-2xl',
    boardBg: 'bg-[#050608] border-pink-500/20',
    cellBg: 'bg-[#10121a] border-white/10 text-white',
    cellHover: 'hover:bg-[#1a1d29]',
    cellBorder: 'border-white/10',
    xColor: 'text-emerald-400 drop-shadow-[0_0_12px_#34d399]',
    oColor: 'text-fuchsia-400 drop-shadow-[0_0_12px_#e879f9]',
    winningCellBg: 'bg-emerald-400 text-black shadow-[0_0_25px_#34d399] font-black',
    accentGlow: 'shadow-[0_0_20px_rgba(232,121,249,0.2)]',
  },
};

const STORAGE_KEY_SCORES = 'tictactoe_scores_storage';
const STORAGE_KEY_THEME = 'tictactoe_ui_theme';

export const TicTacToeGame: React.FC = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [gameMode, setGameMode] = useState<GameMode>('PVC');
  const [difficulty, setDifficulty] = useState<Difficulty>('MASTER');
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Selected Theme
  const [currentTheme, setCurrentTheme] = useState<UiTheme>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME) as UiTheme;
      return saved && THEMES[saved] ? saved : 'classic';
    } catch {
      return 'classic';
    }
  });

  const [scores, setScores] = useState<ScoreBoard>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SCORES);
      return saved ? JSON.parse(saved) : { xWins: 0, oWins: 0, draws: 0, currentStreak: 0 };
    } catch {
      return { xWins: 0, oWins: 0, draws: 0, currentStreak: 0 };
    }
  });

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Simple Synthesizer Sound Generator (Web Audio API)
  const playSound = useCallback(
    (type: 'click' | 'win' | 'draw' | 'reset') => {
      if (!soundEnabled) return;
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;

        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioContextClass();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;

        if (type === 'click') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(isXNext ? 440 : 587, now);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          osc.start(now);
          osc.stop(now + 0.12);
        } else if (type === 'win') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(523.25, now);
          osc.frequency.setValueAtTime(659.25, now + 0.1);
          osc.frequency.setValueAtTime(783.99, now + 0.2);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
          osc.start(now);
          osc.stop(now + 0.45);
        } else if (type === 'draw') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(330, now);
          osc.frequency.setValueAtTime(293, now + 0.15);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          osc.start(now);
          osc.stop(now + 0.3);
        } else if (type === 'reset') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(400, now);
          osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          osc.start(now);
          osc.stop(now + 0.15);
        }
      } catch {
        // AudioContext disabled or unpermitted
      }
    },
    [soundEnabled, isXNext]
  );

  // Check winner helper
  const calculateWinner = (squares: Board): { winner: Player | null; line: number[] | null } => {
    for (const combo of WINNING_COMBOS) {
      const [a, b, c] = combo;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: combo };
      }
    }
    return { winner: null, line: null };
  };

  const { winner, line: winningLine } = calculateWinner(board);
  const isBoardFull = board.every((cell) => cell !== null);
  const isDraw = !winner && isBoardFull;
  const isGameOver = Boolean(winner || isDraw);

  // Save selected theme
  const handleSelectTheme = (t: UiTheme) => {
    setCurrentTheme(t);
    try {
      localStorage.setItem(STORAGE_KEY_THEME, t);
    } catch {}
  };

  // Minimax algorithm for Master / Unbeatable AI
  const minimax = (
    currentBoard: Board,
    depth: number,
    isMaximizing: boolean
  ): { score: number; move?: number } => {
    const { winner: currentWinner } = calculateWinner(currentBoard);
    if (currentWinner === 'O') return { score: 10 - depth };
    if (currentWinner === 'X') return { score: depth - 10 };
    if (currentBoard.every((cell) => cell !== null)) return { score: 0 };

    if (isMaximizing) {
      let bestScore = -Infinity;
      let bestMove: number | undefined;
      for (let i = 0; i < 9; i++) {
        if (!currentBoard[i]) {
          currentBoard[i] = 'O';
          const result = minimax(currentBoard, depth + 1, false);
          currentBoard[i] = null;
          if (result.score > bestScore) {
            bestScore = result.score;
            bestMove = i;
          }
        }
      }
      return { score: bestScore, move: bestMove };
    } else {
      let bestScore = Infinity;
      let bestMove: number | undefined;
      for (let i = 0; i < 9; i++) {
        if (!currentBoard[i]) {
          currentBoard[i] = 'X';
          const result = minimax(currentBoard, depth + 1, true);
          currentBoard[i] = null;
          if (result.score < bestScore) {
            bestScore = result.score;
            bestMove = i;
          }
        }
      }
      return { score: bestScore, move: bestMove };
    }
  };

  // Computer AI move generator
  const getComputerMove = useCallback(
    (currentBoard: Board, diff: Difficulty): number => {
      const availableMoves = currentBoard
        .map((cell, idx) => (cell === null ? idx : null))
        .filter((val): val is number => val !== null);

      if (availableMoves.length === 0) return -1;

      // Easy: completely random
      if (diff === 'EASY') {
        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        return availableMoves[randomIndex];
      }

      // Medium: 60% smart, 40% random
      if (diff === 'MEDIUM') {
        if (Math.random() < 0.4) {
          const randomIndex = Math.floor(Math.random() * availableMoves.length);
          return availableMoves[randomIndex];
        }
      }

      // Master or Medium smart pick: Minimax optimal move
      const { move } = minimax(currentBoard, 0, true);
      return move !== undefined ? move : availableMoves[0];
    },
    []
  );

  // Trigger AI move when it's O's turn in PVC mode
  useEffect(() => {
    if (gameMode === 'PVC' && !isXNext && !isGameOver) {
      setIsAiThinking(true);
      const timer = setTimeout(() => {
        const move = getComputerMove([...board], difficulty);
        if (move !== -1) {
          const next = [...board];
          next[move] = 'O';
          setBoard(next);
          setIsXNext(true);
          playSound('click');
        }
        setIsAiThinking(false);
      }, 420);
      return () => clearTimeout(timer);
    }
  }, [board, isXNext, gameMode, difficulty, isGameOver, getComputerMove, playSound]);

  // Handle score recording on game end
  useEffect(() => {
    if (winner) {
      playSound('win');
      setScores((prev) => {
        const next = {
          ...prev,
          xWins: winner === 'X' ? prev.xWins + 1 : prev.xWins,
          oWins: winner === 'O' ? prev.oWins + 1 : prev.oWins,
          currentStreak: winner === 'X' ? prev.currentStreak + 1 : 0,
        };
        try {
          localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify(next));
        } catch {}
        return next;
      });
    } else if (isDraw) {
      playSound('draw');
      setScores((prev) => {
        const next = { ...prev, draws: prev.draws + 1 };
        try {
          localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify(next));
        } catch {}
        return next;
      });
    }
  }, [winner, isDraw, playSound]);

  // User click on cell
  const handleCellClick = (idx: number) => {
    if (board[idx] || isGameOver || isAiThinking) return;
    if (gameMode === 'PVC' && !isXNext) return;

    playSound('click');
    const next = [...board];
    next[idx] = isXNext ? 'X' : 'O';
    setBoard(next);
    setIsXNext(!isXNext);
  };

  const handleRestartGame = () => {
    playSound('reset');
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setIsAiThinking(false);
  };

  const handleResetScores = () => {
    playSound('reset');
    const empty = { xWins: 0, oWins: 0, draws: 0, currentStreak: 0 };
    setScores(empty);
    try {
      localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify(empty));
    } catch {}
  };

  const themeConfig = THEMES[currentTheme];

  return (
    <div className="space-y-6 max-w-2xl mx-auto text-left">
      {/* Theme Switcher Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-blue-600 dark:text-sky-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Visual UI Theme
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            {themeConfig.description}
          </span>
        </div>

        {/* Theme Pills */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {(Object.keys(THEMES) as UiTheme[]).map((tKey) => {
            const t = THEMES[tKey];
            const isActive = currentTheme === tKey;
            return (
              <button
                key={tKey}
                type="button"
                onClick={() => handleSelectTheme(tKey)}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 border ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/25 scale-[1.02]'
                    : 'bg-slate-50 dark:bg-white/5 border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100'
                }`}
              >
                <span>{t.name}</span>
                {isActive && <Check className="w-3 h-3 text-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Header & Mode Switcher */}
      <div className={`p-4 rounded-2xl border transition-colors flex flex-wrap items-center justify-between gap-3 ${themeConfig.containerBg}`}>
        {/* Game Mode Segmented Buttons */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setGameMode('PVC');
              handleRestartGame();
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              gameMode === 'PVC'
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>vs Computer</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setGameMode('PVP');
              handleRestartGame();
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              gameMode === 'PVP'
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>2 Players</span>
          </button>
        </div>

        {/* AI Difficulty (if vs Computer) */}
        {gameMode === 'PVC' && (
          <div className="flex items-center gap-1 text-xs">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mr-1">AI:</span>
            {(['EASY', 'MEDIUM', 'MASTER'] as Difficulty[]).map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => {
                  setDifficulty(diff);
                  handleRestartGame();
                }}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold cursor-pointer transition-colors ${
                  difficulty === diff
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {diff === 'MASTER' ? 'Unbeatable' : diff.charAt(0) + diff.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 ml-auto sm:ml-0">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            title={`Toggle Sound (${soundEnabled ? 'On' : 'Muted'})`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* New Game */}
          <button
            type="button"
            onClick={handleRestartGame}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-200 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Game</span>
          </button>
        </div>
      </div>

      {/* Live Turn & Status Banner */}
      <div className={`p-4 rounded-2xl border transition-colors flex items-center justify-between ${themeConfig.containerBg}`}>
        <div className="flex items-center gap-3">
          {winner ? (
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm sm:text-base animate-bounce">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>
                {winner === 'X'
                  ? gameMode === 'PVC' ? 'You Win! (Player X)' : 'Player X Wins!'
                  : gameMode === 'PVC' ? 'Computer Wins! (Player O)' : 'Player O Wins!'}
              </span>
            </div>
          ) : isDraw ? (
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm sm:text-base">
              <span>Game Drawn! Both played well.</span>
            </div>
          ) : isAiThinking ? (
            <div className="flex items-center gap-2 text-blue-600 dark:text-sky-400 font-semibold text-sm">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Computer is thinking...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm sm:text-base">
              <span>Turn:</span>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold ${
                isXNext ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-sky-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
              }`}>
                {isXNext ? 'Player X' : gameMode === 'PVC' ? 'Computer O' : 'Player O'}
              </span>
            </div>
          )}
        </div>

        {/* Streak indicator */}
        {scores.currentStreak > 1 && (
          <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
            <Flame className="w-4 h-4 fill-amber-500" />
            <span>{scores.currentStreak} Win Streak!</span>
          </div>
        )}
      </div>

      {/* Main 3x3 Board */}
      <div className={`p-6 sm:p-8 rounded-3xl border transition-all flex flex-col items-center ${themeConfig.containerBg} ${themeConfig.accentGlow}`}>
        <div className={`grid grid-cols-3 gap-3 sm:gap-4.5 w-full max-w-[360px] aspect-square p-3.5 sm:p-4 rounded-3xl border ${themeConfig.boardBg}`}>
          {board.map((cell, idx) => {
            const isWinningCell = winningLine?.includes(idx);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleCellClick(idx)}
                disabled={Boolean(cell || isGameOver || isAiThinking)}
                className={`relative aspect-square rounded-2xl flex items-center justify-center font-black transition-all cursor-pointer border ${
                  isWinningCell
                    ? themeConfig.winningCellBg
                    : cell
                    ? themeConfig.cellBg
                    : `${themeConfig.cellBg} ${themeConfig.cellHover} active:scale-95`
                }`}
              >
                {cell === 'X' && (
                  <span className={`text-4xl sm:text-5xl font-black ${isWinningCell ? 'text-inherit' : themeConfig.xColor} animate-in zoom-in-75 duration-150`}>
                    &times;
                  </span>
                )}
                {cell === 'O' && (
                  <span className={`text-4xl sm:text-5xl font-black ${isWinningCell ? 'text-inherit' : themeConfig.oColor} animate-in zoom-in-75 duration-150`}>
                    &#9675;
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Score Tracking Card */}
      <div className={`p-4 rounded-2xl border transition-colors space-y-3 ${themeConfig.containerBg}`}>
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider font-bold text-slate-700 dark:text-slate-300">
            Score Tracking
          </span>
          <button
            type="button"
            onClick={handleResetScores}
            className="text-[11px] text-slate-400 hover:text-rose-500 cursor-pointer underline"
          >
            Reset Scores
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/30">
            <span className="text-[11px] font-bold text-blue-700 dark:text-sky-400 block">
              {gameMode === 'PVC' ? 'You (X)' : 'Player X'}
            </span>
            <span className="text-2xl font-mono font-black text-slate-900 dark:text-white mt-1 block">
              {scores.xWins}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
            <span className="text-[11px] font-bold text-slate-500 block">Draws</span>
            <span className="text-2xl font-mono font-black text-slate-900 dark:text-white mt-1 block">
              {scores.draws}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/30">
            <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400 block">
              {gameMode === 'PVC' ? 'Computer (O)' : 'Player O'}
            </span>
            <span className="text-2xl font-mono font-black text-slate-900 dark:text-white mt-1 block">
              {scores.oWins}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
