import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useData } from '../../context/DataContext';
import { Service } from '../../types/database';
import { Plus, Edit, Trash2, Check, X, Layers, Palette, Layout, Sparkles, Upload, Image as ImageIcon } from 'lucide-react';
import { optimizeImageFile } from '../../lib/imageOptimizer';

export const ServicesManagerPage: React.FC = () => {
  const { services, saveService, deleteService } = useData();

  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deliverableInput, setDeliverableInput] = useState('');

  const handleOpenNew = () => {
    setEditingService({
      id: 'srv-' + Date.now(),
      title: '',
      description: '',
      icon: 'palette',
      deliverables: [],
      featured: false,
      sort_order: services.length + 1,
      active: true,
    });
    setDeliverableInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (srv: Service) => {
    setEditingService({ ...srv });
    setDeliverableInput('');
    setIsModalOpen(true);
  };

  const handleIconUpload = async (file: File) => {
    if (!editingService) return;
    try {
      const opt = await optimizeImageFile(file, { maxDimension: 512 });
      setEditingService({
        ...editingService,
        custom_icon_url: opt.dataUrl,
      });
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        setEditingService({
          ...editingService,
          custom_icon_url: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddDeliverable = () => {
    if (!deliverableInput.trim() || !editingService) return;
    setEditingService({
      ...editingService,
      deliverables: [...(editingService.deliverables || []), deliverableInput.trim()],
    });
    setDeliverableInput('');
  };

  const handleRemoveDeliverable = (idx: number) => {
    if (!editingService) return;
    setEditingService({
      ...editingService,
      deliverables: (editingService.deliverables || []).filter((_, i) => i !== idx),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editingService.title.trim()) return;

    await saveService(editingService);
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this service offering?')) {
      await deleteService(id);
    }
  };

  return (
    <AdminLayout
      title="Services & Capabilities"
      actionButton={
        <button
          type="button"
          onClick={handleOpenNew}
          className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Service</span>
        </button>
      }
    >
      <div className="space-y-6 text-left">
        <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400 shadow-xs">
          <p>
            Manage active client service offerings, deliverables, and custom icons shown on public Services and Overview pages.
          </p>
          <span className="font-mono text-slate-900 dark:text-white shrink-0 font-bold">
            {services.length} Total Services
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 space-y-4 flex flex-col justify-between shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10 flex items-center justify-center p-2 text-blue-600 dark:text-sky-400 overflow-hidden shrink-0">
                      {service.custom_icon_url ? (
                        <img
                          src={service.custom_icon_url}
                          alt={service.title}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Palette className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-mono text-slate-400">
                        0{index + 1}
                      </span>
                      {service.custom_icon_url && (
                        <span className="text-[10px] text-emerald-500 block font-mono">
                          Custom Icon
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        service.active
                          ? 'border-emerald-200 text-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40'
                          : 'border-slate-200 text-slate-500 bg-slate-50 dark:bg-white/5 dark:text-slate-400 dark:border-white/10'
                      }`}
                    >
                      {service.active ? 'Active' : 'Inactive'}
                    </span>
                    {service.featured && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-amber-200 text-amber-800 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40">
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    {service.description}
                  </p>
                </div>

                {service.deliverables && service.deliverables.length > 0 && (
                  <div className="space-y-1 pt-2">
                    <span className="text-[11px] font-mono uppercase font-bold text-slate-400 block">
                      Deliverables ({service.deliverables.length})
                    </span>
                    <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                      {service.deliverables.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          <span className="truncate">{item}</span>
                        </li>
                      ))}
                      {service.deliverables.length > 3 && (
                        <li className="text-[11px] text-slate-400">
                          +{service.deliverables.length - 3} more items
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(service)}
                  className="p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  title="Edit service"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(service.id)}
                  className="p-2 rounded-lg text-slate-500 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  title="Delete service"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Modal */}
      {isModalOpen && editingService && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
              <h2 className="text-sm font-bold uppercase tracking-tight text-slate-900 dark:text-white">
                {editingService.title ? 'Edit Service' : 'New Service'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                  Service Title
                </label>
                <input
                  type="text"
                  required
                  value={editingService.title}
                  onChange={(e) =>
                    setEditingService({ ...editingService, title: e.target.value })
                  }
                  placeholder="e.g. Brand Identity & Visual Systems"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-lg focus:border-blue-500 focus:outline-none text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingService.description}
                  onChange={(e) =>
                    setEditingService({ ...editingService, description: e.target.value })
                  }
                  placeholder="Clear description of the service scope..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-lg focus:border-blue-500 focus:outline-none resize-y text-slate-900 dark:text-slate-100"
                />
              </div>

              {/* Custom Icon Field */}
              <div className="p-4 bg-slate-50 dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-white/10 space-y-3">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                  <span>Custom Service Icon (SVG / PNG)</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                      Upload File
                    </label>
                    <label className="flex items-center justify-center gap-2 p-2 border border-dashed border-slate-300 dark:border-white/20 rounded-lg hover:border-blue-500 cursor-pointer text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors bg-white dark:bg-white/5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Choose file</span>
                      <input
                        type="file"
                        accept="image/*,.svg"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleIconUpload(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                      Or Icon URL
                    </label>
                    <input
                      type="url"
                      value={editingService.custom_icon_url || ''}
                      onChange={(e) =>
                        setEditingService({
                          ...editingService,
                          custom_icon_url: e.target.value,
                        })
                      }
                      placeholder="https://.../icon.svg"
                      className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {editingService.custom_icon_url && (
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500">Preview:</span>
                      <div className="w-6 h-6 rounded bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 p-0.5 flex items-center justify-center">
                        <img
                          src={editingService.custom_icon_url}
                          alt={`${editingService.title || 'Service'} icon preview`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingService({
                          ...editingService,
                          custom_icon_url: undefined,
                        })
                      }
                      className="text-[11px] text-red-500 hover:underline cursor-pointer"
                    >
                      Clear icon
                    </button>
                  </div>
                )}
              </div>

              {/* Deliverables */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                  Deliverables Scope
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={deliverableInput}
                    onChange={(e) => setDeliverableInput(e.target.value)}
                    placeholder="e.g. Logo & Mark Guidelines"
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddDeliverable}
                    className="px-3 py-1.5 text-xs font-semibold uppercase text-white bg-slate-800 dark:bg-white dark:text-slate-900 rounded-lg cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(editingService.deliverables || []).map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-slate-100 dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-lg text-slate-800 dark:text-slate-200"
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDeliverable(idx)}
                        className="text-slate-400 hover:text-red-500 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingService.active}
                    onChange={(e) =>
                      setEditingService({ ...editingService, active: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Active on Public Site</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingService.featured}
                    onChange={(e) =>
                      setEditingService({ ...editingService, featured: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Featured Badge</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
