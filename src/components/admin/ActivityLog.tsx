import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ActivityLogEntry } from '../../types/database';
import {
  Activity,
  Briefcase,
  Layers,
  User,
  Wrench,
  Database,
  Image,
  Clock,
  Trash2,
  CheckCircle,
  FileCheck,
  Shield,
  Filter,
} from 'lucide-react';

function getRelativeTime(isoString: string): string {
  try {
    const timestamp = new Date(isoString).getTime();
    const now = Date.now();
    const diffSec = Math.floor((now - timestamp) / 1000);

    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    if (diffSec < 86400 * 7) return `${Math.floor(diffSec / 86400)}d ago`;

    return new Date(isoString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Recently';
  }
}

export const ActivityLog: React.FC = () => {
  const { activityLogs, clearActivityLogs } = useData();
  const [filter, setFilter] = useState<'all' | 'project' | 'service' | 'profile' | 'settings'>('all');
  const [confirmClear, setConfirmClear] = useState(false);

  const filteredLogs = activityLogs.filter((log) => {
    if (filter === 'all') return true;
    if (filter === 'project') return log.entity === 'project';
    if (filter === 'service') return log.entity === 'service';
    if (filter === 'profile') return log.entity === 'profile';
    if (filter === 'settings') return log.entity === 'settings' || log.entity === 'media';
    return true;
  });

  const getEntityIcon = (entity: ActivityLogEntry['entity']) => {
    switch (entity) {
      case 'project':
        return <Briefcase className="w-4 h-4 text-blue-600 dark:text-sky-400" />;
      case 'service':
        return <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />;
      case 'profile':
        return <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case 'skill':
        return <Wrench className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'media':
        return <Image className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'settings':
      default:
        return <Database className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
    }
  };

  const getActionBadge = (action: ActivityLogEntry['action']) => {
    switch (action) {
      case 'create':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
            Created
          </span>
        );
      case 'publish':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/40">
            Published
          </span>
        );
      case 'delete':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40">
            Deleted
          </span>
        );
      case 'backup':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/40">
            Snapshot
          </span>
        );
      case 'sync':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/40">
            Synced
          </span>
        );
      case 'update':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-sky-400 border border-blue-200 dark:border-blue-800/40">
            Updated
          </span>
        );
    }
  };

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xs text-left">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600 dark:text-sky-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Activity & Audit Log
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
              {activityLogs.length} events
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tracks recent administrative changes across projects, services, profile, and settings for accountability.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {confirmClear ? (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
                Clear all history?
              </span>
              <button
                type="button"
                onClick={() => {
                  clearActivityLogs();
                  setConfirmClear(false);
                }}
                className="px-2.5 py-1 text-[11px] font-bold bg-rose-600 text-white rounded-lg hover:bg-rose-500 cursor-pointer"
              >
                Yes, Clear
              </button>
              <button
                type="button"
                onClick={() => setConfirmClear(false)}
                className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            activityLogs.length > 0 && (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Clear activity log history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5">
        {(
          [
            { id: 'all', label: 'All Activities' },
            { id: 'project', label: 'Projects' },
            { id: 'service', label: 'Services' },
            { id: 'profile', label: 'Profile' },
            { id: 'settings', label: 'Settings & Backups' },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setFilter(t.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === t.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Activity Timeline List */}
      <div className="divide-y divide-slate-100 dark:divide-white/5 max-h-[380px] overflow-y-auto no-scrollbar pr-1">
        {filteredLogs.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 space-y-2">
            <Clock className="w-6 h-6 mx-auto opacity-40" />
            <p>No activity logs recorded under this category yet.</p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="py-3.5 flex items-start justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-white/[0.01] px-2 rounded-xl transition-colors"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 shrink-0 mt-0.5">
                  {getEntityIcon(log.entity)}
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {log.title}
                    </span>
                    {getActionBadge(log.action)}
                  </div>

                  {log.details && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {log.details}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 pt-0.5">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">
                      by {log.user || 'Admin'}
                    </span>
                    <span>•</span>
                    <span title={new Date(log.timestamp).toLocaleString()}>
                      {getRelativeTime(log.timestamp)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] font-mono text-slate-400 shrink-0 hidden sm:block">
                {new Date(log.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
