import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useData } from '../../context/DataContext';
import { Service } from '../../types/database';
import { Plus, Edit, Trash2, Check, X, Layers } from 'lucide-react';

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

  return (
    <AdminLayout
      title="Services & Capabilities"
      actionButton={
        <button
          type="button"
          onClick={handleOpenNew}
          className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#111111] hover:bg-[#333333] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Service</span>
        </button>
      }
    >
      <div className="space-y-6">
        <div className="bg-white border border-[#DEDEDA] p-4 flex items-center justify-between text-xs text-[#6B6B6B]">
          <p>
            Manage active client service offerings and specific deliverables shown on the public Services and Overview pages.
          </p>
          <span className="font-mono text-[#111111]">{services.length} Total Services</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="bg-white border border-[#DEDEDA] p-6 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#888888]">
                    0{index + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 border ${
                        service.active
                          ? 'border-emerald-200 text-emerald-800 bg-emerald-50'
                          : 'border-neutral-200 text-neutral-600 bg-neutral-50'
                      }`}
                    >
                      {service.active ? 'Active' : 'Inactive'}
                    </span>
                    {service.featured && (
                      <span className="text-[10px] font-mono px-2 py-0.5 border border-amber-200 text-amber-800 bg-amber-50">
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-black uppercase tracking-tight text-[#111111]">
                  {service.title}
                </h3>

                <p className="text-xs text-[#555555] leading-relaxed">
                  {service.description}
                </p>

                {service.deliverables && service.deliverables.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] uppercase font-bold text-[#888888] tracking-wider block mb-1">
                      Deliverables
                    </span>
                    <ul className="text-xs text-[#333333] space-y-1">
                      {service.deliverables.map((item) => (
                        <li key={item} className="flex items-center gap-1.5">
                          <span className="w-1 h-1 bg-[#111111] rounded-full" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[#EAEAE6] flex items-center justify-between">
                <span className="text-[11px] text-[#888888] font-mono">
                  Order: {service.sort_order}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(service)}
                    className="p-1.5 text-[#111111] hover:text-[#C2410C] cursor-pointer"
                    title="Edit Service"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete service "${service.title}"?`)) {
                        deleteService(service.id);
                      }
                    }}
                    className="p-1.5 text-red-600 hover:text-red-800 cursor-pointer"
                    title="Delete Service"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
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
          <div className="bg-white border border-[#DEDEDA] max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#DEDEDA]">
              <h2 className="text-sm font-bold uppercase tracking-tight text-[#111111]">
                {editingService.title ? `Edit Service` : 'New Service'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-[#888888] hover:text-[#111111]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
                  Service Title
                </label>
                <input
                  type="text"
                  required
                  value={editingService.title}
                  onChange={(e) =>
                    setEditingService({ ...editingService, title: e.target.value })
                  }
                  placeholder="e.g. Brand Identity"
                  className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
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
                  className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none resize-y"
                />
              </div>

              {/* Deliverables */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
                  Deliverables Scope
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={deliverableInput}
                    onChange={(e) => setDeliverableInput(e.target.value)}
                    placeholder="e.g. Logo & Mark Guidelines"
                    className="flex-1 px-3 py-1.5 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddDeliverable}
                    className="px-3 py-1.5 text-xs font-semibold uppercase text-white bg-[#111111]"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1 pt-1 max-h-32 overflow-y-auto">
                  {editingService.deliverables?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-1.5 bg-[#F7F7F5] border border-[#DEDEDA] text-xs"
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDeliverable(idx)}
                        className="text-red-500 hover:text-red-700 p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingService.active}
                    onChange={(e) =>
                      setEditingService({ ...editingService, active: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#111111]"
                  />
                  <span className="text-xs font-medium text-[#111111]">Active & Visible</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingService.featured}
                    onChange={(e) =>
                      setEditingService({ ...editingService, featured: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#111111]"
                  />
                  <span className="text-xs font-medium text-[#111111]">Featured on Home</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#DEDEDA] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#6B6B6B] hover:text-[#111111]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#111111] hover:bg-[#333333] transition-colors"
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
