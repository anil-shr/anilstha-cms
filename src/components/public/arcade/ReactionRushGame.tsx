import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Zap,
  Play,
  RotateCcw,
  Trophy,
  AlertTriangle,
  Timer,
  CheckCircle2,
  Sparkles,
  Award,
  Flame,
  ArrowRight,
} from 'lucide-react';

type GameState = 'IDLE' | 'WAITING' | 'READY' | 'FALSE_START' | 'ROUND_RESULT' | 'GAME_OVER';

interface RoundResult {
  round: number;
  timeMs: number;
}

const TOTAL_ROUNDS = 5;
const STORAGE_KEY_BEST = 'reaction_rush_best_score';

export const ReactionRushGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('IDLE');
  const [currentRound, setCurrentRound] = useState(1);
  const [rounds, setRounds] = useState<RoundResult[]>([]);
  const [lastTimeMs, setLastTimeMs] = useState<number | null>(null);
  const [allTimeBest, setAllTimeBest] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BEST);
      return saved ? parseInt(saved, 10) : null;
    } catch {
      return null;
    }
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Clear pending timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const getRating = (ms: number): { label: string; color: string; desc: string } => {
    if (ms < 200) return { label: 'Godlike Reflexes', color: 'text-purple-500 dark:text-purple-400', desc: 'Faster than 99% of humans!' };
    if (ms < 240) return { label: 'Esports Pro', color: 'text-emerald-500 dark:text-emerald-400', desc: 'Lightning quick reflexes.' };
    if (ms < 280) return { label: 'Sharp & Agile', color: 'text-blue-500 dark:text-sky-400', desc: 'Well above average human speed.' };
    if (ms < 350) return { label: 'Good Reaction', color: 'text-amber-500 dark:text-amber-400', desc: 'Standard human reaction time.' };
    return { label: 'Slow & Steady', color: 'text-slate-500 dark:text-slate-400', desc: 'A bit sluggish, have some coffee!' };
  };

  const startRound = useCallback(() => {
    setGameState('WAITING');
    setLastTimeMs(null);

    // Random delay between 1.5s and 4.5s
    const randomDelay = Math.floor(Math.random() * 3000) + 1500;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      startTimeRef.current = performance.now();
      setGameState('READY');
    }, randomDelay);
  }, []);

  const handleStartGame = () => {
    setCurrentRound(1);
    setRounds([]);
    startRound();
  };

  const handleAreaClick = () => {
    if (gameState === 'IDLE') {
      handleStartGame();
      return;
    }

    if (gameState === 'WAITING') {
      // False start! Clicked too early
      if (timerRef.current) clearTimeout(timerRef.current);
      setGameState('FALSE_START');
      return;
    }

    if (gameState === 'READY') {
      const elapsed = Math.round(performance.now() - startTimeRef.current);
      setLastTimeMs(elapsed);

      const newRounds = [...rounds, { round: currentRound, timeMs: elapsed }];
      setRounds(newRounds);

      if (currentRound >= TOTAL_ROUNDS) {
        // Calculate average and save best
        const bestInRun = Math.min(...newRounds.map((r) => r.timeMs));
        if (!allTimeBest || bestInRun < allTimeBest) {
          setAllTimeBest(bestInRun);
          try {
            localStorage.setItem(STORAGE_KEY_BEST, bestInRun.toString());
          } catch {}
        }
        setGameState('GAME_OVER');
      } else {
        setGameState('ROUND_RESULT');
      }
      return;
    }

    if (gameState === 'FALSE_START') {
      // Retry this same round
      startRound();
      return;
    }

    if (gameState === 'ROUND_RESULT') {
      setCurrentRound((prev) => prev + 1);
      startRound();
      return;
    }

    if (gameState === 'GAME_OVER') {
      handleStartGame();
    }
  };

  // Keyboard spacebar listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleAreaClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, rounds, currentRound]);

  const averageTime =
    rounds.length > 0
      ? Math.round(rounds.reduce((acc, r) => acc + r.timeMs, 0) / rounds.length)
      : null;

  const bestInRun =
    rounds.length > 0 ? Math.min(...rounds.map((r) => r.timeMs)) : null;

  return (
    <div className="space-y-6">
      {/* Game Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Reaction Rush</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Test your neural processing latency across 5 rounds. Click or press [Space].
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {allTimeBest && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-xs font-bold text-amber-700 dark:text-amber-300">
              <Trophy className="w-3.5 h-3.5" />
              <span>Record: {allTimeBest} ms</span>
            </div>
          )}

          {gameState !== 'IDLE' && (
            <button
              type="button"
              onClick={() => {
                if (timerRef.current) clearTimeout(timerRef.current);
                setGameState('IDLE');
                setRounds([]);
                setCurrentRound(1);
              }}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/15 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Screen */}
      <div
        ref={containerRef}
        onClick={handleAreaClick}
        tabIndex={0}
        role="button"
        aria-label="Reaction test target area. Click or press spacebar."
        className={`relative w-full min-h-[360px] sm:min-h-[420px] rounded-3xl p-6 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer select-none transition-all duration-150 outline-none focus:ring-4 focus:ring-blue-500/30 overflow-hidden shadow-lg ${
          gameState === 'IDLE'
            ? 'bg-gradient-to-b from-slate-900 to-slate-950 text-white border border-slate-800'
            : gameState === 'WAITING'
            ? 'bg-rose-600 dark:bg-rose-700 text-white animate-pulse'
            : gameState === 'READY'
            ? 'bg-emerald-500 dark:bg-emerald-600 text-white scale-[1.01]'
            : gameState === 'FALSE_START'
            ? 'bg-amber-600 dark:bg-amber-700 text-white'
            : gameState === 'ROUND_RESULT'
            ? 'bg-slate-900 text-white border border-slate-800'
            : 'bg-gradient-to-b from-slate-900 to-[#12121e] text-white border border-slate-800'
        }`}
      >
        {/* State: IDLE */}
        {gameState === 'IDLE' && (
          <div className="space-y-6 max-w-md pointer-events-none">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 mx-auto flex items-center justify-center text-amber-400 shadow-xl">
              <Zap className="w-8 h-8 animate-bounce" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight">Ready to Test Your Speed?</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                When the screen turns <span className="text-rose-400 font-bold">RED</span>, wait patiently.
                The second it flashes <span className="text-emerald-400 font-bold">GREEN</span>, click as fast as humanly possible!
              </p>
            </div>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-600/40">
                <Play className="w-4 h-4 fill-white" />
                <span>Click Anywhere to Start</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400">5 Rounds · Accurate to 1 Millisecond · Mobile Touch Supported</p>
          </div>
        )}

        {/* State: WAITING (Red Screen) */}
        {gameState === 'WAITING' && (
          <div className="space-y-4 pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-white/20 mx-auto flex items-center justify-center">
              <Timer className="w-8 h-8 text-white animate-spin" />
            </div>
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest font-black text-rose-200">Round {currentRound} of {TOTAL_ROUNDS}</span>
              <h3 className="text-3xl sm:text-5xl font-black tracking-tight">HOLD ON...</h3>
            </div>
            <p className="text-sm text-rose-100 font-medium">Wait for the screen to turn GREEN before clicking!</p>
          </div>
        )}

        {/* State: READY (Green Screen) */}
        {gameState === 'READY' && (
          <div className="space-y-4 pointer-events-none">
            <div className="w-20 h-20 rounded-full bg-white text-emerald-600 mx-auto flex items-center justify-center shadow-2xl animate-ping">
              <Zap className="w-10 h-10 fill-emerald-600" />
            </div>
            <h3 className="text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-md">
              CLICK NOW!
            </h3>
            <p className="text-sm text-emerald-100 font-bold">SMASH IT!</p>
          </div>
        )}

        {/* State: FALSE START */}
        {gameState === 'FALSE_START' && (
          <div className="space-y-4 max-w-md pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-white/20 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl sm:text-3xl font-black">TOO EARLY!</h3>
              <p className="text-sm text-amber-100">
                You clicked while the screen was still red. Anticipating the signal results in a penalty!
              </p>
            </div>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-amber-900 font-bold text-xs shadow-md">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Click to Retry Round {currentRound}</span>
              </span>
            </div>
          </div>
        )}

        {/* State: ROUND RESULT */}
        {gameState === 'ROUND_RESULT' && lastTimeMs !== null && (
          <div className="space-y-5 max-w-md pointer-events-none">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Round {currentRound} Score</span>
              <div className="text-5xl sm:text-6xl font-mono font-black text-emerald-400 tracking-tight">
                {lastTimeMs} <span className="text-2xl font-sans text-slate-400 font-medium">ms</span>
              </div>
            </div>

            {(() => {
              const rating = getRating(lastTimeMs);
              return (
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-0.5">
                  <div className={`text-sm font-bold ${rating.color}`}>{rating.label}</div>
                  <div className="text-xs text-slate-400">{rating.desc}</div>
                </div>
              );
            })()}

            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 text-white font-bold text-xs shadow-lg">
                <span>Next Round ({currentRound + 1}/{TOTAL_ROUNDS})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Click or press Space to proceed</p>
          </div>
        )}

        {/* State: GAME OVER (Final Summary) */}
        {gameState === 'GAME_OVER' && (
          <div className="space-y-6 max-w-lg pointer-events-none py-2">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 mx-auto flex items-center justify-center text-amber-400 shadow-xl">
              <Trophy className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">5-Round Series Complete</span>
              <h3 className="text-3xl sm:text-4xl font-black">Your Reaction Summary</h3>
            </div>

            {/* Key stats grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Average Time</span>
                <span className="text-3xl font-mono font-black text-white mt-1 block">
                  {averageTime} <span className="text-xs text-slate-400 font-sans">ms</span>
                </span>
                {averageTime && (
                  <span className={`text-[11px] font-semibold mt-1 block ${getRating(averageTime).color}`}>
                    {getRating(averageTime).label}
                  </span>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Fastest Round</span>
                <span className="text-3xl font-mono font-black text-emerald-400 mt-1 block">
                  {bestInRun} <span className="text-xs text-slate-400 font-sans">ms</span>
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">Peak Latency</span>
              </div>
            </div>

            {/* Breakdown pills */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {rounds.map((r) => (
                <div key={r.round} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
                  R{r.round}: <strong className="text-white">{r.timeMs}ms</strong>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30">
                <RotateCcw className="w-4 h-4" />
                <span>Play Again (Retry 5 Rounds)</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Rounds Progression Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Rounds Progress:</span>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: TOTAL_ROUNDS }).map((_, idx) => {
              const rNum = idx + 1;
              const completed = rounds.find((r) => r.round === rNum);
              const isCurrent = currentRound === rNum && gameState !== 'GAME_OVER';
              return (
                <div
                  key={rNum}
                  className={`w-7 h-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center transition-all ${
                    completed
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : isCurrent
                      ? 'bg-blue-600 text-white ring-2 ring-blue-500/30 animate-pulse'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-400 border border-slate-200 dark:border-white/10'
                  }`}
                  title={completed ? `Round ${rNum}: ${completed.timeMs}ms` : `Round ${rNum}`}
                >
                  {completed ? completed.timeMs : rNum}
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Tip: Rest your fingers and focus on the center dot for maximum speed.
        </div>
      </div>
    </div>
  );
};
