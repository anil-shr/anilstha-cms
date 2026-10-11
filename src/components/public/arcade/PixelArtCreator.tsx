import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Paintbrush,
  Eraser,
  PaintBucket,
  Pipette,
  Undo2,
  Redo2,
  Trash2,
  Download,
  Grid,
  Sparkles,
  Check,
  Copy,
  RotateCcw,
  ExternalLink,
  Layers,
  ZoomIn,
} from 'lucide-react';

type ToolType = 'PEN' | 'ERASER' | 'FILL' | 'EYEDROPPER';
type GridSize = 8 | 16 | 24 | 32;

// Curated designer color swatches
const PALETTES = [
  {
    name: 'Retro Arcade',
    colors: [
      '#000000',
      '#ffffff',
      '#e11d48',
      '#f97316',
      '#eab308',
      '#22c55e',
      '#06b6d4',
      '#3b82f6',
      '#8b5cf6',
      '#ec4899',
      '#78716c',
      '#334155',
    ],
  },
  {
    name: 'GameBoy Classic',
    colors: ['#0f380f', '#306230', '#8bac0f', '#9bbc0f', '#ffffff', '#000000'],
  },
  {
    name: 'Cyberpunk Neon',
    colors: [
      '#0d0221',
      '#0f084b',
      '#26408b',
      '#a6cfd5',
      '#c2e7d9',
      '#ff007f',
      '#00f0ff',
      '#ffe600',
    ],
  },
  {
    name: 'Pastel Dream',
    colors: [
      '#ffb3ba',
      '#ffdfba',
      '#ffffba',
      '#baffc9',
      '#bae1ff',
      '#e8dff5',
      '#fce1e4',
      '#daeaf6',
    ],
  },
];

// Curated templates
const TEMPLATES: Record<
  string,
  { label: string; size: GridSize; pixels: Record<string, string> }
> = {
  heart: {
    label: 'Pixel Heart',
    size: 16,
    pixels: {
      '3,4': '#e11d48',
      '3,5': '#e11d48',
      '3,9': '#e11d48',
      '3,10': '#e11d48',
      '4,3': '#e11d48',
      '4,4': '#e11d48',
      '4,5': '#e11d48',
      '4,6': '#e11d48',
      '4,8': '#e11d48',
      '4,9': '#e11d48',
      '4,10': '#e11d48',
      '4,11': '#e11d48',
      '5,2': '#e11d48',
      '5,3': '#e11d48',
      '5,4': '#fb7185',
      '5,5': '#e11d48',
      '5,6': '#e11d48',
      '5,7': '#e11d48',
      '5,8': '#e11d48',
      '5,9': '#e11d48',
      '5,10': '#e11d48',
      '5,11': '#e11d48',
      '5,12': '#e11d48',
      '6,2': '#e11d48',
      '6,3': '#fb7185',
      '6,4': '#ffffff',
      '6,5': '#fb7185',
      '6,6': '#e11d48',
      '6,7': '#e11d48',
      '6,8': '#e11d48',
      '6,9': '#e11d48',
      '6,10': '#e11d48',
      '6,11': '#e11d48',
      '6,12': '#e11d48',
      '7,2': '#e11d48',
      '7,3': '#e11d48',
      '7,4': '#fb7185',
      '7,5': '#e11d48',
      '7,6': '#e11d48',
      '7,7': '#e11d48',
      '7,8': '#e11d48',
      '7,9': '#e11d48',
      '7,10': '#e11d48',
      '7,11': '#e11d48',
      '7,12': '#e11d48',
      '8,3': '#e11d48',
      '8,4': '#e11d48',
      '8,5': '#e11d48',
      '8,6': '#e11d48',
      '8,7': '#e11d48',
      '8,8': '#e11d48',
      '8,9': '#e11d48',
      '8,10': '#e11d48',
      '8,11': '#e11d48',
      '9,4': '#e11d48',
      '9,5': '#e11d48',
      '9,6': '#e11d48',
      '9,7': '#e11d48',
      '9,8': '#e11d48',
      '9,9': '#e11d48',
      '9,10': '#e11d48',
      '10,5': '#e11d48',
      '10,6': '#e11d48',
      '10,7': '#e11d48',
      '10,8': '#e11d48',
      '10,9': '#e11d48',
      '11,6': '#e11d48',
      '11,7': '#e11d48',
      '11,8': '#e11d48',
      '12,7': '#e11d48',
    },
  },
  sword: {
    label: 'Hero Sword',
    size: 16,
    pixels: {
      '2,12': '#38bdf8',
      '2,13': '#bae6fd',
      '3,11': '#38bdf8',
      '3,12': '#38bdf8',
      '4,10': '#38bdf8',
      '4,11': '#38bdf8',
      '5,9': '#38bdf8',
      '5,10': '#38bdf8',
      '6,8': '#38bdf8',
      '6,9': '#38bdf8',
      '7,7': '#38bdf8',
      '7,8': '#38bdf8',
      '8,6': '#38bdf8',
      '8,7': '#38bdf8',
      '9,5': '#f59e0b',
      '9,7': '#f59e0b',
      '10,4': '#f59e0b',
      '10,5': '#f59e0b',
      '10,6': '#f59e0b',
      '11,3': '#78350f',
      '11,5': '#f59e0b',
      '12,2': '#78350f',
      '13,1': '#f59e0b',
    },
  },
  star: {
    label: 'Gold Star',
    size: 16,
    pixels: {
      '2,7': '#eab308',
      '3,7': '#fde047',
      '4,6': '#eab308',
      '4,7': '#fde047',
      '4,8': '#eab308',
      '5,3': '#eab308',
      '5,4': '#eab308',
      '5,5': '#fde047',
      '5,6': '#fde047',
      '5,7': '#fde047',
      '5,8': '#fde047',
      '5,9': '#fde047',
      '5,10': '#eab308',
      '5,11': '#eab308',
      '6,4': '#eab308',
      '6,5': '#fde047',
      '6,6': '#fde047',
      '6,7': '#fde047',
      '6,8': '#fde047',
      '6,9': '#fde047',
      '6,10': '#eab308',
      '7,5': '#eab308',
      '7,6': '#fde047',
      '7,7': '#fde047',
      '7,8': '#fde047',
      '7,9': '#eab308',
      '8,6': '#eab308',
      '8,7': '#fde047',
      '8,8': '#eab308',
      '9,5': '#eab308',
      '9,7': '#fde047',
      '9,9': '#eab308',
      '10,4': '#eab308',
      '10,5': '#fde047',
      '10,9': '#fde047',
      '10,10': '#eab308',
      '11,3': '#eab308',
      '11,11': '#eab308',
    },
  },
  smiley: {
    label: 'Retro Smiley',
    size: 16,
    pixels: {
      '3,6': '#facc15',
      '3,7': '#facc15',
      '3,8': '#facc15',
      '3,9': '#facc15',
      '4,4': '#facc15',
      '4,5': '#facc15',
      '4,6': '#facc15',
      '4,7': '#facc15',
      '4,8': '#facc15',
      '4,9': '#facc15',
      '4,10': '#facc15',
      '4,11': '#facc15',
      '5,3': '#facc15',
      '5,4': '#facc15',
      '5,5': '#0f172a',
      '5,6': '#facc15',
      '5,7': '#facc15',
      '5,8': '#facc15',
      '5,9': '#facc15',
      '5,10': '#0f172a',
      '5,11': '#facc15',
      '5,12': '#facc15',
      '6,3': '#facc15',
      '6,4': '#facc15',
      '6,5': '#0f172a',
      '6,6': '#facc15',
      '6,7': '#facc15',
      '6,8': '#facc15',
      '6,9': '#facc15',
      '6,10': '#0f172a',
      '6,11': '#facc15',
      '6,12': '#facc15',
      '7,3': '#facc15',
      '7,4': '#facc15',
      '7,5': '#facc15',
      '7,6': '#facc15',
      '7,7': '#facc15',
      '7,8': '#facc15',
      '7,9': '#facc15',
      '7,10': '#facc15',
      '7,11': '#facc15',
      '7,12': '#facc15',
      '8,3': '#facc15',
      '8,4': '#facc15',
      '8,5': '#facc15',
      '8,6': '#facc15',
      '8,7': '#facc15',
      '8,8': '#facc15',
      '8,9': '#facc15',
      '8,10': '#facc15',
      '8,11': '#facc15',
      '8,12': '#facc15',
      '9,3': '#facc15',
      '9,4': '#facc15',
      '9,5': '#0f172a',
      '9,6': '#facc15',
      '9,7': '#facc15',
      '9,8': '#facc15',
      '9,9': '#facc15',
      '9,10': '#0f172a',
      '9,11': '#facc15',
      '9,12': '#facc15',
      '10,3': '#facc15',
      '10,4': '#facc15',
      '10,5': '#facc15',
      '10,6': '#0f172a',
      '10,7': '#0f172a',
      '10,8': '#0f172a',
      '10,9': '#0f172a',
      '10,10': '#facc15',
      '10,11': '#facc15',
      '10,12': '#facc15',
      '11,4': '#facc15',
      '11,5': '#facc15',
      '11,6': '#facc15',
      '11,7': '#facc15',
      '11,8': '#facc15',
      '11,9': '#facc15',
      '11,10': '#facc15',
      '11,11': '#facc15',
      '12,6': '#facc15',
      '12,7': '#facc15',
      '12,8': '#facc15',
      '12,9': '#facc15',
    },
  },
};

export const PixelArtCreator: React.FC = () => {
  const [gridSize, setGridSize] = useState<GridSize>(16);
  // Grid state: Key "r,c" => color
  const [grid, setGrid] = useState<Record<string, string>>(() => ({ ...TEMPLATES.heart.pixels }));
  const gridRef = useRef<Record<string, string>>({ ...TEMPLATES.heart.pixels });

  const [currentColor, setCurrentColor] = useState<string>('#e11d48');
  const [activeTool, setActiveTool] = useState<ToolType>('PEN');
  const [showGridLines, setShowGridLines] = useState<boolean>(true);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const isDrawingRef = useRef<boolean>(false);
  const strokeDirtyRef = useRef<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Undo / Redo history
  const [history, setHistory] = useState<Array<Record<string, string>>>([
    { ...TEMPLATES.heart.pixels },
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const historyIndexRef = useRef<number>(0);

  // Clear confirmation modal
  const [showClearModal, setShowClearModal] = useState<boolean>(false);

  // Export Modal state & Blob URL
  const [exportPreviewUrl, setExportPreviewUrl] = useState<string | null>(null);
  const [exportBlobUrl, setExportBlobUrl] = useState<string | null>(null);
  const [copiedDataUrl, setCopiedDataUrl] = useState<boolean>(false);
  const [copiedImage, setCopiedImage] = useState<boolean>(false);

  // Keep gridRef and historyIndexRef in sync
  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  useEffect(() => {
    historyIndexRef.current = historyIndex;
  }, [historyIndex]);

  useEffect(() => {
    isDrawingRef.current = isDrawing;
  }, [isDrawing]);

  const showToast = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(''), 2500);
  };

  // Push new state to history
  const pushState = useCallback((newGrid: Record<string, string>) => {
    setGrid(newGrid);
    gridRef.current = newGrid;

    setHistory((prev) => {
      const idx = historyIndexRef.current;
      const sliced = prev.slice(0, idx + 1);
      return [...sliced, newGrid];
    });

    setHistoryIndex((prev) => prev + 1);
  }, []);

  // Reliable Undo
  const handleUndo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      const newIndex = historyIndexRef.current - 1;
      const targetState = history[newIndex] || {};
      setHistoryIndex(newIndex);
      historyIndexRef.current = newIndex;
      setGrid(targetState);
      gridRef.current = targetState;
      showToast('Undone ✓');
    }
  }, [history]);

  // Reliable Redo
  const handleRedo = useCallback(() => {
    if (historyIndexRef.current < history.length - 1) {
      const newIndex = historyIndexRef.current + 1;
      const targetState = history[newIndex] || {};
      setHistoryIndex(newIndex);
      historyIndexRef.current = newIndex;
      setGrid(targetState);
      gridRef.current = targetState;
      showToast('Redone ✓');
    }
  }, [history]);

  // Global mouse up / touch end listener so drawing never gets stuck
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDrawingRef.current) {
        setIsDrawing(false);
        isDrawingRef.current = false;
        if (strokeDirtyRef.current) {
          strokeDirtyRef.current = false;
          pushState({ ...gridRef.current });
        }
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, [pushState]);

  // Keyboard shortcuts (Cmd/Ctrl + Z, Cmd/Ctrl + Y)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Execute Clear Canvas
  const executeClear = () => {
    setShowClearModal(false);
    pushState({});
    showToast('Canvas cleared. Click Undo to restore.');
  };

  // Template loader
  const loadTemplate = (name: keyof typeof TEMPLATES) => {
    const t = TEMPLATES[name];
    if (t) {
      setGridSize(t.size);
      pushState({ ...t.pixels });
      showToast(`Loaded ${t.label} ✓`);
    }
  };

  // Flood fill algorithm
  const floodFill = (
    startR: number,
    startC: number,
    targetColor: string,
    replaceColor: string
  ) => {
    if (targetColor === replaceColor) return;
    const current = { ...gridRef.current };
    const queue: Array<[number, number]> = [[startR, startC]];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const [r, c] = queue.pop()!;
      const key = `${r},${c}`;
      if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) continue;
      if (visited.has(key)) continue;
      visited.add(key);

      const cellColor = current[key] || '';
      if (cellColor === targetColor) {
        if (replaceColor) {
          current[key] = replaceColor;
        } else {
          delete current[key];
        }

        queue.push([r + 1, c]);
        queue.push([r - 1, c]);
        queue.push([r, c + 1]);
        queue.push([r, c - 1]);
      }
    }

    pushState(current);
    showToast('Area filled ✓');
  };

  // Single pixel action
  const applyPixelAction = (r: number, c: number, fromMove = false) => {
    const key = `${r},${c}`;
    const currentColorAtCell = gridRef.current[key] || '';

    if (activeTool === 'EYEDROPPER') {
      if (currentColorAtCell) {
        setCurrentColor(currentColorAtCell);
        setActiveTool('PEN');
        showToast(`Color picked: ${currentColorAtCell}`);
      } else {
        showToast('Empty cell picked (transparent)');
      }
      return;
    }

    if (activeTool === 'FILL') {
      if (!fromMove) {
        floodFill(r, c, currentColorAtCell, currentColor);
      }
      return;
    }

    if (activeTool === 'ERASER') {
      if (gridRef.current[key]) {
        const next = { ...gridRef.current };
        delete next[key];
        setGrid(next);
        gridRef.current = next;
        strokeDirtyRef.current = true;
      }
      return;
    }

    if (activeTool === 'PEN') {
      if (gridRef.current[key] !== currentColor) {
        const next = { ...gridRef.current, [key]: currentColor };
        setGrid(next);
        gridRef.current = next;
        strokeDirtyRef.current = true;
      }
    }
  };

  const handleCellMouseDown = (r: number, c: number, e: React.MouseEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    isDrawingRef.current = true;
    strokeDirtyRef.current = false;
    applyPixelAction(r, c, false);
  };

  const handleCellMouseEnter = (r: number, c: number) => {
    if (isDrawingRef.current && (activeTool === 'PEN' || activeTool === 'ERASER')) {
      applyPixelAction(r, c, true);
    }
  };

  // Touch drawing support
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDrawing(true);
    isDrawingRef.current = true;
    strokeDirtyRef.current = false;
    const touch = e.touches[0];
    const elem = document.elementFromPoint(touch.clientX, touch.clientY);
    if (elem && elem.hasAttribute('data-row')) {
      const r = parseInt(elem.getAttribute('data-row') || '0', 10);
      const c = parseInt(elem.getAttribute('data-col') || '0', 10);
      applyPixelAction(r, c, false);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDrawingRef.current) return;
    const touch = e.touches[0];
    const elem = document.elementFromPoint(touch.clientX, touch.clientY);
    if (elem && elem.hasAttribute('data-row')) {
      const r = parseInt(elem.getAttribute('data-row') || '0', 10);
      const c = parseInt(elem.getAttribute('data-col') || '0', 10);
      applyPixelAction(r, c, true);
    }
  };

  // Handle grid size change
  const handleSizeChange = (newSize: GridSize) => {
    if (newSize === gridSize) return;
    setGridSize(newSize);

    // Keep pixels that fit within the new bounds
    const next: Record<string, string> = {};
    Object.entries(gridRef.current).forEach(([key, color]) => {
      const [r, c] = key.split(',').map(Number);
      if (r < newSize && c < newSize) {
        next[`${r},${c}`] = color;
      }
    });

    pushState(next);
    showToast(`Canvas resolution set to ${newSize}×${newSize}`);
  };

  // Export high-res crisp PNG with in-app preview and safe Blob URL
  const handleExportPNG = () => {
    const scale = Math.max(16, Math.floor(512 / gridSize)); // 512px crisp lossless
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = gridSize * scale;
    exportCanvas.height = gridSize * scale;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    // Render transparent background pixels
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const color = gridRef.current[`${r},${c}`];
        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(c * scale, r * scale, scale, scale);
        }
      }
    }

    const dataUrl = exportCanvas.toDataURL('image/png');
    setExportPreviewUrl(dataUrl);

    exportCanvas.toBlob((blob) => {
      if (blob) {
        const blobUrl = URL.createObjectURL(blob);
        setExportBlobUrl(blobUrl);

        // Safe automatic download using blob url
        try {
          const link = document.createElement('a');
          link.download = `pixel-art-${gridSize}x${gridSize}-${Date.now()}.png`;
          link.href = blobUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          showToast('Lossless PNG downloaded & preview ready!');
        } catch {
          showToast('PNG preview ready in export dialog');
        }
      }
    }, 'image/png');
  };

  // Copy Image to Clipboard
  const handleCopyImageToClipboard = async () => {
    if (!exportBlobUrl) return;
    try {
      const response = await fetch(exportBlobUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setCopiedImage(true);
      setTimeout(() => setCopiedImage(false), 2000);
      showToast('Image copied to clipboard!');
    } catch {
      // Fallback to data url copy
      if (exportPreviewUrl) {
        navigator.clipboard.writeText(exportPreviewUrl);
        setCopiedDataUrl(true);
        setTimeout(() => setCopiedDataUrl(false), 2000);
        showToast('Base64 copied to clipboard');
      }
    }
  };

  return (
    <div className="space-y-6 select-none text-left">
      {/* Toast Notification Bar */}
      {statusMessage && (
        <div className="p-3 rounded-2xl bg-blue-600 text-white text-xs font-semibold flex items-center justify-between shadow-lg shadow-blue-600/20 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-200" />
            <span>{statusMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusMessage('')}
            className="text-white/80 hover:text-white p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Controls Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Left: Tool Selection & Grid Size */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Tool Selector Buttons */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
            <button
              type="button"
              onClick={() => {
                setActiveTool('PEN');
                showToast('Pen Tool active (Click & drag to paint)');
              }}
              className={`p-2 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                activeTool === 'PEN'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5'
              }`}
              title="Pencil / Pen (Click & drag to draw)"
            >
              <Paintbrush className="w-4 h-4" />
              <span className="hidden sm:inline">Pen</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTool('ERASER');
                showToast('Eraser active (Click cells to clear)');
              }}
              className={`p-2 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                activeTool === 'ERASER'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5'
              }`}
              title="Eraser (Erase pixel cells)"
            >
              <Eraser className="w-4 h-4" />
              <span className="hidden sm:inline">Eraser</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTool('FILL');
                showToast('Paint Bucket (Flood Fill) active');
              }}
              className={`p-2 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                activeTool === 'FILL'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5'
              }`}
              title="Paint Bucket (Flood fill connected area)"
            >
              <PaintBucket className="w-4 h-4" />
              <span className="hidden sm:inline">Fill</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTool('EYEDROPPER');
                showToast('Eyedropper active: Click any cell to sample its color');
              }}
              className={`p-2 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                activeTool === 'EYEDROPPER'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5'
              }`}
              title="Eyedropper (Pick color from canvas)"
            >
              <Pipette className="w-4 h-4" />
              <span className="hidden sm:inline">Pick</span>
            </button>
          </div>

          {/* Grid Size Segmented Buttons */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs font-mono font-bold">
            {([8, 16, 24, 32] as GridSize[]).map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => handleSizeChange(sz)}
                className={`px-2.5 py-1.5 rounded-lg cursor-pointer transition-all ${
                  gridSize === sz
                    ? 'bg-white dark:bg-[#121212] text-blue-600 dark:text-sky-400 shadow-xs font-black'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title={`Set canvas resolution to ${sz}×${sz}`}
              >
                {sz}&times;{sz}
              </button>
            ))}
          </div>

          {/* Toggle Grid Lines */}
          <button
            type="button"
            onClick={() => setShowGridLines(!showGridLines)}
            className={`p-2 rounded-xl text-xs font-semibold cursor-pointer border transition-colors flex items-center gap-1.5 ${
              showGridLines
                ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/40 text-blue-600 dark:text-sky-400 font-bold'
                : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Toggle visible cell grid lines"
          >
            <Grid className="w-4 h-4" />
            <span className="hidden sm:inline">Grid</span>
          </button>
        </div>

        {/* Right: History, Clear & Export */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Undo */}
          <button
            type="button"
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          {/* Redo */}
          <button
            type="button"
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          {/* Clear Canvas with dedicated confirmation */}
          <button
            type="button"
            onClick={() => setShowClearModal(true)}
            className="p-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer flex items-center gap-1.5"
            title="Clear canvas"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          {/* Export PNG */}
          <button
            type="button"
            onClick={handleExportPNG}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/25 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
            title="Export crisp lossless PNG image"
          >
            <Download className="w-4 h-4" />
            <span>Export PNG</span>
          </button>
        </div>
      </div>

      {/* Main Workspace (Canvas + Color Palette) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left: Pixel Canvas (3 Cols on Desktop) */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center p-4 sm:p-8 rounded-3xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
          {/* Canvas Board */}
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            style={{
              touchAction: 'none',
              maxWidth: 'min(90vw, 480px)',
              maxHeight: 'min(90vw, 480px)',
              width: '100%',
              aspectRatio: '1 / 1',
            }}
            className="relative bg-slate-100 dark:bg-[#121212] rounded-2xl overflow-hidden border-2 border-slate-300 dark:border-white/20 shadow-inner flex flex-col"
          >
            {/* Checkerboard transparency pattern */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(45deg, #888 25%, transparent 25%), linear-gradient(-45deg, #888 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #888 75%), linear-gradient(-45deg, transparent 75%, #888 75%)',
                backgroundSize: '16px 16px',
                backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
              }}
            />

            {/* Grid Cells */}
            <div
              className="w-full h-full grid"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gridTemplateRows: `repeat(${gridSize}, 1fr)`,
              }}
            >
              {Array.from({ length: gridSize }).map((_, r) =>
                Array.from({ length: gridSize }).map((_, c) => {
                  const key = `${r},${c}`;
                  const color = grid[key];
                  return (
                    <div
                      key={key}
                      data-row={r}
                      data-col={c}
                      onMouseDown={(e) => handleCellMouseDown(r, c, e)}
                      onMouseEnter={() => handleCellMouseEnter(r, c)}
                      style={{
                        backgroundColor: color || 'transparent',
                      }}
                      className={`relative cursor-crosshair transition-colors ${
                        showGridLines
                          ? 'border-[0.5px] border-slate-300/40 dark:border-white/10'
                          : ''
                      }`}
                    />
                  );
                })
              )}
            </div>
          </div>

          {/* Quick status line */}
          <div className="mt-4 flex items-center justify-between w-full max-w-[480px] text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            <span>
              Canvas: {gridSize}&times;{gridSize} ({gridSize * gridSize} cells)
            </span>
            <div className="flex items-center gap-2">
              <span>Active:</span>
              <span
                className="w-3.5 h-3.5 rounded-full border border-black/20 dark:border-white/20 inline-block shadow-xs"
                style={{ backgroundColor: currentColor }}
              />
              <strong className="text-slate-900 dark:text-white uppercase font-bold">
                {currentColor}
              </strong>
            </div>
          </div>
        </div>

        {/* Right: Color Palette, Custom Picker & Inspiration Templates */}
        <div className="space-y-5">
          {/* Active Color & Custom Color Picker */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs space-y-3">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-700 dark:text-slate-300 block">
              Active Color
            </span>

            <div className="flex items-center gap-3">
              <div
                style={{ backgroundColor: currentColor }}
                className="w-12 h-12 rounded-xl border-2 border-white dark:border-[#121212] shadow-md ring-2 ring-slate-200 dark:ring-white/10 shrink-0 transition-colors"
              />

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentColor}
                    onChange={(e) => {
                      setCurrentColor(e.target.value);
                      if (activeTool === 'ERASER') setActiveTool('PEN');
                    }}
                    className="w-7 h-7 rounded-lg border-0 cursor-pointer p-0 bg-transparent shrink-0"
                    title="Open native color picker"
                  />
                  <input
                    type="text"
                    value={currentColor}
                    maxLength={7}
                    onChange={(e) => {
                      setCurrentColor(e.target.value);
                      if (activeTool === 'ERASER') setActiveTool('PEN');
                    }}
                    className="w-24 px-2 py-1 text-xs font-mono font-bold bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white uppercase"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block">
                  Click swatch or input hex code
                </span>
              </div>
            </div>
          </div>

          {/* Curated Palettes */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs space-y-4">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-700 dark:text-slate-300 block">
              Curated Swatches
            </span>

            <div className="space-y-3">
              {PALETTES.map((pal) => (
                <div key={pal.name} className="space-y-1.5">
                  <span className="text-[10px] font-semibold text-slate-400 block">
                    {pal.name}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {pal.colors.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setCurrentColor(c);
                          if (activeTool === 'ERASER') setActiveTool('PEN');
                          showToast(`Selected ${c}`);
                        }}
                        style={{ backgroundColor: c }}
                        className={`w-6 h-6 rounded-md border border-black/10 dark:border-white/15 cursor-pointer transition-transform hover:scale-110 active:scale-95 ${
                          currentColor.toLowerCase() === c.toLowerCase()
                            ? 'ring-2 ring-blue-500 scale-105'
                            : ''
                        }`}
                        title={c}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inspiration Preset Templates */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs space-y-2.5">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-700 dark:text-slate-300 block">
              Preset Art Templates
            </span>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(TEMPLATES).map(([key, item]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => loadTemplate(key)}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 text-center transition-colors cursor-pointer active:scale-95"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Clear Canvas Confirmation Modal */}
      {showClearModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
        >
          <div className="w-full max-w-sm bg-white dark:bg-[#18181b] rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-2xl space-y-4 text-left animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Clear Canvas?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  This will empty the canvas. You can still use Undo (Ctrl+Z).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeClear}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/20 cursor-pointer"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Preview Modal */}
      {exportPreviewUrl && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
        >
          <div className="w-full max-w-md bg-white dark:bg-[#18181b] rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-2xl space-y-4 text-left animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/10">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-sky-400" />
                <span>Pixel Art PNG Export</span>
              </h3>
              <button
                type="button"
                onClick={() => setExportPreviewUrl(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10">
              <img
                src={exportPreviewUrl}
                alt="Pixel Art Export"
                className="max-h-60 max-w-full rounded-lg shadow-md"
                style={{ imageRendering: 'pixelated' }}
              />
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-2">
                Resolution: {gridSize * 32}&times;{gridSize * 32}px crisp lossless PNG
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={handleCopyImageToClipboard}
                className="py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedImage ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copiedImage ? 'Copied Image' : 'Copy Image'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (exportPreviewUrl) {
                    navigator.clipboard.writeText(exportPreviewUrl);
                    setCopiedDataUrl(true);
                    setTimeout(() => setCopiedDataUrl(false), 2000);
                  }
                }}
                className="py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedDataUrl ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copiedDataUrl ? 'Copied Base64' : 'Copy Base64'}</span>
              </button>
            </div>

            {exportBlobUrl && (
              <a
                href={exportBlobUrl}
                download={`pixel-art-${gridSize}x${gridSize}-${Date.now()}.png`}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/25 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download PNG File</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
