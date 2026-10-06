# Anil Shrestha — Graphic Designer Portfolio & Secure CMS

A production-ready personal portfolio website and secure online CMS/admin dashboard engineered for **Anil Shrestha**, an independent Graphic Designer based in Kathmandu, Nepal.

Designed with an editorial, typography-focused visual constitution that avoids AI clichés, decorative gradients, and generic SaaS templates. The visual design work remains the hero.

---

## 1. Technology Stack

- **Frontend Framework:** React 19 / TypeScript / Vite / Next.js compatible
- **Styling:** Tailwind CSS (v4) with custom typography tokens (`Plus Jakarta Sans` & `Cabinet Grotesk`)
- **Backend & Database:** Supabase PostgreSQL with Row Level Security (RLS)
- **Authentication:** Supabase Auth (email/password with session persistence)
- **File Storage:** Supabase Storage (`portfolio-media` bucket) with strict MIME & extension verification
- **Realtime:** Supabase Realtime for instant synchronized updates
- **Analytics:** Google Analytics 4 with Google Consent Mode v2
- **SEO & Metadata:** OpenGraph, Twitter Cards, canonical URL normalization, XML sitemaps, robots.txt, and Schema.org JSON-LD (`Person`, `VisualArtwork`, `WebSite`)

---

## 2. Information Architecture

### Public Website
- `/` — Homepage (Hero, Selected Work Archive, Philosophy & Approach, Services, Skills, Experience, Inquiry CTA)
- `/work` — Project Archive with dynamic category filtering and keyword search
- `/work/[slug]` — Project Case Study (Client, Year, Role, Services, Tools, Challenge, Solution, Outcome, Gallery, Previous/Next navigation)
- `/about` — Biography, Design Philosophy, Capabilities, CV download
- `/services` — Detailed breakdown of design capabilities, deliverables, and methodology
- `/contact` — Secure inquiry form with client & server validation, honeypot spam protection, and rate limiting
- `/privacy` — Privacy Policy template tailored to graphic design practice
- `/cookies` — Cookie Policy explaining Necessary, Analytics, and Preference categories
- `/terms` — Terms & Conditions template
- `/sitemap.xml` — Dynamically updated XML sitemap of all published URLs
- `/robots.txt` — Search engine crawler instructions (blocks `/admin/*`)
- `/404` — Custom minimal 404 page

### Secure Admin CMS
- `/admin/login` — Authentication interface
- `/admin/dashboard` — System overview, status counters, and client inquiry log
- `/admin/profile` — Full profile, headline, biography, hero statement, CTAs, and CV editor
- `/admin/projects` — Project archive management (Reorder, Publish/Draft toggle, Featured toggle, Permanent delete with confirmation modal)
- `/admin/projects/new` — Case study creator with auto slug generation, tag managers, and SEO metadata
- `/admin/projects/[id]` — Case study editor with unsaved changes detection
- `/admin/services` — Service offerings and deliverables manager
- `/admin/skills` — Categorized skills manager (no fake percentage bars)
- `/admin/experience` — Professional career timeline manager
- `/admin/social-links` — Social channel URLs and visibility toggles
- `/admin/media` — Media library with drag-and-drop upload, size/dimension inspect, and 1-click copy URL
- `/admin/settings` — Cloud database connection, GA4 ID, and Google Search Console tokens
- `/admin/analytics` — GA4 telemetry specification, consent status, and direct console link

---

## 3. Database Schema & Row Level Security (RLS)

All database tables are defined with Row Level Security enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`).

The migration script is located at:
`supabase/migrations/20261005_init.sql`

### Tables:
1. `profiles` — Designer profile, biography, hero texts, contact details
2. `projects` — Case studies, categories, challenge, solution, result, slug, cover, gallery
3. `project_images` — Presentation plates with alt tags and sort order
4. `services` — Offerings, descriptions, and deliverables lists
5. `skills` — Categorized skills (Core Disciplines, Software & Tools, Craft)
6. `experience` — Career timeline entries
7. `social_links` — Active social media profiles
8. `media` — Uploaded storage assets, file sizes, dimensions, and MIME types
9. `site_settings` — GA4 ID, site verification, search indexing
10. `contact_messages` — Client inquiries with rate limiting and unread status

### Security Policies:
- **Public:** Can only `SELECT` records that are marked `published = true` or `active = true`. Can `INSERT` into `contact_messages` if validation constraints are satisfied.
- **Admin:** Authenticated users (`auth.role() = 'authenticated'`) have complete `INSERT`, `UPDATE`, and `DELETE` access.
- **Storage Bucket (`portfolio-media`):** Public `SELECT` for displaying imagery; Authenticated `INSERT` and `DELETE` only.

---

## 4. Local Development & Deployment

### Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Start local dev server
npm run dev

# 3. Build for production
npm run build

# 4. Run TypeScript checks
npm run lint
```

### Environment Variables (.env)
```env
NEXT_PUBLIC_SITE_URL="https://anilshrestha.design"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Vite client variables for local preview:
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
VITE_GA_ID="G-XXXXXXXXXX"
VITE_GOOGLE_SITE_VERIFICATION="your-verification-code"
```

---

## 5. Admin Authentication Setup

1. In your **Supabase Dashboard**, navigate to **Authentication > Users**.
2. Click **Add User** and create:
   - Email: `contact@anilshrestha.design` (or preferred administrative address)
   - Password: [Secure password]
3. Run the SQL migration in `supabase/migrations/20261005_init.sql` using the Supabase SQL Editor.
4. Log into `/admin/login` using your credentials.
5. In Local Preview / Offline mode, you can test immediate admin CMS operations using:
   - Email: `anil@shrestha.design`
   - Password: `design2026`

---

## 6. Privacy & Google Analytics 4 Setup

- Google Analytics 4 utilizes **Google Consent Mode v2**.
- By default, `analytics_storage` is set to `denied`.
- When visitors click **Accept All** or enable Analytics in the **Cookie Settings**, consent is granted and `gtag('consent', 'update')` fires.
- Strictly **no personally identifiable information (PII)** such as visitor names, emails, or message bodies are ever dispatched to analytics.

---

## 7. Security Verification Checklist

- [x] RLS enabled on all exposed PostgreSQL tables
- [x] Honeypot spam trap on public contact form
- [x] Client-side rate limiting (1 minute minimum between submissions)
- [x] Media upload MIME type and file extension verification (prevents executable scripts)
- [x] 10MB maximum upload limit enforced
- [x] Robots `noindex, nofollow` on all `/admin/*` routes
- [x] Unsaved changes guard on admin form editors
- [x] Permanent deletion confirmation dialogs (no 1-click accidental drops)
- [x] Zero external unverified CDN dependencies for core assets
