import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Bot,
  RotateCcw,
  Trophy,
  Sparkles,
  Zap,
  Flame,
  Award,
  RefreshCw,
  X as XIcon,
  Circle,
} from 'lucide-react';

type Player = 'X' | 'O';
type Board = Array<Player | null>;
type GameMode = 'PVC' | 'PVP'; // Player vs Computer | Player vs Player
type Difficulty = 'EASY' | 'MEDIUM' | 'MASTER';

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

const STORAGE_KEY_SCORES = 'tictactoe_scores_storage';

export const TicTacToeGame: React.FC = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [gameMode, setGameMode] = useState<GameMode>('PVC');
  const [difficulty, setDifficulty] = useState<Difficulty>('MASTER');
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

  const [scores, setScores] = useState<ScoreBoard>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SCORES);
      return saved ? JSON.parse(saved) : { xWins: 0, oWins: 0, draws: 0, currentStreak: 0 };
    } catch {
      return { xWins: 0, oWins: 0, draws: 0, currentStreak: 0 };
    }
  });

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
        }
        setIsAiThinking(false);
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [board, isXNext, gameMode, difficulty, isGameOver, getComputerMove]);

  // Handle score recording on game end
  useEffect(() => {
    if (winner) {
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
      setScores((prev) => {
        const next = { ...prev, draws: prev.draws + 1 };
        try {
          localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify(next));
        } catch {}
        return next;
      });
    }
  }, [winner, isDraw]);

  // User click on cell
  const handleCellClick = (idx: number) => {
    if (board[idx] || isGameOver || isAiThinking) return;
    if (gameMode === 'PVC' && !isXNext) return;

    const next = [...board];
    next[idx] = isXNext ? 'X' : 'O';
    setBoard(next);
    setIsXNext(!isXNext);
  };

  const handleRestartGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setIsAiThinking(false);
  };

  const handleResetScores = () => {
    const empty = { xWins: 0, oWins: 0, draws: 0, currentStreak: 0 };
    setScores(empty);
    try {
      localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify(empty));
    } catch {}
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header & Mode Switcher */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs flex flex-wrap items-center justify-between gap-3">
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

        <button
          type="button"
          onClick={handleRestartGame}
          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-200 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ml-auto sm:ml-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Game</span>
        </button>
      </div>

      {/* Live Turn & Status Banner */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs flex items-center justify-between">
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
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs ${
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
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col items-center">
        <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-[360px] aspect-square">
          {board.map((cell, idx) => {
            const isWinningCell = winningLine?.includes(idx);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleCellClick(idx)}
                disabled={Boolean(cell || isGameOver || isAiThinking)}
                className={`relative aspect-square rounded-2xl sm:rounded-3xl flex items-center justify-center font-black transition-all cursor-pointer ${
                  isWinningCell
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-105 ring-4 ring-emerald-400/30'
                    : cell
                    ? 'bg-slate-100 dark:bg-black/40 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10'
                    : 'bg-slate-50 dark:bg-[#18181b] hover:bg-blue-50/60 dark:hover:bg-white/5 border border-slate-200/80 dark:border-white/10 active:scale-95'
                }`}
              >
                {cell === 'X' && (
                  <span className={`text-4xl sm:text-5xl font-black ${isWinningCell ? 'text-white' : 'text-blue-600 dark:text-sky-400 animate-in zoom-in-50 duration-150'}`}>
                    &times;
                  </span>
                )}
                {cell === 'O' && (
                  <span className={`text-4xl sm:text-5xl font-black ${isWinningCell ? 'text-white' : 'text-rose-600 dark:text-rose-400 animate-in zoom-in-50 duration-150'}`}>
                    &#9675;
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Score Tracking Card */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs space-y-3">
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
