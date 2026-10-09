import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  Check,
  X,
  RefreshCw,
  Sparkles,
  Link as LinkIcon,
  FolderOpen,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { optimizeImageFile, formatBytes, OptimizedImageResult } from '../../lib/imageOptimizer';

export interface InlineImageUploadProps {
  label?: string;
  description?: string;
  value: string;
  onChange: (url: string) => void;
  altText?: string;
  onAltChange?: (alt: string) => void;
  maxDimension?: number;
  quality?: number;
  accept?: string;
  placeholder?: string;
  previewHeightClass?: string;
}

export const InlineImageUpload: React.FC<InlineImageUploadProps> = ({
  label,
  description,
  value,
  onChange,
  altText,
  onAltChange,
  maxDimension = 1920,
  quality = 0.82,
  accept = 'image/*',
  placeholder = 'https://... or upload photo directly',
  previewHeightClass = 'h-36',
}) => {
  const { media, uploadMediaFile } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<'upload' | 'url' | 'library'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [lastOptimizedStats, setLastOptimizedStats] = useState<OptimizedImageResult | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const processAndUploadFile = async (rawFile: File) => {
    if (!rawFile.type.startsWith('image/')) {
      setErrorNotice('Selected file is not an image.');
      return;
    }

    setIsProcessing(true);
    setErrorNotice(null);

    try {
      // 1. Optimize size and dimensions
      const optimized = await optimizeImageFile(rawFile, {
        maxDimension,
        quality,
      });
      setLastOptimizedStats(optimized);

      // 2. Upload through DataContext to register into app state and backend/storage
      const uploadRes = await uploadMediaFile(optimized.file);
      if (uploadRes.success && uploadRes.item) {
        onChange(uploadRes.item.url);
      } else {
        // Fallback to optimized dataUrl
        onChange(optimized.dataUrl);
      }

      if (onAltChange && !altText) {
        const cleanName = rawFile.name.split('.')[0].replace(/[_-]/g, ' ');
        onAltChange(cleanName);
      }
    } catch (err: any) {
      console.error('Image optimization/upload error:', err);
      setErrorNotice(err.message || 'Failed to process and optimize image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAndUploadFile(file);
    }
    // reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processAndUploadFile(file);
    }
  };

  return (
    <div className="space-y-2">
      {/* Label and Subheading */}
      {(label || description) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            {label && (
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                {label}
              </label>
            )}
            {description && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{description}</p>
            )}
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-0.5 rounded-lg border border-slate-200/80 dark:border-white/10 self-start sm:self-auto text-[10px] font-semibold">
            <button
              type="button"
              onClick={() => setMode('upload')}
              className={`px-2 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                mode === 'upload'
                  ? 'bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <UploadCloud className="w-3 h-3" />
              <span>Direct Upload</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('url')}
              className={`px-2 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                mode === 'url'
                  ? 'bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LinkIcon className="w-3 h-3" />
              <span>URL / Path</span>
            </button>
            {media.length > 0 && (
              <button
                type="button"
                onClick={() => setShowMediaPicker(!showMediaPicker)}
                className="px-2 py-1 rounded-md text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-sky-300 transition-all cursor-pointer flex items-center gap-1"
                title="Browse existing media files"
              >
                <FolderOpen className="w-3 h-3" />
                <span>Media ({media.length})</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Error Message Notice */}
      {errorNotice && (
        <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 text-xs text-rose-700 dark:text-rose-300 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorNotice(null)}
            className="text-rose-600 hover:text-rose-800 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Direct Drag & Drop / Upload Area */}
      {mode === 'upload' && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isProcessing && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 transition-all cursor-pointer text-center relative ${
            isDragging
              ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/30 ring-2 ring-blue-500/20'
              : 'border-slate-300 dark:border-white/15 bg-slate-50/60 dark:bg-white/[0.02] hover:border-blue-400 dark:hover:border-blue-500/50 hover:bg-slate-100/50 dark:hover:bg-white/[0.04]'
          } ${isProcessing ? 'pointer-events-none opacity-80' : ''}`}
        >
          {isProcessing ? (
            <div className="py-4 flex flex-col items-center justify-center space-y-2">
              <RefreshCw className="w-7 h-7 text-blue-600 dark:text-sky-400 animate-spin" />
              <div className="text-xs font-semibold text-slate-900 dark:text-white">
                Optimizing & Compressing Photo...
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Resizing dimensions and reducing payload for ultra-fast loading
              </p>
            </div>
          ) : (
            <div className="py-2 flex flex-col items-center justify-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-sky-400 flex items-center justify-center shadow-xs">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                <span className="text-blue-600 dark:text-sky-400 underline font-bold">
                  Click to upload photo
                </span>{' '}
                or drag and drop here
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Auto-resizes & compresses (WebP/JPEG, max {maxDimension}px) for instant page loading
              </p>
            </div>
          )}
        </div>
      )}

      {/* Manual URL Input Area */}
      {mode === 'url' && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-3.5 py-2 text-xs bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:outline-none font-mono"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer flex items-center gap-1.5 shrink-0"
            title="Upload replacement photo"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload</span>
          </button>
        </div>
      )}

      {/* Optimization Statistics Badge */}
      {lastOptimizedStats && lastOptimizedStats.savedPercent > 0 && (
        <div className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/40 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              <strong>Speed Optimized:</strong> {formatBytes(lastOptimizedStats.originalSize)} &rarr;{' '}
              {formatBytes(lastOptimizedStats.optimizedSize)} (
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {lastOptimizedStats.savedPercent}% smaller
              </span>
              )
            </span>
          </div>
          <span className="text-[10px] font-mono opacity-80">
            {lastOptimizedStats.width}&times;{lastOptimizedStats.height}px
          </span>
        </div>
      )}

      {/* Image Preview & Actions if Value is Present */}
      {value && (
        <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
          <div
            className={`w-24 ${previewHeightClass} rounded-lg overflow-hidden bg-black/10 dark:bg-black/40 border border-slate-200 dark:border-white/10 shrink-0 flex items-center justify-center relative group`}
          >
            <img
              src={value}
              alt={altText || 'Uploaded asset preview'}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Image load failure fallback
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity text-[10px] font-bold gap-1"
              title="Open full image"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Inspect</span>
            </a>
          </div>

          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 truncate block">
                {value.length > 55 ? value.substring(0, 52) + '...' : value}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2 py-1 text-[11px] font-semibold text-blue-600 dark:text-sky-400 hover:underline cursor-pointer"
                  title="Upload a different image"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChange('');
                    setLastOptimizedStats(null);
                  }}
                  className="p-1 text-slate-400 hover:text-rose-500 rounded-md cursor-pointer transition-colors"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Optional Alt text input for accessibility */}
            {onAltChange && (
              <div className="space-y-1 pt-1">
                <input
                  type="text"
                  value={altText || ''}
                  onChange={(e) => onAltChange(e.target.value)}
                  placeholder="Image alt description (accessibility & SEO)"
                  className="w-full px-2.5 py-1 text-[11px] bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Media Picker Modal / Drawer */}
      {showMediaPicker && (
        <div className="p-3 rounded-xl bg-white dark:bg-[#18181b] border border-blue-500/40 dark:border-sky-500/40 shadow-lg space-y-2 mt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <FolderOpen className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
              <span>Choose from Existing Media Library</span>
            </span>
            <button
              type="button"
              onClick={() => setShowMediaPicker(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1">
            {media.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onChange(item.url);
                  if (onAltChange && item.alt_text) onAltChange(item.alt_text);
                  setShowMediaPicker(false);
                }}
                className={`relative aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-white/10 hover:border-blue-500 cursor-pointer group bg-slate-100 dark:bg-black/40 transition-all ${
                  value === item.url ? 'ring-2 ring-blue-600' : ''
                }`}
                title={item.filename}
              >
                <img
                  src={item.url}
                  alt={item.alt_text || item.filename}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                {value === item.url && (
                  <div className="absolute inset-0 bg-blue-600/40 flex items-center justify-center text-white">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
