import React from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useData } from '../../context/DataContext';
import { Link } from '../../lib/router';
import { SpotlightCard } from '../../components/public/SpotlightCard';
import {
  Briefcase,
  Layers,
  Wrench,
  CheckCircle,
  Eye,
  Clock,
  ArrowUpRight,
  Plus,
  Mail,
  User,
  ExternalLink,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { profile, projects, services, skills, contactMessages } = useData();

  const totalProjects = projects.length;
  const publishedProjects = projects.filter((p) => p.published).length;
  const draftProjects = totalProjects - publishedProjects;
  const featuredProjects = projects.filter((p) => p.featured).length;

  const profileFields = [
    profile.name,
    profile.profession,
    profile.headline,
    profile.short_bio,
    profile.long_bio,
    profile.location,
    profile.email,
    profile.availability,
    profile.profile_image_url,
    profile.hero_heading,
    profile.hero_description,
    profile.resume_url,
  ];
  const filledFields = profileFields.filter(Boolean).length;
  const profileCompletion = Math.round((filledFields / profileFields.length) * 100);

  const unreadMessages = contactMessages.filter((m) => m.status === 'unread').length;

  return (
    <AdminLayout title="CMS Dashboard Overview">
      <div className="space-y-8">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SpotlightCard className="p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="uppercase tracking-wider font-semibold">Total Projects</span>
              <Briefcase className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-3xl font-black text-white font-mono">{totalProjects}</p>
            <div className="text-[11px] text-slate-400 flex items-center gap-2">
              <span className="text-emerald-400 font-medium">{publishedProjects} published</span>
              <span>•</span>
              <span>{draftProjects} drafts</span>
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="uppercase tracking-wider font-semibold">Featured Work</span>
              <Eye className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-3xl font-black text-white font-mono">{featuredProjects}</p>
            <div className="text-[11px] text-slate-400">
              Highlighted on Homepage Hero & Showcase
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="uppercase tracking-wider font-semibold">Profile Completion</span>
              <User className="w-4 h-4 text-sky-400" />
            </div>
            <p className="text-3xl font-black text-white font-mono">{profileCompletion}%</p>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="uppercase tracking-wider font-semibold">Inquiries / Messages</span>
              <Mail className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-black text-white font-mono">{contactMessages.length}</p>
            <div className="text-[11px] text-slate-400">
              <span className="text-emerald-400 font-semibold">{unreadMessages} unread</span> inquiries
            </div>
          </SpotlightCard>
        </div>

        {/* Quick Actions Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/projects/new"
            className="p-5 rounded-2xl bg-[#0d121f] border border-white/10 hover:border-indigo-500/40 transition-all flex items-center justify-between group"
          >
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                Publish New Project
              </h3>
              <p className="text-xs text-slate-400">Add case study with gallery, tags, and tools.</p>
            </div>
            <Plus className="w-5 h-5 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            to="/admin/profile"
            className="p-5 rounded-2xl bg-[#0d121f] border border-white/10 hover:border-cyan-500/40 transition-all flex items-center justify-between group"
          >
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                Update Bio & Headlines
              </h3>
              <p className="text-xs text-slate-400">Edit hero text, portrait photo, and availability.</p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            to="/"
            target="_blank"
            className="p-5 rounded-2xl bg-[#0d121f] border border-white/10 hover:border-emerald-500/40 transition-all flex items-center justify-between group"
          >
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                Preview Live Site
              </h3>
              <p className="text-xs text-slate-400">Inspect animations, mouse glow, and layout.</p>
            </div>
            <ExternalLink className="w-5 h-5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Recent Projects Table */}
        <SpotlightCard className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Recent Projects in CMS</h3>
            <Link to="/admin/projects" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
              Manage All ({totalProjects}) →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead>
                <tr className="border-b border-white/10 text-slate-500">
                  <th className="pb-3 font-semibold uppercase tracking-wider">Project Title</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider">Category</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider">Status</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {projects.slice(0, 5).map((project) => (
                  <tr key={project.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 font-semibold text-white flex items-center gap-3">
                      <img
                        src={project.cover_image_url}
                        alt=""
                        className="w-9 h-6 object-cover rounded bg-black/50"
                      />
                      <span>{project.title}</span>
                    </td>
                    <td className="py-3 text-slate-400">{project.category}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          project.published
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {project.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        to={`/admin/projects/${project.id}`}
                        className="text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        Edit →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SpotlightCard>
      </div>
    </AdminLayout>
  );
};
