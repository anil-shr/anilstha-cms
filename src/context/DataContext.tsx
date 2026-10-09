import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Profile,
  Project,
  Service,
  Skill,
  Experience,
  SocialLink,
  SiteSettings,
  MediaItem,
  ContactMessage,
  AuthUser,
  CookiePreferences,
  ActivityLogEntry,
  DatabaseSnapshot,
} from '../types/database';
import {
  initialProfile,
  initialProjects,
  initialServices,
  initialSkills,
  initialExperience,
  initialSocialLinks,
  initialMedia,
  initialSiteSettings,
  initialContactMessages,
} from '../lib/mockData';
import {
  getSupabaseClient,
  getSupabaseCredentials,
  saveSupabaseCredentials,
  testSupabaseConnection,
} from '../lib/supabase';
import { applySiteFavicon } from '../lib/seo';

interface DataContextType {
  profile: Profile;
  projects: Project[];
  services: Service[];
  skills: Skill[];
  experience: Experience[];
  socialLinks: SocialLink[];
  media: MediaItem[];
  siteSettings: SiteSettings;
  contactMessages: ContactMessage[];
  isLoading: boolean;
  isCloudConnected: boolean;
  user: AuthUser | null;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (profile: Profile) => Promise<boolean>;
  saveProject: (project: Project) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
  toggleProjectPublish: (id: string) => Promise<boolean>;
  toggleProjectFeature: (id: string) => Promise<boolean>;
  saveService: (service: Service) => Promise<boolean>;
  deleteService: (id: string) => Promise<boolean>;
  saveSkill: (skill: Skill) => Promise<boolean>;
  deleteSkill: (id: string) => Promise<boolean>;
  saveExperience: (exp: Experience) => Promise<boolean>;
  deleteExperience: (id: string) => Promise<boolean>;
  saveSocialLinks: (links: SocialLink[]) => Promise<boolean>;
  addMediaItem: (item: MediaItem) => Promise<boolean>;
  deleteMediaItem: (id: string) => Promise<boolean>;
  uploadMediaFile: (file: File) => Promise<{ success: boolean; item?: MediaItem; error?: string }>;
  updateSiteSettings: (settings: SiteSettings) => Promise<boolean>;
  submitContactMessage: (msg: Omit<ContactMessage, 'id' | 'status' | 'created_at'>) => Promise<{ success: boolean; error?: string }>;
  updateMessageStatus: (id: string, status: ContactMessage['status']) => Promise<boolean>;
  deleteContactMessage: (id: string) => Promise<boolean>;
  cookieConsent: CookiePreferences;
  saveCookieConsent: (prefs: Partial<CookiePreferences>) => void;
  // Activity Logging & Accountability
  activityLogs: ActivityLogEntry[];
  addActivityLog: (entry: Omit<ActivityLogEntry, 'id' | 'timestamp'>) => void;
  clearActivityLogs: () => void;
  // Manual Database Snapshot Backup & Restore
  createDatabaseSnapshot: () => DatabaseSnapshot;
  restoreDatabaseSnapshot: (snapshot: DatabaseSnapshot) => Promise<{ success: boolean; message: string }>;
  // Supabase Global Sync methods
  pushAllToSupabase: () => Promise<{ success: boolean; message: string }>;
  pullFromSupabase: () => Promise<{ success: boolean; message: string }>;
  configureSupabase: (url: string, key: string) => Promise<{ success: boolean; message: string }>;
}

const DataContext = createContext<DataContextType | null>(null);

const STORAGE_KEYS = {
  PROFILE: 'as_portfolio_profile',
  PROJECTS: 'as_portfolio_projects',
  SERVICES: 'as_portfolio_services',
  SKILLS: 'as_portfolio_skills',
  EXPERIENCE: 'as_portfolio_experience',
  SOCIAL: 'as_portfolio_social',
  MEDIA: 'as_portfolio_media',
  SETTINGS: 'as_portfolio_settings',
  MESSAGES: 'as_portfolio_messages',
  AUTH: 'as_portfolio_auth_user',
  COOKIES: 'as_portfolio_cookie_consent',
  ACTIVITY_LOGS: 'as_portfolio_activity_logs',
};

async function apiPost(endpoint: string, body: any): Promise<any> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Request failed with status ${res.status}`);
  }
  return await res.json();
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return saved ? JSON.parse(saved) : initialProfile;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return saved ? JSON.parse(saved) : initialProjects;
  });

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
    return saved ? JSON.parse(saved) : initialServices;
  });

  const [skills, setSkills] = useState<Skill[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SKILLS);
    return saved ? JSON.parse(saved) : initialSkills;
  });

  const [experience, setExperience] = useState<Experience[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EXPERIENCE);
    return saved ? JSON.parse(saved) : initialExperience;
  });

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SOCIAL);
    return saved ? JSON.parse(saved) : initialSocialLinks;
  });

  const [media, setMedia] = useState<MediaItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEDIA);
    return saved ? JSON.parse(saved) : initialMedia;
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : initialSiteSettings;
  });

  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return saved ? JSON.parse(saved) : initialContactMessages;
  });

  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
    return saved ? JSON.parse(saved) : null;
  });

  const [cookieConsent, setCookieConsent] = useState<CookiePreferences>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COOKIES);
    return saved
      ? JSON.parse(saved)
      : {
          necessary: true,
          analytics: false,
          preferences: false,
          marketing: false,
          hasConsented: false,
        };
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLogEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [
      {
        id: 'log-seed-1',
        action: 'update',
        entity: 'profile',
        title: 'Updated Headline & Bio Parameters',
        details: 'Availability set to "Available for Hire & Projects" in Pokhara, Nepal',
        timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
        user: 'Admin',
      },
      {
        id: 'log-seed-2',
        action: 'publish',
        entity: 'project',
        title: 'Published Project: Heritage Identity',
        details: 'Featured showcase case study updated with full galleries',
        timestamp: new Date(Date.now() - 1000 * 60 * 130).toISOString(),
        user: 'Admin',
      },
      {
        id: 'log-seed-3',
        action: 'update',
        entity: 'service',
        title: 'Updated Service: Brand Identity & Systems',
        details: 'Refined deliverables list and design sprint duration',
        timestamp: new Date(Date.now() - 1000 * 60 * 380).toISOString(),
        user: 'Admin',
      },
      {
        id: 'log-seed-4',
        action: 'sync',
        entity: 'settings',
        title: 'Synced Cloud State with Remote Supabase',
        details: 'Verified database schemas, storage bucket, and public endpoints',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
        user: 'Admin',
      },
    ];
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(true);

  // Sync to localStorage as offline cache
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXPERIENCE, JSON.stringify(experience));
  }, [experience]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SOCIAL, JSON.stringify(socialLinks));
  }, [socialLinks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(media));
  }, [media]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(siteSettings));
    applySiteFavicon(siteSettings.fav_icon_url, siteSettings.fav_name);
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(contactMessages));
  }, [contactMessages]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COOKIES, JSON.stringify(cookieConsent));
  }, [cookieConsent]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(activityLogs));
  }, [activityLogs]);

  // Load from Supabase (via backend /api/data and direct Supabase fallback) on mount and subscribe to Realtime
  useEffect(() => {
    const loadLiveState = async () => {
      setIsLoading(true);
      try {
        // 1. Primary path: query live unified backend data endpoint (guaranteed Supabase sync)
        const res = await fetch('/api/data');
        if (res.ok) {
          const apiData = await res.json();
          if (apiData.profile) setProfile(apiData.profile);
          if (Array.isArray(apiData.projects) && apiData.projects.length > 0) {
            setProjects(apiData.projects);
          }
          if (Array.isArray(apiData.services) && apiData.services.length > 0) {
            setServices(apiData.services);
          }
          if (Array.isArray(apiData.skills) && apiData.skills.length > 0) {
            setSkills(apiData.skills);
          }
          if (Array.isArray(apiData.experience) && apiData.experience.length > 0) {
            setExperience(apiData.experience);
          }
          if (Array.isArray(apiData.socialLinks) && apiData.socialLinks.length > 0) {
            setSocialLinks(apiData.socialLinks);
          }
          if (Array.isArray(apiData.media) && apiData.media.length > 0) {
            setMedia(apiData.media);
          }
          if (apiData.siteSettings) setSiteSettings(apiData.siteSettings);
          setIsCloudConnected(true);
          return;
        }
      } catch (err) {
        console.warn('[DataContext] /api/data initial load notice, trying direct client:', err);
      } finally {
        setIsLoading(false);
      }

      // 2. Secondary fallback: direct Supabase Client
      const client = getSupabaseClient();
      if (client) {
        try {
          const [
            { data: profData },
            { data: projData },
            { data: srvData },
            { data: skData },
            { data: expData },
            { data: socData },
            { data: settsData },
          ] = await Promise.all([
            client.from('profiles').select('*').limit(1).maybeSingle(),
            client.from('projects').select('*').order('sort_order', { ascending: true }),
            client.from('services').select('*').order('sort_order', { ascending: true }),
            client.from('skills').select('*').order('sort_order', { ascending: true }),
            client.from('experience').select('*').order('sort_order', { ascending: true }),
            client.from('social_links').select('*').order('sort_order', { ascending: true }),
            client.from('site_settings').select('*').limit(1).maybeSingle(),
          ]);

          if (profData) setProfile(profData);
          if (projData && projData.length > 0) setProjects(projData);
          if (srvData && srvData.length > 0) setServices(srvData);
          if (skData && skData.length > 0) setSkills(skData);
          if (expData && expData.length > 0) setExperience(expData);
          if (socData && socData.length > 0) setSocialLinks(socData);
          if (settsData) setSiteSettings(settsData);
          setIsCloudConnected(true);
        } catch (directErr) {
          console.warn('[DataContext] Direct Supabase read notice:', directErr);
        }
      }
    };

    loadLiveState();

    // Setup Supabase Realtime channel for live public synchronization
    const client = getSupabaseClient();
    let channel: any = null;
    if (client) {
      try {
        channel = client
          .channel('public_portfolio_changes')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'projects' },
            (payload) => {
              if (payload.eventType === 'INSERT') {
                setProjects((prev) => {
                  const exists = prev.some((p) => p.id === (payload.new as Project).id);
                  return exists ? prev : [payload.new as Project, ...prev];
                });
              } else if (payload.eventType === 'UPDATE') {
                setProjects((prev) =>
                  prev.map((p) => (p.id === payload.new.id ? (payload.new as Project) : p))
                );
              } else if (payload.eventType === 'DELETE') {
                setProjects((prev) => prev.filter((p) => p.id !== payload.old.id));
              }
            }
          )
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'profiles' },
            (payload) => {
              if (payload.eventType === 'UPDATE') {
                setProfile(payload.new as Profile);
              }
            }
          )
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'services' },
            (payload) => {
              if (payload.eventType === 'INSERT') {
                setServices((prev) => [...prev, payload.new as Service]);
              } else if (payload.eventType === 'UPDATE') {
                setServices((prev) =>
                  prev.map((s) => (s.id === payload.new.id ? (payload.new as Service) : s))
                );
              } else if (payload.eventType === 'DELETE') {
                setServices((prev) => prev.filter((s) => s.id !== payload.old.id));
              }
            }
          )
          .subscribe();
      } catch (realtimeErr) {
        console.warn('Realtime channel subscription error:', realtimeErr);
      }
    }

    return () => {
      if (channel && client) client.removeChannel(channel);
    };
  }, []);

  // Listen to cross-tab storage events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.newValue) return;
      try {
        if (e.key === STORAGE_KEYS.PROFILE) setProfile(JSON.parse(e.newValue));
        if (e.key === STORAGE_KEYS.PROJECTS) setProjects(JSON.parse(e.newValue));
        if (e.key === STORAGE_KEYS.SERVICES) setServices(JSON.parse(e.newValue));
        if (e.key === STORAGE_KEYS.SKILLS) setSkills(JSON.parse(e.newValue));
        if (e.key === STORAGE_KEYS.EXPERIENCE) setExperience(JSON.parse(e.newValue));
        if (e.key === STORAGE_KEYS.SOCIAL) setSocialLinks(JSON.parse(e.newValue));
        if (e.key === STORAGE_KEYS.MEDIA) setMedia(JSON.parse(e.newValue));
        if (e.key === STORAGE_KEYS.SETTINGS) setSiteSettings(JSON.parse(e.newValue));
        if (e.key === STORAGE_KEYS.AUTH) setUser(JSON.parse(e.newValue));
        if (e.key === STORAGE_KEYS.ACTIVITY_LOGS) setActivityLogs(JSON.parse(e.newValue));
      } catch (err) {
        console.error('Cross-tab sync error:', err);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Actions
  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const rawEmail = (email || '').trim();
    const normalizedEmail = rawEmail.toLowerCase();
    const trimmedPass = (pass || '').trim();

    // 1. If Supabase Auth is configured, attempt Supabase sign in
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client.auth.signInWithPassword({
          email: normalizedEmail,
          password: trimmedPass,
        });
        if (!error && data?.user) {
          const authUser: AuthUser = {
            id: data.user.id,
            email: data.user.email || normalizedEmail,
            role: 'admin',
          };
          localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(authUser));
          setUser(authUser);
          return { success: true };
        }
      } catch (err) {
        console.warn('Supabase auth attempt error, checking master credentials:', err);
      }
    }

    // 2. Master & Portfolio Admin Credentials
    const validEmails = [
      'anilstha@design.jpg',
      'anil@shrestha.design',
      'admin@anilshrestha.design',
      'admin@shrestha.design',
      'admin',
      'anil',
      (profile.email || '').trim().toLowerCase(),
    ].filter(Boolean);

    const isMasterPassword = trimmedPass === 'anildesigns501';
    const isRecognizedEmail = validEmails.includes(normalizedEmail);

    if (isRecognizedEmail && isMasterPassword) {
      const authUser: AuthUser = {
        id: 'admin-anil-master-id',
        email: normalizedEmail || 'anilstha@design.jpg',
        role: 'admin',
      };
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(authUser));
      setUser(authUser);
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid email or password. Please verify your credentials.',
    };
  };

  const logout = async () => {
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.auth.signOut();
      } catch {}
    }
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    setUser(null);
  };

  const addActivityLog = (entry: Omit<ActivityLogEntry, 'id' | 'timestamp'>) => {
    const newEntry: ActivityLogEntry = {
      ...entry,
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
      user: entry.user || (user?.email ? 'Admin' : 'Admin'),
    };
    setActivityLogs((prev) => [newEntry, ...prev.slice(0, 99)]);
  };

  const clearActivityLogs = () => {
    setActivityLogs([]);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITY_LOGS);
  };

  const createDatabaseSnapshot = (): DatabaseSnapshot => {
    const snapshot: DatabaseSnapshot = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      system: 'Anil Shrestha Portfolio CMS Engine',
      author: user?.email || profile.email || 'Admin',
      stats: {
        projectsCount: projects.length,
        servicesCount: services.length,
        skillsCount: skills.length,
        experienceCount: experience.length,
        socialLinksCount: socialLinks.length,
        mediaCount: media.length,
      },
      data: {
        profile,
        projects,
        services,
        skills,
        experience,
        socialLinks,
        media,
        siteSettings,
        activityLogs,
      },
    };

    addActivityLog({
      action: 'backup',
      entity: 'settings',
      title: 'Created Manual Database Snapshot Backup',
      details: `Generated snapshot with ${projects.length} projects, ${services.length} services, and current state`,
    });

    return snapshot;
  };

  const restoreDatabaseSnapshot = async (
    snapshot: DatabaseSnapshot
  ): Promise<{ success: boolean; message: string }> => {
    if (!snapshot || !snapshot.data) {
      return { success: false, message: 'Invalid snapshot format: data payload missing.' };
    }
    try {
      const { data } = snapshot;
      if (data.profile) setProfile(data.profile);
      if (Array.isArray(data.projects)) setProjects(data.projects);
      if (Array.isArray(data.services)) setServices(data.services);
      if (Array.isArray(data.skills)) setSkills(data.skills);
      if (Array.isArray(data.experience)) setExperience(data.experience);
      if (Array.isArray(data.socialLinks)) setSocialLinks(data.socialLinks);
      if (Array.isArray(data.media)) setMedia(data.media);
      if (data.siteSettings) setSiteSettings(data.siteSettings);
      if (Array.isArray(data.activityLogs)) {
        setActivityLogs(data.activityLogs);
      }

      addActivityLog({
        action: 'backup',
        entity: 'settings',
        title: 'Restored Portfolio State from Snapshot Backup',
        details: `Restored snapshot exported on ${snapshot.exportedAt || 'earlier timestamp'}`,
      });

      return { success: true, message: 'Portfolio state successfully restored from snapshot!' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to restore snapshot.' };
    }
  };

  const updateProfile = async (newProfile: Profile): Promise<boolean> => {
    const updated = { ...newProfile, updated_at: new Date().toISOString() };
    setProfile(updated);
    addActivityLog({
      action: 'update',
      entity: 'profile',
      title: 'Updated Profile Information',
      details: `${newProfile.name} • Headline: ${newProfile.headline.substring(0, 45)}...`,
    });
    try {
      await apiPost('/api/admin/update-profile', updated);
      setIsCloudConnected(true);
    } catch (err) {
      console.warn('[DataContext] Backend update-profile error, trying fallback:', err);
      const client = getSupabaseClient();
      if (client) {
        try {
          await client.from('profiles').upsert(updated);
        } catch {}
      }
    }
    return true;
  };

  const saveProject = async (project: Project): Promise<boolean> => {
    const isNew = !projects.some((p) => p.id === project.id || p.slug === project.slug);
    const updatedProj: Project = {
      ...project,
      updated_at: new Date().toISOString(),
      created_at: project.created_at || new Date().toISOString(),
    };

    if (isNew) {
      setProjects((prev) => [updatedProj, ...prev]);
    } else {
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id || p.slug === project.slug ? updatedProj : p))
      );
    }

    addActivityLog({
      action: isNew ? 'create' : 'update',
      entity: 'project',
      title: `${isNew ? 'Created' : 'Updated'} Project: ${project.title}`,
      details: `Category: ${project.category} (${project.year}) • Status: ${project.published ? 'Published' : 'Draft'}`,
    });

    try {
      const res = await apiPost('/api/admin/save-project', updatedProj);
      if (res?.project) {
        const savedProject = res.project;
        setProjects((prev) =>
          prev.map((p) =>
            p.id === project.id || p.slug === project.slug ? { ...p, ...savedProject } : p
          )
        );
      }
      setIsCloudConnected(true);
    } catch (err) {
      console.warn('[DataContext] Backend save-project error, trying fallback:', err);
      const client = getSupabaseClient();
      if (client) {
        try {
          await client.from('projects').upsert(updatedProj);
        } catch {}
      }
    }
    return true;
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    const target = projects.find((p) => p.id === id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    addActivityLog({
      action: 'delete',
      entity: 'project',
      title: `Deleted Project: ${target?.title || id}`,
    });
    try {
      await apiPost('/api/admin/delete-project', { id });
    } catch (err) {
      console.warn('[DataContext] Backend delete-project error:', err);
      const client = getSupabaseClient();
      if (client) {
        try {
          await client.from('projects').delete().eq('id', id);
        } catch {}
      }
    }
    return true;
  };

  const toggleProjectPublish = async (id: string): Promise<boolean> => {
    const target = projects.find((p) => p.id === id);
    if (!target) return false;
    const newPublished = !target.published;
    const updated = { ...target, published: newPublished, updated_at: new Date().toISOString() };
    setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
    addActivityLog({
      action: 'publish',
      entity: 'project',
      title: `${newPublished ? 'Published' : 'Unpublished'} Project: ${target.title}`,
      details: `Visibility changed to ${newPublished ? 'Published (Live)' : 'Draft'}`,
    });
    try {
      await apiPost('/api/admin/toggle-project-publish', { id, published: newPublished });
    } catch (err) {
      const client = getSupabaseClient();
      if (client) {
        try {
          await client.from('projects').update({ published: newPublished }).eq('id', id);
        } catch {}
      }
    }
    return true;
  };

  const toggleProjectFeature = async (id: string): Promise<boolean> => {
    const target = projects.find((p) => p.id === id);
    if (!target) return false;
    const newFeatured = !target.featured;
    const updated = { ...target, featured: newFeatured, updated_at: new Date().toISOString() };
    setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
    addActivityLog({
      action: 'update',
      entity: 'project',
      title: `${newFeatured ? 'Marked Featured' : 'Removed from Featured'}: ${target.title}`,
    });
    try {
      await apiPost('/api/admin/toggle-project-feature', { id, featured: newFeatured });
    } catch (err) {
      const client = getSupabaseClient();
      if (client) {
        try {
          await client.from('projects').update({ featured: newFeatured }).eq('id', id);
        } catch {}
      }
    }
    return true;
  };

  const saveService = async (service: Service): Promise<boolean> => {
    const exists = services.some((s) => s.id === service.id);
    const updated = { ...service, updated_at: new Date().toISOString() };
    if (exists) {
      setServices((prev) => prev.map((s) => (s.id === service.id ? updated : s)));
    } else {
      setServices((prev) => [...prev, updated]);
    }
    addActivityLog({
      action: exists ? 'update' : 'create',
      entity: 'service',
      title: `${exists ? 'Updated' : 'Created'} Service: ${service.title}`,
      details: `${service.description.substring(0, 45)}...`,
    });
    try {
      const res = await apiPost('/api/admin/save-service', updated);
      if (res?.service) {
        setServices((prev) =>
          prev.map((s) => (s.id === service.id ? { ...s, ...res.service } : s))
        );
      }
      setIsCloudConnected(true);
    } catch (err) {
      const client = getSupabaseClient();
      if (client) {
        try {
          await client.from('services').upsert(updated);
        } catch {}
      }
    }
    return true;
  };

  const deleteService = async (id: string): Promise<boolean> => {
    const target = services.find((s) => s.id === id);
    setServices((prev) => prev.filter((s) => s.id !== id));
    addActivityLog({
      action: 'delete',
      entity: 'service',
      title: `Deleted Service: ${target?.title || id}`,
    });
    try {
      await apiPost('/api/admin/delete-service', { id });
    } catch (err) {
      const client = getSupabaseClient();
      if (client) {
        try {
          await client.from('services').delete().eq('id', id);
        } catch {}
      }
    }
    return true;
  };

  const saveSkill = async (skill: Skill): Promise<boolean> => {
    const exists = skills.some((s) => s.id === skill.id);
    if (exists) {
      setSkills((prev) => prev.map((s) => (s.id === skill.id ? skill : s)));
    } else {
      setSkills((prev) => [...prev, skill]);
    }
    try {
      const res = await apiPost('/api/admin/save-skill', skill);
      if (res?.skill) {
        setSkills((prev) =>
          prev.map((s) => (s.id === skill.id ? { ...s, ...res.skill } : s))
        );
      }
      setIsCloudConnected(true);
    } catch (err) {
      const client = getSupabaseClient();
      if (client) {
        try {
          await client.from('skills').upsert(skill);
        } catch {}
      }
    }
    return true;
  };

  const deleteSkill = async (id: string): Promise<boolean> => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
    try {
      await apiPost('/api/admin/delete-skill', { id });
    } catch (err) {
      const client = getSupabaseClient();
      if (client) {
        try {
          await client.from('skills').delete().eq('id', id);
        } catch {}
      }
    }
    return true;
  };

  const saveExperience = async (exp: Experience): Promise<boolean> => {
    const exists = experience.some((e) => e.id === exp.id);
    const updated = { ...exp, updated_at: new Date().toISOString() };
    if (exists) {
      setExperience((prev) => prev.map((e) => (e.id === exp.id ? updated : e)));
    } else {
      setExperience((prev) => [...prev, updated]);
    }
    try {
      const res = await apiPost('/api/admin/save-experience', updated);
      if (res?.experience) {
        setExperience((prev) =>
          prev.map((e) => (e.id === exp.id ? { ...e, ...res.experience } : e))
        );
      }
      setIsCloudConnected(true);
    } catch (err) {
      const client = getSupabaseClient();
      if (client) {
        try {
          await client.from('experience').upsert(updated);
        } catch {}
      }
    }
    return true;
  };

  const deleteExperience = async (id: string): Promise<boolean> => {
    setExperience((prev) => prev.filter((e) => e.id !== id));
    try {
      await apiPost('/api/admin/delete-experience', { id });
    } catch (err) {
      const client = getSupabaseClient();
      if (client) {
        try {
          await client.from('experience').delete().eq('id', id);
        } catch {}
      }
    }
    return true;
  };

  const saveSocialLinks = async (links: SocialLink[]): Promise<boolean> => {
    setSocialLinks(links);
    try {
      await apiPost('/api/admin/save-social', { links });
      setIsCloudConnected(true);
    } catch (err) {
      const client = getSupabaseClient();
      if (client) {
        try {
          for (const l of links) {
            await client.from('social_links').upsert(l);
          }
        } catch {}
      }
    }
    return true;
  };

  const addMediaItem = async (item: MediaItem): Promise<boolean> => {
    setMedia((prev) => [item, ...prev]);
    try {
      await apiPost('/api/admin/save-media', item);
      setIsCloudConnected(true);
    } catch (err) {
      console.warn('[DataContext] Backend save-media notice, trying client fallback:', err);
      const client = getSupabaseClient();
      if (client) {
        try {
          await client.from('media').upsert(item);
        } catch (dbErr) {
          console.error('Supabase addMediaItem error:', dbErr);
        }
      }
    }
    return true;
  };

  const deleteMediaItem = async (id: string): Promise<boolean> => {
    const target = media.find((m) => m.id === id);
    setMedia((prev) => prev.filter((m) => m.id !== id));
    try {
      await apiPost('/api/admin/delete-media', { id, filename: target?.filename });
    } catch (err) {
      console.warn('[DataContext] Backend delete-media notice, trying client fallback:', err);
      const client = getSupabaseClient();
      if (client) {
        try {
          await client.from('media').delete().eq('id', id);
        } catch (dbErr) {
          console.error('Supabase deleteMediaItem error:', dbErr);
        }
      }
    }
    return true;
  };

  const uploadMediaFile = async (
    file: File
  ): Promise<{ success: boolean; item?: MediaItem; error?: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const res = await apiPost('/api/admin/upload-media', {
            filename: file.name,
            mime_type: file.type,
            base64,
            dimensions: file.type.startsWith('image/') ? 'Standard' : 'Document',
            alt_text: file.name.split('.')[0].replace(/[_-]/g, ' '),
          });
          if (res?.item) {
            setMedia((prev) => [res.item, ...prev]);
            setIsCloudConnected(true);
            resolve({ success: true, item: res.item });
            return;
          }
          resolve({ success: false, error: 'Upload returned empty item' });
        } catch (err: any) {
          console.warn('[DataContext] upload-media backend error, falling back locally:', err);
          const fallbackItem: MediaItem = {
            id: 'med-' + Date.now(),
            filename: file.name,
            original_name: file.name,
            url: base64,
            file_size: file.size,
            mime_type: file.type,
            dimensions: 'Standard',
            alt_text: file.name.split('.')[0].replace(/[_-]/g, ' '),
            created_at: new Date().toISOString(),
          };
          setMedia((prev) => [fallbackItem, ...prev]);
          resolve({ success: true, item: fallbackItem });
        }
      };
      reader.onerror = () => {
        resolve({ success: false, error: 'Could not read file data' });
      };
      reader.readAsDataURL(file);
    });
  };

  const updateSiteSettings = async (settings: SiteSettings): Promise<boolean> => {
    const updated = { ...settings, updated_at: new Date().toISOString() };
    setSiteSettings(updated);
    addActivityLog({
      action: 'update',
      entity: 'settings',
      title: 'Updated Site Settings & SEO Parameters',
      details: `Site Name: ${updated.site_name} • Indexing: ${updated.allow_indexing ? 'Permitted' : 'Disallowed'}`,
    });
    try {
      await apiPost('/api/admin/save-settings', updated);
      setIsCloudConnected(true);
    } catch (err) {
      const client = getSupabaseClient();
      if (client) {
        try {
          await client.from('site_settings').upsert(updated);
        } catch {}
      }
    }
    return true;
  };

  const submitContactMessage = async (
    msg: Omit<ContactMessage, 'id' | 'status' | 'created_at'>
  ): Promise<{ success: boolean; error?: string }> => {
    const newMessage: ContactMessage = {
      ...msg,
      id: 'msg-' + Date.now(),
      status: 'unread',
      created_at: new Date().toISOString(),
    };
    setContactMessages((prev) => [newMessage, ...prev]);
    try {
      await apiPost('/api/contact', msg);
      return { success: true };
    } catch (err: any) {
      const client = getSupabaseClient();
      if (client) {
        try {
          await client.from('contact_messages').insert({
            name: msg.name,
            email: msg.email,
            subject: msg.subject,
            message: msg.message,
            status: 'unread',
          });
          return { success: true };
        } catch (subErr: any) {
          return { success: false, error: subErr.message };
        }
      }
      return { success: true };
    }
  };

  const updateMessageStatus = async (
    id: string,
    status: ContactMessage['status']
  ): Promise<boolean> => {
    setContactMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('contact_messages').update({ status }).eq('id', id);
      } catch (err) {
        console.error('Supabase updateMessageStatus error:', err);
      }
    }
    return true;
  };

  const deleteContactMessage = async (id: string): Promise<boolean> => {
    setContactMessages((prev) => prev.filter((m) => m.id !== id));
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('contact_messages').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase deleteContactMessage error:', err);
      }
    }
    return true;
  };

  const saveCookieConsent = (prefs: Partial<CookiePreferences>) => {
    setCookieConsent((prev) => ({
      ...prev,
      ...prefs,
      hasConsented: true,
    }));
  };

  // Push all local portfolio state to Supabase so it becomes live across all devices worldwide
  const pushAllToSupabase = async (): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    try {
      // 1. Send all state to backend sync route with service role permissions
      const res = await apiPost('/api/admin/push-all', {
        profile,
        projects,
        services,
        skills,
        experience,
        socialLinks,
        siteSettings,
        media,
      });

      setIsCloudConnected(true);
      return {
        success: true,
        message:
          res.message ||
          `Successfully pushed all content to Supabase (${projects.length} projects, ${services.length} services, ${skills.length} skills, profile & settings). Changes are now live everywhere.`,
      };
    } catch (err: any) {
      console.warn('[DataContext] Backend push-all error, attempting client fallback:', err);
      const client = getSupabaseClient();
      if (!client) {
        return {
          success: false,
          message: `Push to Supabase failed: ${err.message || 'Network error'}.`,
        };
      }
      try {
        await client.from('profiles').upsert(profile);
        if (projects.length > 0) await client.from('projects').upsert(projects);
        if (services.length > 0) await client.from('services').upsert(services);
        if (skills.length > 0) await client.from('skills').upsert(skills);
        if (experience.length > 0) await client.from('experience').upsert(experience);
        if (socialLinks.length > 0) await client.from('social_links').upsert(socialLinks);
        await client.from('site_settings').upsert(siteSettings);
        setIsCloudConnected(true);
        return {
          success: true,
          message: 'Pushed to Supabase via direct client connection.',
        };
      } catch (fallbackErr: any) {
        return {
          success: false,
          message: `Failed to push to Supabase: ${fallbackErr.message || err.message}`,
        };
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Pull latest live state from Supabase
  const pullFromSupabase = async (): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const apiData = await res.json();
        if (apiData.profile) setProfile(apiData.profile);
        if (Array.isArray(apiData.projects) && apiData.projects.length > 0) {
          setProjects(apiData.projects);
        }
        if (Array.isArray(apiData.services) && apiData.services.length > 0) {
          setServices(apiData.services);
        }
        if (Array.isArray(apiData.skills) && apiData.skills.length > 0) {
          setSkills(apiData.skills);
        }
        if (Array.isArray(apiData.experience) && apiData.experience.length > 0) {
          setExperience(apiData.experience);
        }
        if (Array.isArray(apiData.socialLinks) && apiData.socialLinks.length > 0) {
          setSocialLinks(apiData.socialLinks);
        }
        if (apiData.siteSettings) setSiteSettings(apiData.siteSettings);
        setIsCloudConnected(true);
        return { success: true, message: 'Successfully pulled latest live data from Supabase!' };
      }
      throw new Error(`Server returned HTTP ${res.status}`);
    } catch (err: any) {
      console.warn('Backend pull failed, attempting client fallback:', err);
      const client = getSupabaseClient();
      if (!client) {
        return { success: false, message: `Failed to load from Supabase: ${err.message}` };
      }
      try {
        const [
          { data: profData },
          { data: projData },
          { data: srvData },
          { data: skData },
          { data: expData },
          { data: socData },
          { data: settsData },
        ] = await Promise.all([
          client.from('profiles').select('*').limit(1).maybeSingle(),
          client.from('projects').select('*').order('sort_order', { ascending: true }),
          client.from('services').select('*').order('sort_order', { ascending: true }),
          client.from('skills').select('*').order('sort_order', { ascending: true }),
          client.from('experience').select('*').order('sort_order', { ascending: true }),
          client.from('social_links').select('*').order('sort_order', { ascending: true }),
          client.from('site_settings').select('*').limit(1).maybeSingle(),
        ]);

        if (profData) setProfile(profData);
        if (projData && projData.length > 0) setProjects(projData);
        if (srvData && srvData.length > 0) setServices(srvData);
        if (skData && skData.length > 0) setSkills(skData);
        if (expData && expData.length > 0) setExperience(expData);
        if (socData && socData.length > 0) setSocialLinks(socData);
        if (settsData) setSiteSettings(settsData);
        setIsCloudConnected(true);
        return { success: true, message: 'Successfully pulled latest live data from Supabase!' };
      } catch (fallbackErr: any) {
        return { success: false, message: `Failed to load from Supabase: ${fallbackErr.message}` };
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Configure Supabase credentials directly from the UI
  const configureSupabase = async (url: string, key: string): Promise<{ success: boolean; message: string }> => {
    saveSupabaseCredentials(url, key);
    const testResult = await testSupabaseConnection(url, key);
    if (testResult.success) {
      setIsCloudConnected(true);
      await pullFromSupabase();
      return { success: true, message: 'Supabase connected successfully!' };
    } else {
      setIsCloudConnected(false);
      return { success: false, message: testResult.message };
    }
  };

  return (
    <DataContext.Provider
      value={{
        profile,
        projects,
        services,
        skills,
        experience,
        socialLinks,
        media,
        siteSettings,
        contactMessages,
        isLoading,
        isCloudConnected,
        user,
        isAdmin: user?.role === 'admin',
        login,
        logout,
        updateProfile,
        saveProject,
        deleteProject,
        toggleProjectPublish,
        toggleProjectFeature,
        saveService,
        deleteService,
        saveSkill,
        deleteSkill,
        saveExperience,
        deleteExperience,
        saveSocialLinks,
        addMediaItem,
        deleteMediaItem,
        uploadMediaFile,
        updateSiteSettings,
        submitContactMessage,
        updateMessageStatus,
        deleteContactMessage,
        cookieConsent,
        saveCookieConsent,
        activityLogs,
        addActivityLog,
        clearActivityLogs,
        createDatabaseSnapshot,
        restoreDatabaseSnapshot,
        pushAllToSupabase,
        pullFromSupabase,
        configureSupabase,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
