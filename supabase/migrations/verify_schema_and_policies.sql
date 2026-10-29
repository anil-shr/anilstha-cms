-- ==============================================================================
-- DATABASE SCHEMA & SECURITY VERIFICATION SCRIPT
-- Project: Anil Shrestha Portfolio & CMS (https://anilshrestha11.com.np)
-- 
-- READ-ONLY: Safe to run anytime in Supabase Dashboard SQL Editor
-- Checks:
--   1. Table existence & record counts
--   2. Column verification for all 10 CMS tables
--   3. Row Level Security (RLS) activation status
--   4. Active RLS policies per table
--   5. Storage bucket configuration & policies
--   6. Realtime publication tables
-- ==============================================================================

-- 1. Table Status & Row Counts
SELECT
  table_schema,
  table_name,
  (SELECT count(*) FROM information_schema.columns c WHERE c.table_name = t.table_name AND c.table_schema = 'public') AS total_columns
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name IN (
    'profiles', 'projects', 'services', 'skills', 'experience',
    'social_links', 'media', 'site_settings', 'contact_messages', 'testimonials'
  )
ORDER BY table_name;

-- 2. Row Level Security (RLS) Verification
-- rowsecurity MUST be true for all 10 tables!
SELECT
  schemaname,
  tablename,
  rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'profiles', 'projects', 'services', 'skills', 'experience',
    'social_links', 'media', 'site_settings', 'contact_messages', 'testimonials'
  )
ORDER BY tablename;

-- 3. Active RLS Policies Audit
-- Check that no unrestricted "USING (true)" write policies exist on contact_messages or CMS tables
SELECT
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual AS using_expression,
  with_check AS check_expression
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 4. Storage Bucket & Policy Check
SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets
WHERE id = 'portfolio-media';

SELECT
  policyname,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects'
ORDER BY policyname;

-- 5. Realtime Publication Registered Tables
SELECT
  schemaname,
  tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
ORDER BY tablename;
