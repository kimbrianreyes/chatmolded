import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database';

export function createClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!rawUrl || !rawKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
    );
  }

  // Strip trailing slashes or accidental whitespace
  const supabaseUrl = rawUrl.trim().replace(/\/+$/, '');
  const supabaseAnonKey = rawKey.trim();

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
