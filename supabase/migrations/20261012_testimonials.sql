-- ==============================================================================
-- Testimonials & Client Feedback Schema Migration for Anil Shrestha Portfolio
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

-- Row Level Security (RLS) & Policies
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published testimonials
CREATE POLICY "Public Read Testimonials" ON public.testimonials
  FOR SELECT USING (true);

-- Allow administrative writes
CREATE POLICY "Admin Insert Testimonials" ON public.testimonials
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin Update Testimonials" ON public.testimonials
  FOR UPDATE USING (true);

CREATE POLICY "Admin Delete Testimonials" ON public.testimonials
  FOR DELETE USING (true);

-- Enable Realtime replication for instant live site sync
ALTER PUBLICATION supabase_realtime ADD TABLE public.testimonials;

-- Seed initial client feedback
INSERT INTO public.testimonials (id, client_name, client_role, company, quote, avatar_url, rating, project_title, project_url, featured, published, sort_order)
VALUES
(
  '11111111-1111-4111-8111-111111111111',
  'Suman Thapa',
  'Founder & CEO',
  'Kora Organics',
  'Anil completely redefined our packaging and visual identity. His understanding of organic minimalism and production dielines gave our Himalayan herbal tea line an extraordinary shelf presence.',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  5,
  'Kora Organics Brand & Packaging',
  '/work/kora-organics-branding',
  true,
  true,
  1
),
(
  '22222222-2222-4222-8222-222222222222',
  'Elena Rostova',
  'Head of Product',
  'Nova FinTech Systems',
  'Collaborating with Anil on our cross-platform design system was seamless. He crafts interfaces that balance aesthetic elegance with developer ergonomics and token consistency.',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
  5,
  'Nova Mobile Banking UI/UX',
  '/work/nova-finance-app',
  true,
  true,
  2
),
(
  '33333333-3333-4333-8333-333333333333',
  'Kiran Gurung',
  'Festival Director',
  'Pokhara Lakeside Music Festival',
  'From festival posters to apparel merch and stage signages, Anil delivered a cohesive visual identity that resonated with thousands of festival attendees in Pokhara.',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
  5,
  'Lakeside Festival Identity',
  '/work/pokhara-music-festival',
  true,
  true,
  3
),
(
  '44444444-4444-4444-8444-444444444444',
  'Marcus Vance',
  'Managing Partner',
  'Summit Specialty Roasters',
  'The packaging dielines and typography crafted by Anil won us praise from specialty cafe partners across Asia and Europe. He is an invaluable design partner.',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
  5,
  'Summit Roasters Dielines',
  '/work/summit-coffee-roasters',
  true,
  true,
  4
)
ON CONFLICT (id) DO NOTHING;
