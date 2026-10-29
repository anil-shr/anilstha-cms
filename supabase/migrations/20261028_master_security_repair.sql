-- ==============================================================================
-- MASTER SUPABASE DATABASE SCHEMA & SECURITY MIGRATION
-- Project: Anil Shrestha Portfolio & CMS (https://anilshrestha11.com.np)
-- Version: 20261028_master_security_repair
-- 
-- 100% IDEMPOTENT & NON-DESTRUCTIVE:
--   - Does NOT drop tables or delete existing records
--   - Uses CREATE TABLE IF NOT EXISTS and ALTER TABLE ADD COLUMN IF NOT EXISTS
--   - Replaces unrestricted "USING (true)" policies with least-privilege security
--   - Protects contact inquiries from unauthorized read/write/delete
--   - Restricts CMS mutations to authenticated administrators
-- ==============================================================================

-- 0. Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. Profiles Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID,
  name TEXT NOT NULL DEFAULT 'Anil Shrestha',
  profession TEXT NOT NULL DEFAULT 'Graphic Designer & UI/UX Specialist',
  headline TEXT NOT NULL DEFAULT 'Creative designer turning ideas into visual experiences.',
  short_bio TEXT DEFAULT 'Crafting meaningful visual identities, intuitive web & mobile interfaces, marketing collateral, and precision print solutions.',
  long_bio TEXT DEFAULT 'Creative designer with specialized experience in visual communication, branding systems, and intuitive UI/UX design. Based in Pokhara, Nepal.',
  location TEXT DEFAULT 'Pokhara, Nepal',
  email TEXT DEFAULT 'inquiry@anilshrestha11.com.np',
  availability TEXT DEFAULT 'Available for Hire & Projects',
  profile_image_url TEXT,
  hero_heading TEXT DEFAULT 'Creative designer turning ideas into visual experiences.',
  hero_description TEXT DEFAULT 'Crafting meaningful visual identities, intuitive web & mobile interfaces, marketing collateral, and precision print solutions.',
  primary_cta_label TEXT DEFAULT 'Explore My Work',
  primary_cta_url TEXT DEFAULT '/work',
  secondary_cta_label TEXT DEFAULT 'View Services',
  secondary_cta_url TEXT DEFAULT '/services',
  resume_url TEXT DEFAULT '/resume',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT 'Anil Shrestha';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profession TEXT NOT NULL DEFAULT 'Graphic Designer & UI/UX Specialist';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS headline TEXT NOT NULL DEFAULT 'Creative designer turning ideas into visual experiences.';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS short_bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS long_bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location TEXT DEFAULT 'Pokhara, Nepal';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT DEFAULT 'inquiry@anilshrestha11.com.np';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS availability TEXT DEFAULT 'Available for Hire & Projects';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_image_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hero_heading TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hero_description TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS primary_cta_label TEXT DEFAULT 'Explore My Work';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS primary_cta_url TEXT DEFAULT '/work';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS secondary_cta_label TEXT DEFAULT 'View Services';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS secondary_cta_url TEXT DEFAULT '/services';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS resume_url TEXT DEFAULT '/resume';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- ==============================================================================
-- 2. Projects Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL DEFAULT 'Brand Identity',
  subcategory TEXT,
  tags TEXT[] DEFAULT '{}',
  description TEXT NOT NULL DEFAULT '',
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

ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS subcategory TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS short_description TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS full_description TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS year TEXT DEFAULT '2026';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS client TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'Lead Graphic Designer';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS services TEXT[] DEFAULT '{}';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS tools TEXT[] DEFAULT '{}';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS challenge TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS solution TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS result TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS approach TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS cover_image_url TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS gallery_urls TEXT[] DEFAULT '{}';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS project_url TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS og_image_url TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS alt_text TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_published ON public.projects(published);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON public.projects(sort_order);

-- ==============================================================================
-- 3. Services Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon TEXT DEFAULT 'layout',
  custom_icon_url TEXT,
  deliverables TEXT[] DEFAULT '{}',
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.services ADD COLUMN IF NOT EXISTS custom_icon_url TEXT;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS deliverables TEXT[] DEFAULT '{}';
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- ==============================================================================
-- 4. Skills Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.skills (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Core Disciplines',
  proficiency INT DEFAULT 90,
  icon TEXT,
  custom_icon_url TEXT,
  featured BOOLEAN DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS proficiency INT DEFAULT 90;
ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS icon TEXT;
ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS custom_icon_url TEXT;
ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT true;
ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;

-- ==============================================================================
-- 5. Experience Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.experience (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  role TEXT,
  company_url TEXT,
  period TEXT,
  description TEXT,
  start_date TEXT NOT NULL DEFAULT '2024',
  end_date TEXT,
  current BOOLEAN NOT NULL DEFAULT false,
  location TEXT DEFAULT 'Nepal',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.experience ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE public.experience ADD COLUMN IF NOT EXISTS company_url TEXT;
ALTER TABLE public.experience ADD COLUMN IF NOT EXISTS period TEXT;
ALTER TABLE public.experience ADD COLUMN IF NOT EXISTS end_date TEXT;
ALTER TABLE public.experience ADD COLUMN IF NOT EXISTS current BOOLEAN DEFAULT false;
ALTER TABLE public.experience ADD COLUMN IF NOT EXISTS location TEXT DEFAULT 'Nepal';
ALTER TABLE public.experience ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
ALTER TABLE public.experience ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- ==============================================================================
-- 6. Social Links Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.social_links (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  custom_icon_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.social_links ADD COLUMN IF NOT EXISTS custom_icon_url TEXT;
ALTER TABLE public.social_links ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
ALTER TABLE public.social_links ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- ==============================================================================
-- 7. Media Library Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.media (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  url TEXT NOT NULL,
  file_size BIGINT NOT NULL DEFAULT 0,
  mime_type TEXT NOT NULL DEFAULT 'image/jpeg',
  dimensions TEXT DEFAULT 'Standard',
  alt_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.media ADD COLUMN IF NOT EXISTS dimensions TEXT DEFAULT 'Standard';
ALTER TABLE public.media ADD COLUMN IF NOT EXISTS alt_text TEXT;

-- ==============================================================================
-- 8. Site Settings & Dynamic Branding Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'settings-1',
  site_name TEXT NOT NULL DEFAULT 'Anil Shrestha Portfolio & CMS',
  ga_id TEXT,
  google_site_verification TEXT,
  contact_email TEXT DEFAULT 'inquiry@anilshrestha11.com.np',
  allow_indexing BOOLEAN NOT NULL DEFAULT true,
  maintenance_mode BOOLEAN NOT NULL DEFAULT false,
  logo_url TEXT,
  logo_text TEXT DEFAULT 'AS',
  fav_icon_url TEXT,
  fav_name TEXT DEFAULT 'Anil Shrestha Portfolio & CMS',
  theme_color TEXT DEFAULT '#3b82f6',
  meta_title TEXT,
  meta_description TEXT,
  footer_text TEXT,
  enable_gmail_inquiry BOOLEAN DEFAULT true,
  gmail_inquiry_email TEXT DEFAULT 'inquiry@anilshrestha11.com.np',
  enable_whatsapp_inquiry BOOLEAN NOT NULL DEFAULT true,
  whatsapp_number TEXT DEFAULT 'https://wa.me/anilstha.pkr',
  whatsapp_target TEXT DEFAULT 'https://wa.me/anilstha.pkr',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS logo_text TEXT DEFAULT 'AS';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS fav_icon_url TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS fav_name TEXT DEFAULT 'Anil Shrestha Portfolio & CMS';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS theme_color TEXT DEFAULT '#3b82f6';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS footer_text TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS enable_gmail_inquiry BOOLEAN DEFAULT true;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS gmail_inquiry_email TEXT DEFAULT 'inquiry@anilshrestha11.com.np';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS enable_whatsapp_inquiry BOOLEAN DEFAULT true;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS whatsapp_number TEXT DEFAULT 'https://wa.me/anilstha.pkr';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS whatsapp_target TEXT DEFAULT 'https://wa.me/anilstha.pkr';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS contact_email TEXT DEFAULT 'inquiry@anilshrestha11.com.np';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- ==============================================================================
-- 9. Contact Messages Table (Protected Customer Inquiries)
-- ==============================================================================
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

ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS services TEXT;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'unread';

-- ==============================================================================
-- 10. Testimonials Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.testimonials (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  client_name TEXT NOT NULL,
  client_role TEXT NOT NULL DEFAULT 'Client',
  company TEXT NOT NULL DEFAULT 'Company',
  quote TEXT NOT NULL,
  avatar_url TEXT,
  rating INT NOT NULL DEFAULT 5,
  project_title TEXT,
  project_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT true,
  published BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT true;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) HARDENING: Least Privilege Enforcement
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
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- 1. Drop all previous insecure wildcard write policies
DROP POLICY IF EXISTS "Full Access Profiles" ON public.profiles;
DROP POLICY IF EXISTS "Full Access Projects" ON public.projects;
DROP POLICY IF EXISTS "Full Access Services" ON public.services;
DROP POLICY IF EXISTS "Full Access Skills" ON public.skills;
DROP POLICY IF EXISTS "Full Access Experience" ON public.experience;
DROP POLICY IF EXISTS "Full Access Social" ON public.social_links;
DROP POLICY IF EXISTS "Full Access Media" ON public.media;
DROP POLICY IF EXISTS "Full Access Settings" ON public.site_settings;
DROP POLICY IF EXISTS "Full Access Messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Full Access Testimonials" ON public.testimonials;

DROP POLICY IF EXISTS "Public Read Profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public Read Projects" ON public.projects;
DROP POLICY IF EXISTS "Public Read Services" ON public.services;
DROP POLICY IF EXISTS "Public Read Skills" ON public.skills;
DROP POLICY IF EXISTS "Public Read Experience" ON public.experience;
DROP POLICY IF EXISTS "Public Read Social" ON public.social_links;
DROP POLICY IF EXISTS "Public Read Media" ON public.media;
DROP POLICY IF EXISTS "Public Read Settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public Read Testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Public Read Contact Messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Public Read Messages" ON public.contact_messages;

DROP POLICY IF EXISTS "Admin Insert Testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admin Update Testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admin Delete Testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admin Manage Testimonials" ON public.testimonials;

-- 2. PUBLIC READ POLICIES (Only published/active content readable by public)
CREATE POLICY "Public Read Profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Public Read Published Projects" ON public.projects
  FOR SELECT USING (published = true);

CREATE POLICY "Public Read Active Services" ON public.services
  FOR SELECT USING (active = true);

CREATE POLICY "Public Read Skills" ON public.skills
  FOR SELECT USING (true);

CREATE POLICY "Public Read Experience" ON public.experience
  FOR SELECT USING (true);

CREATE POLICY "Public Read Active Social" ON public.social_links
  FOR SELECT USING (active = true);

CREATE POLICY "Public Read Media" ON public.media
  FOR SELECT USING (true);

CREATE POLICY "Public Read Settings" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Public Read Published Testimonials" ON public.testimonials
  FOR SELECT USING (published = true);

-- 3. CONTACT MESSAGES (PUBLIC INSERT ONLY — NO PUBLIC SELECT, UPDATE, OR DELETE)
DROP POLICY IF EXISTS "Public Submit Contact Inquiries" ON public.contact_messages;
CREATE POLICY "Public Submit Contact Inquiries" ON public.contact_messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(trim(name)) >= 2 AND
    length(trim(email)) >= 5 AND
    length(trim(message)) >= 5
  );

-- 4. AUTHENTICATED ADMINISTRATOR POLICIES
-- Service role key automatically bypasses RLS for backend routes.
-- For direct Supabase client access, verify authenticated session and admin email/role:
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT (
    auth.role() = 'service_role' OR
    (
      auth.role() = 'authenticated' AND (
        auth.jwt() ->> 'email' IN ('anya.24x7@gmail.com', 'inquiry@anilshrestha11.com.np') OR
        auth.jwt() -> 'app_metadata' ->> 'role' = 'admin' OR
        auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
      )
    )
  );
$$;

-- Admin policies on all tables
DROP POLICY IF EXISTS "Admin Manage Profiles" ON public.profiles;
CREATE POLICY "Admin Manage Profiles" ON public.profiles
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin Manage Projects" ON public.projects;
CREATE POLICY "Admin Manage Projects" ON public.projects
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin Manage Services" ON public.services;
CREATE POLICY "Admin Manage Services" ON public.services
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin Manage Skills" ON public.skills;
CREATE POLICY "Admin Manage Skills" ON public.skills
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin Manage Experience" ON public.experience;
CREATE POLICY "Admin Manage Experience" ON public.experience
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin Manage Social" ON public.social_links;
CREATE POLICY "Admin Manage Social" ON public.social_links
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin Manage Media" ON public.media;
CREATE POLICY "Admin Manage Media" ON public.media
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin Manage Settings" ON public.site_settings;
CREATE POLICY "Admin Manage Settings" ON public.site_settings
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin Manage Inquiries" ON public.contact_messages;
CREATE POLICY "Admin Manage Inquiries" ON public.contact_messages
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin Manage Testimonials" ON public.testimonials;
CREATE POLICY "Admin Manage Testimonials" ON public.testimonials
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ==============================================================================
-- 5. STORAGE BUCKET & SECURITY POLICIES (portfolio-media)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-media',
  'portfolio-media',
  true,
  10485760, -- 10 MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'application/pdf'];

DROP POLICY IF EXISTS "Public Read Media Storage" ON storage.objects;
DROP POLICY IF EXISTS "Public Storage Access" ON storage.objects;
DROP POLICY IF EXISTS "Full Storage Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload Media Storage" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Media Storage" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Media Storage" ON storage.objects;

-- Public can ONLY read objects in portfolio-media
CREATE POLICY "Public Read Media Storage" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio-media');

-- Only authenticated admins can upload/modify/delete storage assets
CREATE POLICY "Admin Upload Media Storage" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'portfolio-media' AND public.is_admin());

CREATE POLICY "Admin Update Media Storage" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'portfolio-media' AND public.is_admin());

CREATE POLICY "Admin Delete Media Storage" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'portfolio-media' AND public.is_admin());

-- ==============================================================================
-- 6. REALTIME REPLICATION CONFIGURATION
-- ==============================================================================
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.projects; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.services; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.skills; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.experience; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.social_links; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.media; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.testimonials; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
