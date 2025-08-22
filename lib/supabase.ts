import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Returns a Supabase client.
 * - By default returns an **anon** client (safe for client/shared use).
 * - For server routes that need write access, pass { role: 'service' }.
 */
export function createClient(opts?: { role?: 'anon' | 'service' }): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key =
    opts?.role === 'service'
      ? process.env.SUPABASE_SERVICE_ROLE_KEY!
      : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!url) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
  if (!key) throw new Error(`Missing ${opts?.role === 'service' ? 'SUPABASE_SERVICE_ROLE_KEY' : 'NEXT_PUBLIC_SUPABASE_ANON_KEY'}`);

  return createSupabaseClient(url, key);
}
