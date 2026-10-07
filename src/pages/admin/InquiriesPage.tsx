import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useData } from '../../context/DataContext';
import { ContactMessage } from '../../types/database';
import {
  Mail,
  MailOpen,
  Trash2,
  Archive,
  Reply,
  CheckCircle2,
  Clock,
  Search,
  MessageSquare,
  AlertCircle,
  Eye,
  X,
  Send,
  User,
} from 'lucide-react';

export const InquiriesPage: React.FC = () => {
  const { contactMessages, updateMessageStatus, deleteContactMessage } = useData();

  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'read' | 'replied' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const showNotice = (text: string) => {
    setNotice(text);
    setTimeout(() => setNotice(null), 3000);
  };

  const totalCount = contactMessages.length;
  const unreadCount = contactMessages.filter((m) => m.status === 'unread').length;
  const repliedCount = contactMessages.filter((m) => m.status === 'replied').length;
  const archivedCount = contactMessages.filter((m) => m.status === 'archived').length;

  const filteredMessages = contactMessages.filter((m) => {
    const matchesTab = activeTab === 'all' || m.status === activeTab;
    const matchesSearch =
      searchQuery.trim() === '' ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleStatusChange = async (id: string, status: ContactMessage['status']) => {
    await updateMessageStatus(id, status);
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage((prev) => (prev ? { ...prev, status } : null));
    }
    showNotice(`Inquiry marked as ${status}.`);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      await deleteContactMessage(id);
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null);
      }
      showNotice('Inquiry deleted successfully.');
    }
  };

  const handleReply = (msg: ContactMessage) => {
    handleStatusChange(msg.id, 'replied');
    const mailto = `mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}&body=${encodeURIComponent(
      `Hi ${msg.name},\n\nThank you for reaching out regarding your project inquiry.\n\nBest regards,\nAnil Shrestha`
    )}`;
    window.location.href = mailto;
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <AdminLayout title="Client Inquiries">
      <div className="space-y-6 max-w-6xl text-left">
        {/* Flash notice */}
        {notice && (
          <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 text-xs text-blue-700 dark:text-sky-300 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-sky-400 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {/* Top Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Total Inquiries
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
              {totalCount}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs">
            <span className="text-[11px] font-semibold text-blue-600 dark:text-sky-400 uppercase tracking-wider block">
              Unread
            </span>
            <span className="text-2xl font-black text-blue-600 dark:text-sky-400 mt-1 block">
              {unreadCount}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs">
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
              Replied
            </span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
              {repliedCount}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Archived
            </span>
            <span className="text-2xl font-black text-slate-600 dark:text-slate-400 mt-1 block">
              {archivedCount}
            </span>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                { id: 'all', label: 'All Inquiries' },
                { id: 'unread', label: `Unread (${unreadCount})` },
                { id: 'replied', label: 'Replied' },
                { id: 'archived', label: 'Archived' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search inquiries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Messages List */}
        <div className="rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 overflow-hidden shadow-xs divide-y divide-slate-100 dark:divide-white/5">
          {filteredMessages.length === 0 ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400 space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto text-slate-400 opacity-50" />
              <p className="text-sm font-semibold">No inquiries found in this category.</p>
              <p className="text-xs">
                When visitors submit the contact form on your portfolio, inquiries appear here.
              </p>
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors hover:bg-slate-50/70 dark:hover:bg-white/[0.02] cursor-pointer ${
                  msg.status === 'unread' ? 'bg-blue-50/30 dark:bg-blue-950/15' : ''
                }`}
                onClick={() => {
                  setSelectedMessage(msg);
                  if (msg.status === 'unread') {
                    updateMessageStatus(msg.id, 'read');
                  }
                }}
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                  {/* Sender Avatar */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      msg.status === 'unread'
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                        : 'bg-slate-100 dark:bg-[#282d3d] text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {msg.name ? msg.name.substring(0, 2).toUpperCase() : 'IN'}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {msg.name}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        &lt;{msg.email}&gt;
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold ${
                          msg.status === 'unread'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-sky-300'
                            : msg.status === 'replied'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400'
                        }`}
                      >
                        {msg.status}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {msg.subject || 'Project Inquiry'}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 leading-relaxed">
                      {msg.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-white/5">
                  <span className="text-[11px] font-mono text-slate-400">
                    {formatDate(msg.created_at)}
                  </span>

                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => handleReply(msg)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                      title="Reply via Email"
                    >
                      <Reply className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleStatusChange(
                          msg.id,
                          msg.status === 'archived' ? 'read' : 'archived'
                        )
                      }
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                      title={msg.status === 'archived' ? 'Unarchive' : 'Archive'}
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(msg.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                      title="Delete Inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedMessage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 text-left"
        >
          <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-blue-600 dark:text-sky-400 block">
                  Inquiry Details
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedMessage.subject || 'Project Inquiry'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#121212] border border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Sender Name & Email:</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                    {selectedMessage.name} &lt;{selectedMessage.email}&gt;
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 block">Received:</span>
                  <p className="font-mono text-slate-800 dark:text-slate-300 mt-0.5">
                    {formatDate(selectedMessage.created_at)}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase font-mono tracking-wider font-bold text-slate-500 block">
                  Message Content:
                </span>
                <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-[#121212]/60 border border-slate-200/70 dark:border-white/10 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#121212] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleStatusChange(
                      selectedMessage.id,
                      selectedMessage.status === 'unread' ? 'read' : 'unread'
                    )
                  }
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-100 transition-colors"
                >
                  {selectedMessage.status === 'unread' ? 'Mark as Read' : 'Mark as Unread'}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleStatusChange(
                      selectedMessage.id,
                      selectedMessage.status === 'archived' ? 'read' : 'archived'
                    )
                  }
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-100 transition-colors"
                >
                  {selectedMessage.status === 'archived' ? 'Unarchive' : 'Archive'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleReply(selectedMessage)}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
