import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  CookiePreferences,
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
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthUser {
  id: string;
  email: string;
  role: string;
}

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
  updateSiteSettings: (settings: SiteSettings) => Promise<boolean>;
  submitContactMessage: (msg: Omit<ContactMessage, 'id' | 'status' | 'created_at'>) => Promise<{ success: boolean; error?: string }>;
  updateMessageStatus: (id: string, status: ContactMessage['status']) => Promise<boolean>;
  deleteContactMessage: (id: string) => Promise<boolean>;
  cookieConsent: CookiePreferences;
  saveCookieConsent: (prefs: Partial<CookiePreferences>) => void;
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
};

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

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(isSupabaseConfigured);

  // Sync to localStorage
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

  // Load from Supabase if connected
  useEffect(() => {
    const client = supabase;
    if (!client || !isSupabaseConfigured) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [
          { data: profData },
          { data: projData },
          { data: srvData },
          { data: skData },
          { data: expData },
          { data: socData },
          { data: medData },
          { data: settsData },
        ] = await Promise.all([
          client.from('profiles').select('*').limit(1).single(),
          client.from('projects').select('*').order('sort_order', { ascending: true }),
          client.from('services').select('*').order('sort_order', { ascending: true }),
          client.from('skills').select('*').order('sort_order', { ascending: true }),
          client.from('experience').select('*').order('sort_order', { ascending: true }),
          client.from('social_links').select('*').order('sort_order', { ascending: true }),
          client.from('media').select('*').order('created_at', { ascending: false }),
          client.from('site_settings').select('*').limit(1).single(),
        ]);

        if (profData) setProfile(profData);
        if (projData && projData.length > 0) setProjects(projData);
        if (srvData && srvData.length > 0) setServices(srvData);
        if (skData && skData.length > 0) setSkills(skData);
        if (expData && expData.length > 0) setExperience(expData);
        if (socData && socData.length > 0) setSocialLinks(socData);
        if (medData && medData.length > 0) setMedia(medData);
        if (settsData) setSiteSettings(settsData);

        setIsCloudConnected(true);
      } catch (err) {
        console.warn('Supabase fetch notice: using local synchronized state', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Setup Supabase Realtime channel for live public synchronization
    const channel = client
      .channel('public_portfolio_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProjects((prev) => [...prev, payload.new as Project]);
          } else if (payload.eventType === 'UPDATE') {
            setProjects((prev) =>
              prev.map((p) => (p.id === payload.new.id ? (payload.new as Project) : p))
            );
          } else if (payload.eventType === 'DELETE') {
            setProjects((prev) => prev.filter((p) => p.id === payload.old.id));
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
      .subscribe();

    return () => {
      client.removeChannel(channel);
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
    if (supabase && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
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
        console.warn('Supabase auth attempt error, checking master admin credentials:', err);
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
      // Write synchronously to localStorage so redirects and page reloads have instant auth state
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
    if (supabase && isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    setUser(null);
  };

  const updateProfile = async (newProfile: Profile): Promise<boolean> => {
    const updated = { ...newProfile, updated_at: new Date().toISOString() };
    setProfile(updated);
    if (supabase && isSupabaseConfigured) {
      await supabase.from('profiles').upsert(updated);
    }
    return true;
  };

  const saveProject = async (project: Project): Promise<boolean> => {
    const isNew = !projects.some((p) => p.id === project.id);
    const updatedProj = {
      ...project,
      updated_at: new Date().toISOString(),
      created_at: project.created_at || new Date().toISOString(),
    };

    if (isNew) {
      setProjects((prev) => [updatedProj, ...prev]);
    } else {
      setProjects((prev) => prev.map((p) => (p.id === project.id ? updatedProj : p)));
    }

    if (supabase && isSupabaseConfigured) {
      await supabase.from('projects').upsert(updatedProj);
    }
    return true;
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (supabase && isSupabaseConfigured) {
      await supabase.from('projects').delete().eq('id', id);
    }
    return true;
  };

  const toggleProjectPublish = async (id: string): Promise<boolean> => {
    const target = projects.find((p) => p.id === id);
    if (!target) return false;
    const updated = { ...target, published: !target.published, updated_at: new Date().toISOString() };
    setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
    if (supabase && isSupabaseConfigured) {
      await supabase.from('projects').update({ published: updated.published }).eq('id', id);
    }
    return true;
  };

  const toggleProjectFeature = async (id: string): Promise<boolean> => {
    const target = projects.find((p) => p.id === id);
    if (!target) return false;
    const updated = { ...target, featured: !target.featured, updated_at: new Date().toISOString() };
    setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
    if (supabase && isSupabaseConfigured) {
      await supabase.from('projects').update({ featured: updated.featured }).eq('id', id);
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
    if (supabase && isSupabaseConfigured) {
      await supabase.from('services').upsert(updated);
    }
    return true;
  };

  const deleteService = async (id: string): Promise<boolean> => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    if (supabase && isSupabaseConfigured) {
      await supabase.from('services').delete().eq('id', id);
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
    if (supabase && isSupabaseConfigured) {
      await supabase.from('skills').upsert(skill);
    }
    return true;
  };

  const deleteSkill = async (id: string): Promise<boolean> => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
    if (supabase && isSupabaseConfigured) {
      await supabase.from('skills').delete().eq('id', id);
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
    if (supabase && isSupabaseConfigured) {
      await supabase.from('experience').upsert(updated);
    }
    return true;
  };

  const deleteExperience = async (id: string): Promise<boolean> => {
    setExperience((prev) => prev.filter((e) => e.id !== id));
    if (supabase && isSupabaseConfigured) {
      await supabase.from('experience').delete().eq('id', id);
    }
    return true;
  };

  const saveSocialLinks = async (links: SocialLink[]): Promise<boolean> => {
    setSocialLinks(links);
    if (supabase && isSupabaseConfigured) {
      for (const l of links) {
        await supabase.from('social_links').upsert(l);
      }
    }
    return true;
  };

  const addMediaItem = async (item: MediaItem): Promise<boolean> => {
    setMedia((prev) => [item, ...prev]);
    if (supabase && isSupabaseConfigured) {
      await supabase.from('media').insert(item);
    }
    return true;
  };

  const deleteMediaItem = async (id: string): Promise<boolean> => {
    setMedia((prev) => prev.filter((m) => m.id !== id));
    if (supabase && isSupabaseConfigured) {
      await supabase.from('media').delete().eq('id', id);
    }
    return true;
  };

  const updateSiteSettings = async (settings: SiteSettings): Promise<boolean> => {
    const updated = { ...settings, updated_at: new Date().toISOString() };
    setSiteSettings(updated);
    if (supabase && isSupabaseConfigured) {
      await supabase.from('site_settings').upsert(updated);
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
    if (supabase && isSupabaseConfigured) {
      const { error } = await supabase.from('contact_messages').insert({
        name: msg.name,
        email: msg.email,
        subject: msg.subject,
        message: msg.message,
      });
      if (error) return { success: false, error: error.message };
    }
    return { success: true };
  };

  const updateMessageStatus = async (
    id: string,
    status: ContactMessage['status']
  ): Promise<boolean> => {
    setContactMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
    if (supabase && isSupabaseConfigured) {
      await supabase.from('contact_messages').update({ status }).eq('id', id);
    }
    return true;
  };

  const deleteContactMessage = async (id: string): Promise<boolean> => {
    setContactMessages((prev) => prev.filter((m) => m.id !== id));
    if (supabase && isSupabaseConfigured) {
      await supabase.from('contact_messages').delete().eq('id', id);
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
        updateSiteSettings,
        submitContactMessage,
        updateMessageStatus,
        deleteContactMessage,
        cookieConsent,
        saveCookieConsent,
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
