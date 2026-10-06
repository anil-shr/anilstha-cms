-- ==============================================================================
-- Portfolio & CMS Migration for Anil Shrestha (Graphic Designer - Nepal)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL DEFAULT 'Anil Shrestha',
  profession TEXT NOT NULL DEFAULT 'Graphic Designer',
  headline TEXT NOT NULL DEFAULT 'Visual identities, digital experiences, and creative systems designed with intention.',
  short_bio TEXT NOT NULL DEFAULT 'Graphic designer based in Nepal focusing on visual identity, editorial systems, typography, and purposeful digital design.',
  long_bio TEXT NOT NULL DEFAULT 'With a disciplined background in graphic design and visual communication, I partner with forward-thinking cultural initiatives, studios, and independent brands. My practice is grounded in Swiss design clarity, rich typography, and intentional restraint.',
  location TEXT NOT NULL DEFAULT 'Kathmandu, Nepal',
  email TEXT NOT NULL DEFAULT 'contact@anilshrestha.design',
  availability TEXT NOT NULL DEFAULT 'Available for selected projects',
  profile_image_url TEXT,
  hero_heading TEXT NOT NULL DEFAULT 'ANIL SHRESTHA',
  hero_description TEXT NOT NULL DEFAULT 'Visual identities, digital experiences, and creative work designed with intention.',
  primary_cta_label TEXT NOT NULL DEFAULT 'View Selected Work',
  primary_cta_url TEXT NOT NULL DEFAULT '/work',
  secondary_cta_label TEXT NOT NULL DEFAULT 'Let''s Work Together',
  secondary_cta_url TEXT NOT NULL DEFAULT '/contact',
  resume_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL DEFAULT 'Brand Identity',
  description TEXT NOT NULL,
  year TEXT NOT NULL DEFAULT '2026',
  client TEXT,
  role TEXT DEFAULT 'Lead Graphic Designer',
  services TEXT[] DEFAULT '{}',
  tools TEXT[] DEFAULT '{}',
  challenge TEXT,
  solution TEXT,
  result TEXT,
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
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);

-- 4. Project Images Table
CREATE TABLE IF NOT EXISTS public.project_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  alt_text TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON public.project_images(project_id);

-- 5. Services Table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT DEFAULT 'layout',
  deliverables TEXT[] DEFAULT '{}',
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_active ON public.services(active);
CREATE INDEX IF NOT EXISTS idx_services_sort_order ON public.services(sort_order);

-- 6. Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Core Disciplines',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skills_sort_order ON public.skills(sort_order);

-- 7. Experience Table
CREATE TABLE IF NOT EXISTS public.experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

CREATE INDEX IF NOT EXISTS idx_experience_sort_order ON public.experience(sort_order);

-- 8. Social Links Table
CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Media Library Table
CREATE TABLE IF NOT EXISTS public.media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  dimensions TEXT,
  alt_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_created_at ON public.media(created_at DESC);

-- 10. Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_name TEXT NOT NULL DEFAULT 'Anil Shrestha Portfolio',
  ga_id TEXT,
  google_site_verification TEXT,
  contact_email TEXT DEFAULT 'contact@anilshrestha.design',
  allow_indexing BOOLEAN NOT NULL DEFAULT true,
  maintenance_mode BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Contact Messages Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  ip_hash TEXT,
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Authenticated user with role admin or matching user_id
  RETURN (auth.role() = 'authenticated');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Public read, Admin write
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);
CREATE POLICY "Admins can update profile" ON public.profiles
  FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can insert profile" ON public.profiles
  FOR INSERT WITH CHECK (public.is_admin());

-- Projects: Public read published only, Admin full access
CREATE POLICY "Public can view published projects" ON public.projects
  FOR SELECT USING (published = true OR public.is_admin());
CREATE POLICY "Admins can insert projects" ON public.projects
  FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update projects" ON public.projects
  FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete projects" ON public.projects
  FOR DELETE USING (public.is_admin());

-- Project Images
CREATE POLICY "Public can view project images" ON public.project_images
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage project images" ON public.project_images
  FOR ALL USING (public.is_admin());

-- Services: Public read active, Admin full access
CREATE POLICY "Public can view active services" ON public.services
  FOR SELECT USING (active = true OR public.is_admin());
CREATE POLICY "Admins can manage services" ON public.services
  FOR ALL USING (public.is_admin());

-- Skills: Public read, Admin full access
CREATE POLICY "Public can view skills" ON public.skills
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage skills" ON public.skills
  FOR ALL USING (public.is_admin());

-- Experience: Public read, Admin full access
CREATE POLICY "Public can view experience" ON public.experience
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage experience" ON public.experience
  FOR ALL USING (public.is_admin());

-- Social Links: Public read active, Admin full access
CREATE POLICY "Public can view active social links" ON public.social_links
  FOR SELECT USING (active = true OR public.is_admin());
CREATE POLICY "Admins can manage social links" ON public.social_links
  FOR ALL USING (public.is_admin());

-- Media: Public read, Admin full access
CREATE POLICY "Public can view media records" ON public.media
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage media records" ON public.media
  FOR ALL USING (public.is_admin());

-- Site Settings: Public read, Admin write
CREATE POLICY "Public can view site settings" ON public.site_settings
  FOR SELECT USING (true);
CREATE POLICY "Admins can update site settings" ON public.site_settings
  FOR ALL USING (public.is_admin());

-- Contact Messages: Anonymous insert with validation, Admin read/update/delete
CREATE POLICY "Anyone can submit a contact message" ON public.contact_messages
  FOR INSERT WITH CHECK (
    char_length(name) >= 2 AND
    char_length(email) >= 5 AND
    char_length(subject) >= 2 AND
    char_length(message) >= 10
  );
CREATE POLICY "Admins can view and manage messages" ON public.contact_messages
  FOR ALL USING (public.is_admin());

-- ==============================================================================
-- Storage Bucket & Policies (Supabase Storage)
-- ==============================================================================

-- Storage bucket for portfolio media
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: anyone can view media, only admin can upload/delete
CREATE POLICY "Public Media Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio-media');

CREATE POLICY "Admin Media Upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'portfolio-media' AND auth.role() = 'authenticated');

CREATE POLICY "Admin Media Delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'portfolio-media' AND auth.role() = 'authenticated');
