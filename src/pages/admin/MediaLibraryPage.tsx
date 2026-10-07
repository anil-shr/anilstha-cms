import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useData } from '../../context/DataContext';
import { MediaItem } from '../../types/database';
import {
  Upload,
  Copy,
  Trash2,
  Check,
  AlertCircle,
  FileText,
  ExternalLink,
} from 'lucide-react';

export const MediaLibraryPage: React.FC = () => {
  const { media, addMediaItem, deleteMediaItem } = useData();

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<MediaItem | null>(null);

  // Allowed MIME types and extensions
  const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/svg+xml',
    'application/pdf',
  ];

  const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.svg', '.pdf'];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // File size limit: 10MB
      if (file.size > 10 * 1024 * 1024) {
        setUploadError(`File "${file.name}" exceeds the maximum 10MB limit.`);
        continue;
      }

      // MIME validation
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        setUploadError(`File "${file.name}" has an unsupported MIME type (${file.type}). Allowed: JPEG, PNG, WEBP, AVIF, SVG, PDF.`);
        continue;
      }

      // Extension validation
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        setUploadError(`File extension "${ext}" is not permitted.`);
        continue;
      }

      // Read file and create persistent data URL or object URL
      const reader = new FileReader();
      reader.onload = () => {
        const resultUrl = reader.result as string;

        // Image dimensions resolution
        let dimensions = 'Unknown';
        if (file.type.startsWith('image/')) {
          const img = new Image();
          img.src = resultUrl;
          img.onload = () => {
            dimensions = `${img.width}x${img.height}`;
            createAndSaveMedia(file, resultUrl, dimensions);
          };
          img.onerror = () => {
            createAndSaveMedia(file, resultUrl, 'Standard');
          };
        } else {
          createAndSaveMedia(file, resultUrl, 'Document');
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const createAndSaveMedia = (file: File, url: string, dimensions: string) => {
    const newItem: MediaItem = {
      id: 'med-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      filename: file.name.replace(/[^a-zA-Z0-9._-]/g, '_'),
      original_name: file.name,
      url,
      file_size: file.size,
      mime_type: file.type,
      dimensions,
      alt_text: file.name.split('.')[0].replace(/[_-]/g, ' '),
      created_at: new Date().toISOString(),
    };
    addMediaItem(newItem);
  };

  const handleCopyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <AdminLayout title="Media Library">
      <div className="space-y-6 text-left">
        {/* Upload Zone */}
        <div className="bg-white dark:bg-[#1e1e1e] border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl p-8 text-center space-y-4 hover:border-blue-500 transition-colors shadow-xs">
          <Upload className="w-8 h-8 text-blue-600 dark:text-sky-400 mx-auto" />
          <div className="space-y-1">
            <p className="text-xs uppercase font-bold text-slate-900 dark:text-white">
              Select or Drop Media Assets to Upload
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Permitted formats: JPEG, PNG, WEBP, AVIF, SVG, PDF. Maximum size: 10MB.
            </p>
          </div>

          <label className="inline-block px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md shadow-blue-600/25 transition-all cursor-pointer">
            <span>Browse Storage</span>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml,application/pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {uploadError && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Media Grid */}
        <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
            <h2 className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white">
              Uploaded Library Assets ({media.length})
            </h2>
            <span className="text-[11px] font-mono text-slate-400">
              Supabase Storage Bucket: portfolio-media
            </span>
          </div>

          {media.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No media files uploaded yet. Upload images above to insert into case studies.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
              {media.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-xl flex flex-col justify-between overflow-hidden group shadow-xs"
                >
                  {/* Thumbnail */}
                  <div className="h-40 bg-slate-100 dark:bg-black/50 overflow-hidden flex items-center justify-center relative">
                    {item.mime_type.startsWith('image/') ? (
                      <img
                        src={item.url}
                        alt={item.alt_text || item.filename}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-500 gap-1">
                        <FileText className="w-8 h-8" />
                        <span className="text-[10px] uppercase font-mono">PDF Document</span>
                      </div>
                    )}
                  </div>

                  {/* Metadata & Actions */}
                  <div className="p-3 space-y-2 text-[11px]">
                    <p className="font-bold text-slate-900 dark:text-white truncate" title={item.filename}>
                      {item.filename}
                    </p>
                    <div className="flex items-center justify-between text-slate-400 font-mono text-[10px]">
                      <span>{formatFileSize(item.file_size)}</span>
                      <span>{item.dimensions || 'N/A'}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleCopyUrl(item)}
                        className="text-blue-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                        title="Copy asset URL"
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600 font-semibold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy URL</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-1">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                          title="Open asset"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmItem(item)}
                          className="p-1 text-red-600 hover:text-red-700 cursor-pointer"
                          title="Delete asset"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 text-left"
        >
          <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold uppercase tracking-tight text-slate-900 dark:text-white">
              Delete Media Asset?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-900 dark:text-white">{deleteConfirmItem.filename}</strong>? Any projects referencing this URL will no longer be able to load this image.
            </p>
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmItem(null)}
                className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteMediaItem(deleteConfirmItem.id);
                  setDeleteConfirmItem(null);
                }}
                className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
              >
                Delete Asset
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
