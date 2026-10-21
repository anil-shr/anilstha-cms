import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useData } from '../../context/DataContext';
import { Testimonial } from '../../types/database';
import { SpotlightCard } from '../../components/public/SpotlightCard';
import {
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Star,
  Quote,
  MessageSquare,
  Sparkles,
  Eye,
  EyeOff,
  RefreshCw,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  User,
  Building,
  Upload,
  Link as LinkIcon,
} from 'lucide-react';
import { optimizeImageFile } from '../../lib/imageOptimizer';

export const TestimonialsManagerPage: React.FC = () => {
  const {
    testimonials,
    saveTestimonial,
    deleteTestimonial,
    toggleTestimonialPublish,
    toggleTestimonialFeatured,
    reorderTestimonials,
    pushAllToSupabase,
    pullFromSupabase,
  } = useData();

  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'published' | 'featured' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  const handleOpenNew = () => {
    setEditingItem({
      id: 'testi-' + Date.now(),
      client_name: '',
      client_role: 'Founder & CEO',
      company: '',
      quote: '',
      avatar_url: '',
      rating: 5,
      project_title: '',
      project_url: '',
      featured: true,
      published: true,
      sort_order: testimonials.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Testimonial) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleAvatarUpload = async (file: File) => {
    if (!editingItem) return;
    try {
      const opt = await optimizeImageFile(file, { maxDimension: 400 });
      setEditingItem({
        ...editingItem,
        avatar_url: opt.dataUrl,
      });
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        setEditingItem({
          ...editingItem,
          avatar_url: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.client_name.trim() || !editingItem.quote.trim()) return;

    await saveTestimonial(editingItem);
    setIsModalOpen(false);
    setEditingItem(null);
    showNotice(`Testimonial from "${editingItem.client_name}" saved and synced!`);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the testimonial from "${name}"?`)) {
      await deleteTestimonial(id);
      showNotice(`Testimonial deleted successfully.`);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= testimonials.length) return;

    const reordered = [...testimonials];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    await reorderTestimonials(reordered);
    showNotice('Order updated.');
  };

  const handleSyncWithSupabase = async () => {
    setIsSyncing(true);
    try {
      await pushAllToSupabase();
      await pullFromSupabase();
      showNotice('All testimonials successfully synchronized with Supabase live database!');
    } catch (err: any) {
      showNotice(`Sync error: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const totalReviews = testimonials.length;
  const publishedCount = testimonials.filter((t) => t.published).length;
  const featuredCount = testimonials.filter((t) => t.featured).length;
  const avgRating =
    totalReviews > 0
      ? (testimonials.reduce((acc, t) => acc + (t.rating || 5), 0) / totalReviews).toFixed(1)
      : '5.0';

  const filteredTestimonials = testimonials.filter((t) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'published' && t.published) ||
      (filter === 'draft' && !t.published) ||
      (filter === 'featured' && t.featured);

    const matchesSearch =
      searchQuery.trim() === '' ||
      t.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.quote.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.project_title && t.project_title.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  return (
    <AdminLayout
      title="Client Testimonials"
      actionButton={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSyncWithSupabase}
            disabled={isSyncing}
            className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            title="Sync all testimonials with Supabase database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Supabase'}</span>
          </button>

          <button
            type="button"
            onClick={handleOpenNew}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/25"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Testimonial</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6 text-left">
        {/* Notice alert */}
        {notice && (
          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 text-blue-700 dark:text-sky-300 text-xs font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-sky-400 shrink-0" />
              <span>{notice}</span>
            </div>
            <button
              type="button"
              onClick={() => setNotice(null)}
              className="p-1 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SpotlightCard className="p-5 space-y-2 bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="uppercase tracking-wider font-semibold">Total Reviews</span>
              <Quote className="w-4 h-4 text-blue-600 dark:text-sky-400" />
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white font-mono">{totalReviews}</p>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Client feedback records in database
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-5 space-y-2 bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="uppercase tracking-wider font-semibold">Published (Live)</span>
              <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white font-mono">{publishedCount}</p>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400">
              Visible on public website & slider
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-5 space-y-2 bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="uppercase tracking-wider font-semibold">Featured on Homepage</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white font-mono">{featuredCount}</p>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Showcased in homepage interactive slider
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-5 space-y-2 bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="uppercase tracking-wider font-semibold">Average Rating</span>
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white font-mono">{avgRating} / 5.0</p>
            <div className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-500 text-amber-500" />
              ))}
            </div>
          </SpotlightCard>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {(['all', 'published', 'featured', 'draft'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  filter === tab
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Search by client, company, quote..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Testimonials List */}
        {filteredTestimonials.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 space-y-3">
            <Quote className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No client testimonials found.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {searchQuery
                ? 'Try adjusting your search criteria.'
                : 'Click "Add Testimonial" to register feedback from your clients.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTestimonials.map((item, index) => (
              <div
                key={item.id}
                className="relative p-5 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs hover:border-blue-500/40 transition-all flex flex-col justify-between space-y-4 group"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shrink-0 flex items-center justify-center">
                      {item.avatar_url ? (
                        <img
                          src={item.avatar_url}
                          alt={item.client_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="text-xs font-bold text-blue-600 dark:text-sky-400 font-mono">
                          {item.client_name.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{item.client_name}</span>
                        {item.featured && (
                          <span
                            title="Featured on Homepage"
                            className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                          >
                            Featured
                          </span>
                        )}
                        {!item.published && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400">
                            Draft
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {item.client_role} • <span className="font-semibold text-slate-700 dark:text-slate-300">{item.company}</span>
                      </p>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5 shrink-0">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < item.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Quote */}
                <div className="relative">
                  <Quote className="absolute -top-1 -left-1 w-5 h-5 text-slate-200 dark:text-white/5 -z-10 pointer-events-none" />
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic line-clamp-4">
                    "{item.quote}"
                  </p>
                </div>

                {/* Project association tag */}
                {item.project_title && (
                  <div className="flex items-center gap-1.5 text-[11px] text-blue-600 dark:text-sky-400 font-medium">
                    <LinkIcon className="w-3 h-3" />
                    <span>Project: {item.project_title}</span>
                  </div>
                )}

                {/* Footer Controls */}
                <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === testimonials.length - 1}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] font-mono text-slate-400 ml-1">
                      #{item.sort_order || index + 1}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => toggleTestimonialFeatured(item.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        item.featured
                          ? 'text-amber-500 bg-amber-500/10'
                          : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-white/5'
                      }`}
                      title={item.featured ? 'Remove from Featured' : 'Feature on Homepage'}
                    >
                      <Star className={`w-3.5 h-3.5 ${item.featured ? 'fill-amber-500' : ''}`} />
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleTestimonialPublish(item.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        item.published
                          ? 'text-emerald-600 bg-emerald-500/10'
                          : 'text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-white/5'
                      }`}
                      title={item.published ? 'Unpublish (hide)' : 'Publish (make live)'}
                    >
                      {item.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                      title="Edit Testimonial"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id, item.client_name)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                      title="Delete Testimonial"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Editor */}
        {isModalOpen && editingItem && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          >
            <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col text-left">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <Quote className="w-4 h-4 text-blue-600 dark:text-sky-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {editingItem.id.startsWith('testi-') ? 'Add Client Testimonial' : 'Edit Testimonial'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body Form */}
              <form onSubmit={handleSave} className="overflow-y-auto p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Client Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Client Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Suman Thapa"
                      value={editingItem.client_name}
                      onChange={(e) => setEditingItem({ ...editingItem, client_name: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Client Role */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Role / Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Founder & CEO"
                      value={editingItem.client_role}
                      onChange={(e) => setEditingItem({ ...editingItem, client_role: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Company */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Company / Organization *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kora Organics"
                      value={editingItem.company}
                      onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Rating Selector */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Star Rating
                    </label>
                    <div className="flex items-center gap-1.5 pt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setEditingItem({ ...editingItem, rating: star })}
                          className="p-1 rounded-md hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= editingItem.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300 dark:text-slate-700'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300 ml-2">
                        {editingItem.rating} of 5 Stars
                      </span>
                    </div>
                  </div>
                </div>

                {/* Avatar URL & Upload */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Client Avatar Photo
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shrink-0 flex items-center justify-center">
                      {editingItem.avatar_url ? (
                        <img
                          src={editingItem.avatar_url}
                          alt="Avatar preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/... or upload"
                        value={editingItem.avatar_url || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, avatar_url: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <label className="inline-flex items-center gap-1.5 text-[11px] text-blue-600 dark:text-sky-400 font-medium hover:underline cursor-pointer">
                        <Upload className="w-3 h-3" />
                        <span>Upload photo file</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) handleAvatarUpload(e.target.files[0]);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Quote */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Client Quote / Review *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Enter the client's detailed feedback, project results, and experience working with you..."
                    value={editingItem.quote}
                    onChange={(e) => setEditingItem({ ...editingItem, quote: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed"
                  />
                </div>

                {/* Associated Project */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Associated Project Title (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kora Organics Packaging"
                      value={editingItem.project_title || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, project_title: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Project Link / URL (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. /work/kora-organics-branding"
                      value={editingItem.project_url || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, project_url: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Switches */}
                <div className="pt-2 flex flex-wrap items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingItem.featured}
                      onChange={(e) => setEditingItem({ ...editingItem, featured: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 rounded-sm"
                    />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Feature in Homepage Slider
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingItem.published}
                      onChange={(e) => setEditingItem({ ...editingItem, published: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 rounded-sm"
                    />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Published (Public)
                    </span>
                  </label>
                </div>

                {/* Modal Footer Buttons */}
                <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-md shadow-blue-600/25 cursor-pointer"
                  >
                    Save Testimonial
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
