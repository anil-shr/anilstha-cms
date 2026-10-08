import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_STORAGE_KEYS = {
  URL: 'as_supabase_url',
  KEY: 'as_supabase_anon_key',
};

export const DEFAULT_SUPABASE_URL = 'https://zhbzmkofwklefhfsocoz.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpoYnpta29md2tsZWZoZnNvY296Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExNzgwNzksImV4cCI6MjEwNjc1NDA3OX0.FtijsBtv6SCgVneFVKOkP9CkfJrZrnl_uK-EQSzVEeg';

// Resolve Supabase credentials from either environment variables, local admin configuration, or project defaults
export const getSupabaseCredentials = () => {
  const envUrl =
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
    import.meta.env.VITE_SUPABASE_URL ||
    '';

  const envKey =
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    '';

  let storedUrl = '';
  let storedKey = '';

  if (typeof window !== 'undefined') {
    try {
      storedUrl = localStorage.getItem(SUPABASE_STORAGE_KEYS.URL) || '';
      storedKey = localStorage.getItem(SUPABASE_STORAGE_KEYS.KEY) || '';
    } catch {}
  }

  const url = (envUrl || storedUrl || DEFAULT_SUPABASE_URL).trim();
  const key = (envKey || storedKey || DEFAULT_SUPABASE_ANON_KEY).trim();

  const isConfigured = Boolean(
    url &&
    key &&
    url.startsWith('https://') &&
    !url.includes('your-project')
  );

  const source: 'env' | 'storage' | 'none' = envUrl && envKey ? 'env' : storedUrl && storedKey ? 'storage' : 'none';

  return { url, key, isConfigured, source };
};

let cachedClient: SupabaseClient | null = null;
let currentUrl = '';
let currentKey = '';

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, key, isConfigured } = getSupabaseCredentials();

  if (!isConfigured) {
    cachedClient = null;
    currentUrl = '';
    currentKey = '';
    return null;
  }

  if (!cachedClient || currentUrl !== url || currentKey !== key) {
    try {
      cachedClient = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
      currentUrl = url;
      currentKey = key;
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
      cachedClient = null;
    }
  }

  return cachedClient;
};

// Export getters for backward compatibility
export const isSupabaseConfigured = Boolean(getSupabaseCredentials().isConfigured);
export const supabase: SupabaseClient | null = getSupabaseClient();

// Helper to save Supabase credentials from the Admin Settings Panel
export const saveSupabaseCredentials = (url: string, key: string) => {
  if (typeof window === 'undefined') return;
  const cleanUrl = url.trim();
  const cleanKey = key.trim();

  if (cleanUrl) {
    localStorage.setItem(SUPABASE_STORAGE_KEYS.URL, cleanUrl);
  } else {
    localStorage.removeItem(SUPABASE_STORAGE_KEYS.URL);
  }

  if (cleanKey) {
    localStorage.setItem(SUPABASE_STORAGE_KEYS.KEY, cleanKey);
  } else {
    localStorage.removeItem(SUPABASE_STORAGE_KEYS.KEY);
  }

  // Invalidate cache
  cachedClient = null;
  currentUrl = '';
  currentKey = '';
};

// Helper to test connectivity against Supabase
export const testSupabaseConnection = async (
  testUrl?: string,
  testKey?: string
): Promise<{ success: boolean; message: string; tableDetails?: string }> => {
  try {
    const creds = getSupabaseCredentials();
    const url = (testUrl || creds.url).trim();
    const key = (testKey || creds.key).trim();

    if (!url || !key) {
      return { success: false, message: 'Please provide both Supabase Project URL and Anon Key.' };
    }

    if (!url.startsWith('https://')) {
      return { success: false, message: 'Supabase URL must start with https://' };
    }

    const testClient = createClient(url, key);
    
    // Attempt to probe the projects table
    const { data, error } = await testClient.from('projects').select('id').limit(1);

    if (error) {
      // Check if table missing vs auth error
      if (error.code === '42P01' || error.message.includes('relation "public.projects" does not exist')) {
        return {
          success: true,
          message: 'Connected to Supabase! However, the database tables need to be created. Please run the SQL schema migration in Supabase SQL Editor.',
          tableDetails: 'missing_tables',
        };
      }
      return {
        success: false,
        message: `Supabase returned error (${error.code || 'FAIL'}): ${error.message}`,
      };
    }

    return {
      success: true,
      message: 'Connection successful! Supabase PostgreSQL and Realtime are active and ready.',
      tableDetails: `Found ${data ? data.length : 0} existing records in projects table.`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Failed to connect to Supabase: ${err.message || 'Unknown network error'}`,
    };
  }
};
