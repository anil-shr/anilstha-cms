import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Helper to convert arbitrary string IDs (e.g. 'proj-1', 'profile-anil') into valid UUIDs
export function toUUID(str: string): string {
  if (!str) return crypto.randomUUID();
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str)) {
    return str;
  }
  const hash = crypto.createHash('md5').update(String(str)).digest('hex');
  return [
    hash.substring(0, 8),
    hash.substring(8, 12),
    '4' + hash.substring(13, 16),
    '8' + hash.substring(17, 20),
    hash.substring(20, 32),
  ].join('-');
}

// Initialize Supabase Client with service role key for guaranteed administrative writes
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://zhbzmkofwklefhfsocoz.supabase.co';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpoYnpta29md2tsZWZoZnNvY296Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExNzgwNzksImV4cCI6MjEwNjc1NDA3OX0.FtijsBtv6SCgVneFVKOkP9CkfJrZrnl_uK-EQSzVEeg';

let supabase: SupabaseClient | null = null;
if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });
    console.log('[Server] Supabase client initialized with endpoint:', supabaseUrl);
  } catch (err) {
    console.error('[Server] Failed to initialize Supabase client:', err);
  }
}

// Field sanitizers matching Supabase PostgreSQL column constraints
function sanitizeProject(p: any) {
  return {
    id: toUUID(p.id),
    title: p.title || 'Untitled Project',
    slug: p.slug || 'project-' + Date.now(),
    category: p.category || 'Graphic Design',
    description: p.description || '',
    year: p.year ? String(p.year) : '2026',
    client: p.client || null,
    role: p.role || 'Lead Designer',
    services: Array.isArray(p.services) ? p.services : [],
    tools: Array.isArray(p.tools) ? p.tools : [],
    challenge: p.challenge || null,
    solution: p.solution || null,
    result: p.result || null,
    cover_image_url: p.cover_image_url || null,
    gallery_urls: Array.isArray(p.gallery_urls) ? p.gallery_urls : [],
    project_url: p.project_url || null,
    featured: Boolean(p.featured),
    published: p.published !== false,
    sort_order: typeof p.sort_order === 'number' ? p.sort_order : 0,
    seo_title: p.seo_title || null,
    seo_description: p.seo_description || null,
    og_image_url: p.og_image_url || null,
    alt_text: p.alt_text || p.title || null,
    updated_at: new Date().toISOString(),
  };
}

function sanitizeProfile(prof: any) {
  return {
    id: toUUID(prof.id || 'profile-anil-shrestha'),
    name: prof.name || 'Anil Shrestha',
    profession: prof.profession || 'Graphic Designer & UI/UX Specialist',
    headline: prof.headline || '',
    short_bio: prof.short_bio || '',
    long_bio: prof.long_bio || '',
    location: prof.location || 'Pokhara, Nepal',
    email: prof.email || 'hello@anilshrestha.design',
    availability: prof.availability || 'Available for Hire & Projects',
    profile_image_url: prof.profile_image_url || null,
    hero_heading: prof.hero_heading || '',
    hero_description: prof.hero_description || '',
    primary_cta_label: prof.primary_cta_label || 'Explore My Work',
    primary_cta_url: prof.primary_cta_url || '/work',
    secondary_cta_label: prof.secondary_cta_label || 'View Services',
    secondary_cta_url: prof.secondary_cta_url || '/services',
    resume_url: prof.resume_url || '/resume',
    updated_at: new Date().toISOString(),
  };
}

function sanitizeService(s: any) {
  return {
    id: toUUID(s.id),
    title: s.title || 'Service Title',
    description: s.description || '',
    icon: s.icon || 'layout',
    deliverables: Array.isArray(s.deliverables) ? s.deliverables : [],
    featured: Boolean(s.featured),
    sort_order: typeof s.sort_order === 'number' ? s.sort_order : 0,
    active: s.active !== false,
    updated_at: new Date().toISOString(),
  };
}

function sanitizeSkill(sk: any) {
  return {
    id: toUUID(sk.id),
    name: sk.name || 'Skill',
    category: sk.category || 'General',
    sort_order: typeof sk.sort_order === 'number' ? sk.sort_order : 0,
  };
}

function sanitizeExperience(exp: any) {
  return {
    id: toUUID(exp.id),
    company: exp.company || 'Company',
    position: exp.position || 'Role',
    description: exp.description || null,
    start_date: exp.start_date || '2024',
    end_date: exp.end_date || null,
    current: Boolean(exp.current),
    location: exp.location || 'Nepal',
    sort_order: typeof exp.sort_order === 'number' ? exp.sort_order : 0,
    updated_at: new Date().toISOString(),
  };
}

function sanitizeSocialLink(soc: any) {
  return {
    id: toUUID(soc.id),
    platform: soc.platform || 'Platform',
    url: soc.url || 'https://',
    sort_order: typeof soc.sort_order === 'number' ? soc.sort_order : 0,
    active: soc.active !== false,
  };
}

function sanitizeMedia(m: any) {
  return {
    id: toUUID(m.id),
    filename: m.filename || 'media-' + Date.now(),
    original_name: m.original_name || m.filename || 'file',
    url: m.url || '',
    file_size: typeof m.file_size === 'number' ? m.file_size : 0,
    mime_type: m.mime_type || 'image/jpeg',
    dimensions: m.dimensions || 'Standard',
    alt_text: m.alt_text || null,
    created_at: m.created_at || new Date().toISOString(),
  };
}

function sanitizeSettings(sett: any) {
  return {
    id: toUUID(sett.id || 'settings-main'),
    site_name: sett.site_name || 'Anil Shrestha Portfolio & CMS',
    ga_id: sett.ga_id || null,
    google_site_verification: sett.google_site_verification || null,
    contact_email: sett.contact_email || 'hello@anilshrestha.design',
    allow_indexing: sett.allow_indexing !== false,
    maintenance_mode: Boolean(sett.maintenance_mode),
    updated_at: new Date().toISOString(),
  };
}

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // API Route: Status check
  app.get('/api/status', async (_req: Request, res: Response) => {
    if (!supabase) {
      return res.json({ connected: false, message: 'Supabase client not initialized' });
    }
    try {
      const [
        { count: projCount },
        { count: srvCount },
        { count: skCount },
        { count: expCount },
        { count: socCount },
      ] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('services').select('*', { count: 'exact', head: true }),
        supabase.from('skills').select('*', { count: 'exact', head: true }),
        supabase.from('experience').select('*', { count: 'exact', head: true }),
        supabase.from('social_links').select('*', { count: 'exact', head: true }),
      ]);
      return res.json({
        connected: true,
        counts: {
          projects: projCount || 0,
          services: srvCount || 0,
          skills: skCount || 0,
          experience: expCount || 0,
          social_links: socCount || 0,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ connected: false, error: err.message });
    }
  });

  // API Route: Public Unified Data Feed (reads live from Supabase)
  app.get('/api/data', async (_req: Request, res: Response) => {
    if (!supabase) {
      return res.status(503).json({ error: 'Supabase not connected' });
    }
    try {
      const [
        { data: profile, error: profErr },
        { data: projects, error: projErr },
        { data: services, error: srvErr },
        { data: skills, error: skErr },
        { data: experience, error: expErr },
        { data: socialLinks, error: socErr },
        { data: siteSettings, error: settsErr },
        { data: media, error: mediaErr },
      ] = await Promise.all([
        supabase.from('profiles').select('*').limit(1).maybeSingle(),
        supabase.from('projects').select('*').order('sort_order', { ascending: true }),
        supabase.from('services').select('*').order('sort_order', { ascending: true }),
        supabase.from('skills').select('*').order('sort_order', { ascending: true }),
        supabase.from('experience').select('*').order('sort_order', { ascending: true }),
        supabase.from('social_links').select('*').order('sort_order', { ascending: true }),
        supabase.from('site_settings').select('*').limit(1).maybeSingle(),
        supabase.from('media').select('*').order('created_at', { ascending: false }),
      ]);

      if (profErr || projErr) {
        console.warn('[Server] Supabase data read notice:', profErr || projErr);
      }

      return res.json({
        profile: profile || null,
        projects: projects || [],
        services: services || [],
        skills: skills || [],
        experience: experience || [],
        socialLinks: socialLinks || [],
        siteSettings: siteSettings || null,
        media: media || [],
      });
    } catch (err: any) {
      console.error('[Server] /api/data error:', err);
      return res.status(500).json({ error: err.message });
    }
  });

  // API Route: Admin Save Project
  app.post('/api/admin/save-project', async (req: Request, res: Response) => {
    if (!supabase) return res.status(503).json({ error: 'Supabase not connected' });
    try {
      const rawProject = req.body;
      const cleanProject = sanitizeProject(rawProject);

      const { data, error } = await supabase.from('projects').upsert(cleanProject).select().single();
      if (error) {
        console.error('[Server] save-project error:', error);
        return res.status(400).json({ success: false, error: error.message });
      }

      console.log(`[Server] Project "${cleanProject.title}" (${cleanProject.slug}) saved to Supabase!`);
      return res.json({ success: true, project: data || cleanProject });
    } catch (err: any) {
      console.error('[Server] save-project exception:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Admin Delete Project
  app.post('/api/admin/delete-project', async (req: Request, res: Response) => {
    if (!supabase) return res.status(503).json({ error: 'Supabase not connected' });
    try {
      const { id } = req.body;
      const uuid = toUUID(id);
      const { error } = await supabase.from('projects').delete().eq('id', uuid);
      if (error) {
        return res.status(400).json({ success: false, error: error.message });
      }
      console.log(`[Server] Project ${uuid} deleted from Supabase`);
      return res.json({ success: true, id });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Toggle Project Publish
  app.post('/api/admin/toggle-project-publish', async (req: Request, res: Response) => {
    if (!supabase) return res.status(503).json({ error: 'Supabase not connected' });
    try {
      const { id, published } = req.body;
      const uuid = toUUID(id);
      const { error } = await supabase
        .from('projects')
        .update({ published: Boolean(published), updated_at: new Date().toISOString() })
        .eq('id', uuid);
      if (error) return res.status(400).json({ success: false, error: error.message });
      return res.json({ success: true, id, published });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Toggle Project Feature
  app.post('/api/admin/toggle-project-feature', async (req: Request, res: Response) => {
    if (!supabase) return res.status(503).json({ error: 'Supabase not connected' });
    try {
      const { id, featured } = req.body;
      const uuid = toUUID(id);
      const { error } = await supabase
        .from('projects')
        .update({ featured: Boolean(featured), updated_at: new Date().toISOString() })
        .eq('id', uuid);
      if (error) return res.status(400).json({ success: false, error: error.message });
      return res.json({ success: true, id, featured });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Admin Update Profile
  app.post('/api/admin/update-profile', async (req: Request, res: Response) => {
    if (!supabase) return res.status(503).json({ error: 'Supabase not connected' });
    try {
      const clean = sanitizeProfile(req.body);
      const { data, error } = await supabase.from('profiles').upsert(clean).select().single();
      if (error) return res.status(400).json({ success: false, error: error.message });
      console.log('[Server] Profile updated in Supabase');
      return res.json({ success: true, profile: data || clean });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Admin Save Service
  app.post('/api/admin/save-service', async (req: Request, res: Response) => {
    if (!supabase) return res.status(503).json({ error: 'Supabase not connected' });
    try {
      const clean = sanitizeService(req.body);
      const { data, error } = await supabase.from('services').upsert(clean).select().single();
      if (error) return res.status(400).json({ success: false, error: error.message });
      return res.json({ success: true, service: data || clean });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Admin Delete Service
  app.post('/api/admin/delete-service', async (req: Request, res: Response) => {
    if (!supabase) return res.status(503).json({ error: 'Supabase not connected' });
    try {
      const { id } = req.body;
      const uuid = toUUID(id);
      const { error } = await supabase.from('services').delete().eq('id', uuid);
      if (error) return res.status(400).json({ success: false, error: error.message });
      return res.json({ success: true, id });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Admin Save Skill
  app.post('/api/admin/save-skill', async (req: Request, res: Response) => {
    if (!supabase) return res.status(503).json({ error: 'Supabase not connected' });
    try {
      const clean = sanitizeSkill(req.body);
      const { data, error } = await supabase.from('skills').upsert(clean).select().single();
      if (error) return res.status(400).json({ success: false, error: error.message });
      return res.json({ success: true, skill: data || clean });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Admin Delete Skill
  app.post('/api/admin/delete-skill', async (req: Request, res: Response) => {
    if (!supabase) return res.status(503).json({ error: 'Supabase not connected' });
    try {
      const { id } = req.body;
      const uuid = toUUID(id);
      const { error } = await supabase.from('skills').delete().eq('id', uuid);
      if (error) return res.status(400).json({ success: false, error: error.message });
      return res.json({ success: true, id });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Admin Save Experience
  app.post('/api/admin/save-experience', async (req: Request, res: Response) => {
    if (!supabase) return res.status(503).json({ error: 'Supabase not connected' });
    try {
      const clean = sanitizeExperience(req.body);
      const { data, error } = await supabase.from('experience').upsert(clean).select().single();
      if (error) return res.status(400).json({ success: false, error: error.message });
      return res.json({ success: true, experience: data || clean });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Admin Delete Experience
  app.post('/api/admin/delete-experience', async (req: Request, res: Response) => {
    if (!supabase) return res.status(503).json({ error: 'Supabase not connected' });
    try {
      const { id } = req.body;
      const uuid = toUUID(id);
      const { error } = await supabase.from('experience').delete().eq('id', uuid);
      if (error) return res.status(400).json({ success: false, error: error.message });
      return res.json({ success: true, id });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Admin Save Social Links
  app.post('/api/admin/save-social', async (req: Request, res: Response) => {
    if (!supabase) return res.status(503).json({ error: 'Supabase not connected' });
    try {
      const links = Array.isArray(req.body) ? req.body : req.body.links;
      if (!Array.isArray(links)) return res.status(400).json({ error: 'Invalid links array' });

      for (const link of links) {
        const clean = sanitizeSocialLink(link);
        await supabase.from('social_links').upsert(clean);
      }
      return res.json({ success: true, count: links.length });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Admin Update Settings
  app.post('/api/admin/save-settings', async (req: Request, res: Response) => {
    if (!supabase) return res.status(503).json({ error: 'Supabase not connected' });
    try {
      const clean = sanitizeSettings(req.body);
      const { data, error } = await supabase.from('site_settings').upsert(clean).select().single();
      if (error) return res.status(400).json({ success: false, error: error.message });
      return res.json({ success: true, siteSettings: data || clean });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Admin Save Media Record
  app.post('/api/admin/save-media', async (req: Request, res: Response) => {
    if (!supabase) return res.status(503).json({ error: 'Supabase not connected' });
    try {
      const clean = sanitizeMedia(req.body);
      const { data, error } = await supabase.from('media').upsert(clean).select().single();
      if (error) return res.status(400).json({ success: false, error: error.message });
      return res.json({ success: true, item: data || clean });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Admin Delete Media Record & Storage file
  app.post('/api/admin/delete-media', async (req: Request, res: Response) => {
    if (!supabase) return res.status(503).json({ error: 'Supabase not connected' });
    try {
      const { id, filename } = req.body;
      const uuid = toUUID(id);
      const { error } = await supabase.from('media').delete().eq('id', uuid);
      if (error) return res.status(400).json({ success: false, error: error.message });
      if (filename) {
        try {
          await supabase.storage.from('portfolio-media').remove([filename]);
        } catch {}
      }
      return res.json({ success: true, id });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Admin Upload Media directly to Supabase Storage & Database
  app.post('/api/admin/upload-media', async (req: Request, res: Response) => {
    if (!supabase) return res.status(503).json({ error: 'Supabase not connected' });
    try {
      const { filename, mime_type, base64, alt_text, dimensions } = req.body;
      if (!base64 || !filename) {
        return res.status(400).json({ success: false, error: 'Missing file content' });
      }
      const rawBase64 = base64.replace(/^data:.*?;base64,/, '');
      const buffer = Buffer.from(rawBase64, 'base64');
      const cleanFileName = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

      // Upload to Supabase Storage public bucket
      const { error: uploadErr } = await supabase.storage
        .from('portfolio-media')
        .upload(cleanFileName, buffer, {
          contentType: mime_type || 'image/jpeg',
          upsert: true,
        });

      if (uploadErr) {
        console.warn('[Server] Supabase Storage upload notice, falling back:', uploadErr);
      }

      const { data: urlData } = supabase.storage
        .from('portfolio-media')
        .getPublicUrl(cleanFileName);

      const publicUrl = urlData?.publicUrl || base64;

      const mediaRecord = sanitizeMedia({
        id: toUUID(Date.now().toString()),
        filename: cleanFileName,
        original_name: filename,
        url: publicUrl,
        file_size: buffer.length,
        mime_type: mime_type || 'image/jpeg',
        dimensions: dimensions || 'Standard',
        alt_text: alt_text || filename.split('.')[0],
      });

      const { data: savedData, error: dbErr } = await supabase
        .from('media')
        .upsert(mediaRecord)
        .select()
        .single();

      if (dbErr) {
        console.warn('[Server] Media DB write notice:', dbErr);
      }

      console.log(`[Server] Uploaded media "${cleanFileName}" to Supabase Storage:`, publicUrl);
      return res.json({ success: true, item: savedData || mediaRecord });
    } catch (err: any) {
      console.error('[Server] upload-media exception:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Push ALL Local State to Supabase
  app.post('/api/admin/push-all', async (req: Request, res: Response) => {
    if (!supabase) return res.status(503).json({ error: 'Supabase not connected' });
    try {
      const { profile, projects, services, skills, experience, socialLinks, siteSettings, media } = req.body;

      if (profile) {
        await supabase.from('profiles').upsert(sanitizeProfile(profile));
      }

      if (Array.isArray(projects) && projects.length > 0) {
        for (const p of projects) {
          await supabase.from('projects').upsert(sanitizeProject(p));
        }
      }

      if (Array.isArray(services) && services.length > 0) {
        for (const s of services) {
          await supabase.from('services').upsert(sanitizeService(s));
        }
      }

      if (Array.isArray(skills) && skills.length > 0) {
        for (const sk of skills) {
          await supabase.from('skills').upsert(sanitizeSkill(sk));
        }
      }

      if (Array.isArray(experience) && experience.length > 0) {
        for (const exp of experience) {
          await supabase.from('experience').upsert(sanitizeExperience(exp));
        }
      }

      if (Array.isArray(socialLinks) && socialLinks.length > 0) {
        for (const soc of socialLinks) {
          await supabase.from('social_links').upsert(sanitizeSocialLink(soc));
        }
      }

      if (Array.isArray(media) && media.length > 0) {
        for (const m of media) {
          await supabase.from('media').upsert(sanitizeMedia(m));
        }
      }

      if (siteSettings) {
        await supabase.from('site_settings').upsert(sanitizeSettings(siteSettings));
      }

      console.log('[Server] push-all completed successfully!');
      return res.json({
        success: true,
        message: 'Successfully pushed all portfolio content to Supabase! Changes are live everywhere.',
      });
    } catch (err: any) {
      console.error('[Server] push-all error:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Contact Form submission
  app.post('/api/contact', async (req: Request, res: Response) => {
    if (!supabase) return res.status(503).json({ error: 'Supabase not connected' });
    try {
      const { name, email, subject, message } = req.body;
      const clean = {
        id: crypto.randomUUID(),
        name: name || 'Anonymous',
        email: email || '',
        subject: subject || 'Portfolio Inquiry',
        message: message || '',
        status: 'unread',
      };
      const { error } = await supabase.from('contact_messages').insert(clean);
      if (error) return res.status(400).json({ success: false, error: error.message });
      return res.json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Dynamic Sitemap endpoint
  app.get('/sitemap.xml', async (_req: Request, res: Response) => {
    const DOMAIN = 'https://anilshrestha11.com.np';
    let projects: any[] = [];
    if (supabase) {
      const { data } = await supabase
        .from('projects')
        .select('slug, updated_at')
        .eq('published', true);
      projects = data || [];
    }

    const staticRoutes = [
      { url: `${DOMAIN}/`, priority: '1.0', changefreq: 'weekly' },
      { url: `${DOMAIN}/work`, priority: '0.9', changefreq: 'weekly' },
      { url: `${DOMAIN}/about`, priority: '0.8', changefreq: 'monthly' },
      { url: `${DOMAIN}/services`, priority: '0.8', changefreq: 'monthly' },
      { url: `${DOMAIN}/skills`, priority: '0.8', changefreq: 'monthly' },
      { url: `${DOMAIN}/resume`, priority: '0.8', changefreq: 'monthly' },
      { url: `${DOMAIN}/arcade`, priority: '0.7', changefreq: 'weekly' },
      { url: `${DOMAIN}/contact`, priority: '0.7', changefreq: 'monthly' },
      { url: `${DOMAIN}/privacy`, priority: '0.3', changefreq: 'yearly' },
      { url: `${DOMAIN}/terms`, priority: '0.3', changefreq: 'yearly' },
      { url: `${DOMAIN}/cookies`, priority: '0.3', changefreq: 'yearly' },
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes
  .map(
    (r) => `  <url>
    <loc>${r.url}</loc>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join('\n')}
${projects
  .map(
    (p) => `  <url>
    <loc>${DOMAIN}/work/${p.slug}</loc>
    <lastmod>${p.updated_at ? p.updated_at.split('T')[0] : '2026-10-08'}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    return res.send(xml);
  });

  // Dynamic Robots.txt endpoint
  app.get('/robots.txt', (_req: Request, res: Response) => {
    res.header('Content-Type', 'text/plain');
    return res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /api/private/*

Sitemap: https://anilshrestha11.com.np/sitemap.xml
`);
  });

  // Mount Vite or serve static assets
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Live server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server] Fatal startup error:', err);
  process.exit(1);
});
