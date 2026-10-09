export interface Profile {
  id: string;
  user_id?: string;
  name: string;
  profession: string;
  headline: string;
  short_bio: string;
  long_bio: string;
  location: string;
  email: string;
  availability: string;
  profile_image_url: string;
  hero_heading: string;
  hero_description: string;
  primary_cta_label: string;
  primary_cta_url: string;
  secondary_cta_label: string;
  secondary_cta_url: string;
  resume_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProcessStep {
  title: string;
  description: string;
  image?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  subcategory?: string;
  tags?: string[];
  description: string;
  shortDescription?: string;
  fullDescription?: string;
  year: string;
  client?: string;
  role?: string;
  services: string[];
  tools: string[];
  challenge?: string;
  solution?: string;
  approach?: string;
  result?: string;
  quote?: string;
  processSteps?: ProcessStep[];
  cover_image_url: string;
  gallery_urls: string[];
  project_url?: string;
  featured: boolean;
  published: boolean;
  sort_order: number;
  seo_title?: string;
  seo_description?: string;
  og_image_url?: string;
  alt_text?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string;
  custom_icon_url?: string;
  deliverables?: string[];
  featured: boolean;
  sort_order: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  sort_order: number;
  custom_icon_url?: string;
  created_at?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  description?: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  location?: string;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface SocialLink {
  id: string;
  platform: 'Instagram' | 'Facebook' | 'LinkedIn' | 'Behance' | 'Dribbble' | 'GitHub' | 'TikTok' | 'X' | 'YouTube' | string;
  url: string;
  sort_order: number;
  active: boolean;
  custom_icon_url?: string;
  created_at?: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  original_name: string;
  url: string;
  file_size: number;
  mime_type: string;
  dimensions?: string;
  alt_text?: string;
  created_at: string;
}

export interface PageMetaItem {
  title?: string;
  description?: string;
  og_image?: string;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  logo_url?: string;
  logo_text?: string;
  fav_icon_url?: string;
  fav_name?: string;
  ga_id?: string;
  google_site_verification?: string;
  contact_email: string;
  allow_indexing: boolean;
  maintenance_mode: boolean;
  page_meta?: Record<string, PageMetaItem>;
  updated_at?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  created_at: string;
}

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  preferences: boolean;
  marketing: boolean;
  hasConsented: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  role: 'admin';
}

export interface ActivityLogEntry {
  id: string;
  action: 'create' | 'update' | 'delete' | 'publish' | 'backup' | 'sync';
  entity: 'project' | 'service' | 'profile' | 'skill' | 'experience' | 'social' | 'media' | 'settings';
  title: string;
  details?: string;
  timestamp: string;
  user?: string;
}

export interface DatabaseSnapshot {
  version: string;
  exportedAt: string;
  system: string;
  author: string;
  stats: {
    projectsCount: number;
    servicesCount: number;
    skillsCount: number;
    experienceCount: number;
    socialLinksCount: number;
    mediaCount: number;
  };
  data: {
    profile: Profile;
    projects: Project[];
    services: Service[];
    skills: Skill[];
    experience: Experience[];
    socialLinks: SocialLink[];
    media: MediaItem[];
    siteSettings: SiteSettings;
    activityLogs?: ActivityLogEntry[];
  };
}

