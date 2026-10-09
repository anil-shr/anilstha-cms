import React from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useData } from '../../context/DataContext';
import { Link } from '../../lib/router';
import { SpotlightCard } from '../../components/public/SpotlightCard';
import { ActivityLog } from '../../components/admin/ActivityLog';
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
      <div className="space-y-8 text-left">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SpotlightCard className="p-5 space-y-2 bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="uppercase tracking-wider font-semibold">Total Projects</span>
              <Briefcase className="w-4 h-4 text-blue-600 dark:text-sky-400" />
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white font-mono">{totalProjects}</p>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">{publishedProjects} published</span>
              <span>•</span>
              <span>{draftProjects} drafts</span>
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-5 space-y-2 bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="uppercase tracking-wider font-semibold">Featured Work</span>
              <Eye className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white font-mono">{featuredProjects}</p>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Highlighted on Homepage Hero & Showcase
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-5 space-y-2 bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="uppercase tracking-wider font-semibold">Profile Completion</span>
              <User className="w-4 h-4 text-blue-600 dark:text-sky-400" />
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white font-mono">{profileCompletion}%</p>
            <div className="w-full bg-slate-100 dark:bg-white/5 h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-5 space-y-2 bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="uppercase tracking-wider font-semibold">Inquiries / Messages</span>
              <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white font-mono">{contactMessages.length}</p>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{unreadMessages} unread</span> inquiries
            </div>
          </SpotlightCard>
        </div>

        {/* Quick Actions Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/projects/new"
            className="p-5 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 hover:border-blue-500/40 dark:hover:border-sky-400/30 transition-all flex items-center justify-between group shadow-xs"
          >
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
                Publish New Project
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Add case study with gallery, tags, and tools.</p>
            </div>
            <Plus className="w-5 h-5 text-blue-600 dark:text-sky-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </Link>

          <Link
            to="/admin/profile"
            className="p-5 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 hover:border-cyan-500/40 dark:hover:border-cyan-400/30 transition-all flex items-center justify-between group shadow-xs"
          >
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                Update Bio & Headlines
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Edit hero text, portrait photo, and availability.</p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-cyan-600 dark:text-cyan-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </Link>

          <Link
            to="/"
            target="_blank"
            className="p-5 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 hover:border-emerald-500/40 dark:hover:border-emerald-400/30 transition-all flex items-center justify-between group shadow-xs"
          >
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Preview Live Site
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Inspect animations, mouse glow, and layout.</p>
            </div>
            <ExternalLink className="w-5 h-5 text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </Link>
        </div>

        {/* Recent Projects Table */}
        <SpotlightCard className="p-6 space-y-4 bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Projects in CMS</h2>
            <Link to="/admin/projects" className="text-xs text-blue-600 dark:text-sky-400 hover:underline font-semibold">
              Manage All ({totalProjects}) →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400">
                  <th className="pb-3 font-semibold uppercase tracking-wider">Project Title</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider">Category</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider">Status</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {projects.slice(0, 5).map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 font-semibold text-slate-900 dark:text-white flex items-center gap-3">
                      <img
                        src={project.cover_image_url}
                        alt={`Cover thumbnail for ${project.title}`}
                        className="w-9 h-6 object-cover rounded bg-slate-100 dark:bg-black/50 border border-slate-200 dark:border-white/10"
                      />
                      <span>{project.title}</span>
                    </td>
                    <td className="py-3 text-slate-500 dark:text-slate-400">{project.category}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          project.published
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
                            : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40'
                        }`}
                      >
                        {project.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        to={`/admin/projects/${project.id}`}
                        className="text-blue-600 dark:text-sky-400 hover:underline font-semibold"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SpotlightCard>

        {/* Real-Time Activity & Accountability Audit Log */}
        <ActivityLog />
      </div>
    </AdminLayout>
  );
};
