import React, { useState, useEffect } from 'react';
import {
  Code,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Trophy,
  ArrowRight,
  RotateCcw,
  Sliders,
  Play,
  Lightbulb,
  Award,
  Check,
} from 'lucide-react';

interface Level {
  id: number;
  title: string;
  description: string;
  items: Array<{ id: number; label: string; color: string }>;
  targetConfig: {
    justifyContent: string;
    alignItems: string;
    flexDirection: string;
    flexWrap: string;
    gap: string;
  };
  allowedControls: {
    justifyContent?: boolean;
    alignItems?: boolean;
    flexDirection?: boolean;
    flexWrap?: boolean;
    gap?: boolean;
  };
  hint: string;
  explanation: string;
}

const LEVELS: Level[] = [
  {
    id: 1,
    title: 'Level 1: Horizontal Center',
    description: 'Move the designer cards to the exact horizontal center of the showcase container.',
    items: [
      { id: 1, label: 'Logo', color: 'bg-blue-500' },
      { id: 2, label: 'Font', color: 'bg-indigo-500' },
      { id: 3, label: 'Color', color: 'bg-purple-500' },
    ],
    targetConfig: {
      justifyContent: 'center',
      alignItems: 'flex-start',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      gap: '8px',
    },
    allowedControls: { justifyContent: true },
    hint: 'Use justify-content to align items along the primary (horizontal) axis.',
    explanation: 'justify-content: center aligns all flex items along the center of the main axis.',
  },
  {
    id: 2,
    title: 'Level 2: Align to the End',
    description: 'Send all portfolio items to the far right edge of the artboard.',
    items: [
      { id: 1, label: 'Mockup', color: 'bg-emerald-500' },
      { id: 2, label: 'Print', color: 'bg-teal-500' },
    ],
    targetConfig: {
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      gap: '8px',
    },
    allowedControls: { justifyContent: true },
    hint: 'Which justify-content value pushes elements all the way to the end?',
    explanation: 'justify-content: flex-end packs items toward the end of the flex container.',
  },
  {
    id: 3,
    title: 'Level 3: Space Between Items',
    description: 'Distribute the items evenly so the first card is at the start and the last is at the end.',
    items: [
      { id: 1, label: 'Header', color: 'bg-amber-500' },
      { id: 2, label: 'Body', color: 'bg-orange-500' },
      { id: 3, label: 'Footer', color: 'bg-rose-500' },
    ],
    targetConfig: {
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      gap: '0px',
    },
    allowedControls: { justifyContent: true },
    hint: 'Look for a spacing property that puts maximum space between the elements.',
    explanation: 'justify-content: space-between places equal spacing between children, touching both outer edges.',
  },
  {
    id: 4,
    title: 'Level 4: Vertical Alignment',
    description: 'Center the elements vertically along the cross-axis.',
    items: [
      { id: 1, label: 'UX', color: 'bg-sky-500' },
      { id: 2, label: 'UI', color: 'bg-blue-600' },
    ],
    targetConfig: {
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      gap: '8px',
    },
    allowedControls: { alignItems: true },
    hint: 'align-items controls positioning on the cross (vertical) axis.',
    explanation: 'align-items: center centers flex items along the cross axis.',
  },
  {
    id: 5,
    title: 'Level 5: The Holy Grail Center',
    description: 'Place the elements dead center in the container both horizontally and vertically.',
    items: [
      { id: 1, label: 'Masterpiece', color: 'bg-gradient-to-tr from-purple-600 to-pink-500' },
    ],
    targetConfig: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      gap: '0px',
    },
    allowedControls: { justifyContent: true, alignItems: true },
    hint: 'Combine justify-content: center with align-items: center.',
    explanation: 'Combining justify-content: center and align-items: center creates perfect two-axis centering!',
  },
  {
    id: 6,
    title: 'Level 6: Column Flow Direction',
    description: 'Stack the blocks vertically in a column and align them to the bottom.',
    items: [
      { id: 1, label: 'Step 1', color: 'bg-indigo-500' },
      { id: 2, label: 'Step 2', color: 'bg-violet-500' },
      { id: 3, label: 'Step 3', color: 'bg-purple-600' },
    ],
    targetConfig: {
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
      flexDirection: 'column',
      flexWrap: 'nowrap',
      gap: '8px',
    },
    allowedControls: { flexDirection: true, justifyContent: true },
    hint: 'Set flex-direction to column first; then justify-content controls the vertical axis.',
    explanation: 'When flex-direction is column, the main axis becomes vertical, so justify-content: flex-end moves items to the bottom.',
  },
  {
    id: 7,
    title: 'Level 7: Space Evenly with Gap',
    description: 'Distribute items with equal padding around them and a noticeable gap.',
    items: [
      { id: 1, label: 'Icon A', color: 'bg-emerald-600' },
      { id: 2, label: 'Icon B', color: 'bg-teal-600' },
      { id: 3, label: 'Icon C', color: 'bg-cyan-600' },
    ],
    targetConfig: {
      justifyContent: 'space-evenly',
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      gap: '16px',
    },
    allowedControls: { justifyContent: true, alignItems: true, gap: true },
    hint: 'Set justify-content to space-evenly, center vertically, and set gap to 16px.',
    explanation: 'space-evenly ensures equal margins between items and container edges, plus gap for explicit spacing.',
  },
  {
    id: 8,
    title: 'Level 8: Multi-line Flex Wrapping',
    description: 'Wrap the elements across multiple lines and center them.',
    items: [
      { id: 1, label: 'Plate 1', color: 'bg-rose-500' },
      { id: 2, label: 'Plate 2', color: 'bg-pink-500' },
      { id: 3, label: 'Plate 3', color: 'bg-fuchsia-500' },
      { id: 4, label: 'Plate 4', color: 'bg-purple-500' },
      { id: 5, label: 'Plate 5', color: 'bg-violet-500' },
    ],
    targetConfig: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: '12px',
    },
    allowedControls: { flexWrap: true, justifyContent: true, alignItems: true, gap: true },
    hint: 'Enable flex-wrap: wrap so overflowing cards form a second row.',
    explanation: 'flex-wrap: wrap allows flex items to break into multiple lines when they exceed container width.',
  },
];

const STORAGE_KEY_LEVEL = 'flexbox_challenge_highest_level';

export const FlexboxChallenge: React.FC = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LEVEL);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const level = LEVELS[currentLevelIndex];

  // User input states
  const [userJustify, setUserJustify] = useState<string>('flex-start');
  const [userAlign, setUserAlign] = useState<string>('flex-start');
  const [userDirection, setUserDirection] = useState<string>('row');
  const [userWrap, setUserWrap] = useState<string>('nowrap');
  const [userGap, setUserGap] = useState<string>('8px');

  // Status feedback
  const [validationResult, setValidationResult] = useState<{
    status: 'CORRECT' | 'INCORRECT' | null;
    message?: string;
  }>({ status: null });

  const [showHint, setShowHint] = useState<boolean>(false);

  // Reset inputs when switching levels
  useEffect(() => {
    setUserJustify('flex-start');
    setUserAlign('flex-start');
    setUserDirection('row');
    setUserWrap('nowrap');
    setUserGap('8px');
    setValidationResult({ status: null });
    setShowHint(false);
  }, [currentLevelIndex]);

  const handleCheckAnswer = () => {
    const target = level.targetConfig;
    const isJustifyMatch = !level.allowedControls.justifyContent || userJustify === target.justifyContent;
    const isAlignMatch = !level.allowedControls.alignItems || userAlign === target.alignItems;
    const isDirectionMatch = !level.allowedControls.flexDirection || userDirection === target.flexDirection;
    const isWrapMatch = !level.allowedControls.flexWrap || userWrap === target.flexWrap;
    const isGapMatch = !level.allowedControls.gap || userGap === target.gap;

    if (isJustifyMatch && isAlignMatch && isDirectionMatch && isWrapMatch && isGapMatch) {
      setValidationResult({
        status: 'CORRECT',
        message: 'Correct! You aligned the flex elements perfectly.',
      });

      if (!completedLevels.includes(level.id)) {
        const next = [...completedLevels, level.id];
        setCompletedLevels(next);
        try {
          localStorage.setItem(STORAGE_KEY_LEVEL, JSON.stringify(next));
        } catch {}
      }
    } else {
      let feedback = 'Not quite aligned with the target layout.';
      if (level.allowedControls.justifyContent && userJustify !== target.justifyContent) {
        feedback = 'Check your justify-content value.';
      } else if (level.allowedControls.alignItems && userAlign !== target.alignItems) {
        feedback = 'Check your align-items value along the cross axis.';
      } else if (level.allowedControls.flexDirection && userDirection !== target.flexDirection) {
        feedback = 'Check your flex-direction property.';
      } else if (level.allowedControls.gap && userGap !== target.gap) {
        feedback = 'Adjust your gap size.';
      }
      setValidationResult({ status: 'INCORRECT', message: feedback });
    }
  };

  const handleNextLevel = () => {
    if (currentLevelIndex < LEVELS.length - 1) {
      setCurrentLevelIndex(currentLevelIndex + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Level Selector Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">{level.title}</h2>
              {completedLevels.includes(level.id) && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/40">
                  <Check className="w-3 h-3" />
                  <span>Passed</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{level.description}</p>
          </div>
        </div>

        {/* Level pills */}
        <div className="flex items-center gap-1">
          {LEVELS.map((lvl, idx) => {
            const isCompleted = completedLevels.includes(lvl.id);
            const isCurrent = idx === currentLevelIndex;
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => setCurrentLevelIndex(idx)}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-xs scale-105'
                    : isCompleted
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {lvl.id}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Play Area: Target Layout vs Player Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* 1. Target Layout (Goal) */}
        <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Target Layout (Goal)</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">Match this position</span>
          </div>

          {/* Visual Target Area */}
          <div
            style={{
              display: 'flex',
              justifyContent: level.targetConfig.justifyContent,
              alignItems: level.targetConfig.alignItems,
              flexDirection: level.targetConfig.flexDirection as any,
              flexWrap: level.targetConfig.flexWrap as any,
              gap: level.targetConfig.gap,
              minHeight: '220px',
            }}
            className="w-full p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/10 border-2 border-dashed border-amber-300 dark:border-amber-800/40 relative overflow-hidden"
          >
            {level.items.map((item) => (
              <div
                key={item.id}
                className="px-3.5 py-2.5 rounded-xl border border-dashed border-amber-400 dark:border-amber-600/60 text-amber-800 dark:text-amber-200 text-xs font-bold shadow-xs bg-amber-100/60 dark:bg-amber-900/30 shrink-0"
              >
                {item.label} (Target)
              </div>
            ))}
          </div>

          <div className="text-[11px] text-slate-400 font-mono">
            Goal: Position your blocks so they line up with these target slots.
          </div>
        </div>

        {/* 2. Player Active Workspace */}
        <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-bold text-blue-600 dark:text-sky-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              <span>Your Live Workspace</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">Updates in real time</span>
          </div>

          {/* Live User Flex Container */}
          <div
            style={{
              display: 'flex',
              justifyContent: userJustify,
              alignItems: userAlign,
              flexDirection: userDirection as any,
              flexWrap: userWrap as any,
              gap: userGap,
              minHeight: '220px',
            }}
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-[#121212] border-2 border-blue-500/40 dark:border-sky-500/40 relative overflow-hidden transition-all"
          >
            {level.items.map((item) => (
              <div
                key={item.id}
                className={`px-3.5 py-2.5 rounded-xl text-white text-xs font-bold shadow-md shrink-0 transition-all ${item.color}`}
              >
                {item.label}
              </div>
            ))}
          </div>

          {/* Code preview string */}
          <div className="p-2.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto">
            <code>
              display: flex; justify-content: {userJustify}; align-items: {userAlign}; flexDirection: {userDirection}; gap: {userGap};
            </code>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Code Playground */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs space-y-5">
        <span className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white block">
          Flexbox Property Controls
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* justify-content */}
          {level.allowedControls.justifyContent && (
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 block">
                justify-content:
              </label>
              <select
                value={userJustify}
                onChange={(e) => setUserJustify(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 font-mono cursor-pointer"
              >
                <option value="flex-start">flex-start</option>
                <option value="center">center</option>
                <option value="flex-end">flex-end</option>
                <option value="space-between">space-between</option>
                <option value="space-around">space-around</option>
                <option value="space-evenly">space-evenly</option>
              </select>
            </div>
          )}

          {/* align-items */}
          {level.allowedControls.alignItems && (
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 block">
                align-items:
              </label>
              <select
                value={userAlign}
                onChange={(e) => setUserAlign(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 font-mono cursor-pointer"
              >
                <option value="flex-start">flex-start</option>
                <option value="center">center</option>
                <option value="flex-end">flex-end</option>
                <option value="stretch">stretch</option>
                <option value="baseline">baseline</option>
              </select>
            </div>
          )}

          {/* flex-direction */}
          {level.allowedControls.flexDirection && (
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 block">
                flex-direction:
              </label>
              <select
                value={userDirection}
                onChange={(e) => setUserDirection(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 font-mono cursor-pointer"
              >
                <option value="row">row</option>
                <option value="row-reverse">row-reverse</option>
                <option value="column">column</option>
                <option value="column-reverse">column-reverse</option>
              </select>
            </div>
          )}

          {/* flex-wrap */}
          {level.allowedControls.flexWrap && (
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 block">
                flex-wrap:
              </label>
              <select
                value={userWrap}
                onChange={(e) => setUserWrap(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 font-mono cursor-pointer"
              >
                <option value="nowrap">nowrap</option>
                <option value="wrap">wrap</option>
                <option value="wrap-reverse">wrap-reverse</option>
              </select>
            </div>
          )}

          {/* gap */}
          {level.allowedControls.gap && (
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 block">
                gap:
              </label>
              <select
                value={userGap}
                onChange={(e) => setUserGap(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 font-mono cursor-pointer"
              >
                <option value="0px">0px</option>
                <option value="8px">8px</option>
                <option value="12px">12px</option>
                <option value="16px">16px</option>
                <option value="24px">24px</option>
              </select>
            </div>
          )}
        </div>

        {/* Validation result feedback & Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCheckAnswer}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition-all cursor-pointer flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Check Answer</span>
            </button>

            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>{showHint ? 'Hide Hint' : 'Hint'}</span>
            </button>
          </div>

          {validationResult.status === 'CORRECT' && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>{validationResult.message}</span>
              </div>
              {currentLevelIndex < LEVELS.length - 1 && (
                <button
                  type="button"
                  onClick={handleNextLevel}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Next Level</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {validationResult.status === 'INCORRECT' && (
            <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-semibold text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationResult.message}</span>
            </div>
          )}
        </div>

        {/* Hint Box */}
        {showHint && (
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2 animate-in fade-in-50">
            <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <div className="space-y-1">
              <strong className="block">Hint for {level.title}:</strong>
              <p>{level.hint}</p>
            </div>
          </div>
        )}

        {/* Explanation box on pass */}
        {validationResult.status === 'CORRECT' && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-900 dark:text-emerald-200 space-y-1 animate-in fade-in-50">
            <strong className="block text-emerald-800 dark:text-emerald-300">
              Why this works:
            </strong>
            <p>{level.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};
