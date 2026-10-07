-- ==============================================================================
-- Portfolio & CMS Migration for Anil Shrestha (Graphic Designer - Nepal)
-- Compatible with Frontend Schema & Text Identifiers
-- ==============================================================================

-- 1. Enable UUID Extension (optional utility)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID,
  name TEXT NOT NULL DEFAULT 'Anil Shrestha',
  profession TEXT NOT NULL DEFAULT 'Graphic Designer & UI/UX Specialist',
  headline TEXT NOT NULL DEFAULT 'Creative designer turning ideas into visual experiences.',
  short_bio TEXT NOT NULL DEFAULT 'Crafting meaningful visual identities, intuitive web & mobile interfaces, marketing collateral, and precision print solutions.',
  long_bio TEXT NOT NULL DEFAULT 'Creative designer with specialized experience in visual communication, branding systems, and intuitive UI/UX design. Based in Pokhara, Nepal.',
  location TEXT NOT NULL DEFAULT 'Pokhara, Nepal',
  email TEXT NOT NULL DEFAULT 'hello@anilshrestha.design',
  availability TEXT NOT NULL DEFAULT 'Available for Hire & Projects',
  profile_image_url TEXT,
  hero_heading TEXT NOT NULL DEFAULT 'Creative designer turning ideas into visual experiences.',
  hero_description TEXT NOT NULL DEFAULT 'Crafting meaningful visual identities, intuitive web & mobile interfaces, marketing collateral, and precision print solutions.',
  primary_cta_label TEXT NOT NULL DEFAULT 'Explore My Work',
  primary_cta_url TEXT NOT NULL DEFAULT '/work',
  secondary_cta_label TEXT NOT NULL DEFAULT 'View Services',
  secondary_cta_url TEXT NOT NULL DEFAULT '/services',
  resume_url TEXT DEFAULT '/resume',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL DEFAULT 'Brand Identity',
  subcategory TEXT,
  tags TEXT[] DEFAULT '{}',
  description TEXT NOT NULL,
  short_description TEXT,
  full_description TEXT,
  year TEXT NOT NULL DEFAULT '2026',
  client TEXT,
  role TEXT DEFAULT 'Lead Graphic Designer',
  services TEXT[] DEFAULT '{}',
  tools TEXT[] DEFAULT '{}',
  challenge TEXT,
  solution TEXT,
  result TEXT,
  approach TEXT,
  cover_image_url TEXT,
  gallery_urls TEXT[] DEFAULT '{}',
  project_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  published BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  og_image_url TEXT,
  alt_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_published ON public.projects(published);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON public.projects(sort_order);

-- 4. Services Table
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT DEFAULT 'layout',
  custom_icon_url TEXT,
  deliverables TEXT[] DEFAULT '{}',
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Core Disciplines',
  custom_icon_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Experience Table
CREATE TABLE IF NOT EXISTS public.experience (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  description TEXT,
  start_date TEXT NOT NULL,
  end_date TEXT,
  current BOOLEAN NOT NULL DEFAULT false,
  location TEXT DEFAULT 'Nepal',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Social Links Table
CREATE TABLE IF NOT EXISTS public.social_links (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  custom_icon_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Media Library Table
CREATE TABLE IF NOT EXISTS public.media (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  dimensions TEXT,
  alt_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  site_name TEXT NOT NULL DEFAULT 'Anil Shrestha Portfolio & CMS',
  ga_id TEXT,
  google_site_verification TEXT,
  contact_email TEXT DEFAULT 'hello@anilshrestha.design',
  allow_indexing BOOLEAN NOT NULL DEFAULT true,
  maintenance_mode BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Contact Messages Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  services TEXT,
  status TEXT NOT NULL DEFAULT 'unread',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- Permissive Row Level Security (RLS) Policies for Public Portfolio
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all content
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public Read Projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public Read Services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Public Read Skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public Read Experience" ON public.experience FOR SELECT USING (true);
CREATE POLICY "Public Read Social" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "Public Read Media" ON public.media FOR SELECT USING (true);
CREATE POLICY "Public Read Settings" ON public.site_settings FOR SELECT USING (true);

-- Allow updates & inserts (CMS Admin operations)
CREATE POLICY "Full Access Profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Services" ON public.services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Skills" ON public.skills FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Experience" ON public.experience FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Social" ON public.social_links FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Media" ON public.media FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Messages" ON public.contact_messages FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- Storage Bucket (portfolio-media)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Storage Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio-media');

CREATE POLICY "Full Storage Upload" ON storage.objects
  FOR ALL USING (bucket_id = 'portfolio-media') WITH CHECK (bucket_id = 'portfolio-media');
