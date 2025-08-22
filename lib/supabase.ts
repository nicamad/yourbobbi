import { createClient as _createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** Client for browser / client components (uses ANON key) */
export function createBrowserClient(): SupabaseClient {
  return _createSupabaseClient(URL, ANON, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
}

/** Client for server-only contexts (API routes, server actions); prefers SERVICE key */
export function createServerClient(): SupabaseClient {
  const key = SERVICE ?? ANON; // fall back safely if service key not present (dev)
  return _createSupabaseClient(URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/* --- Friendly aliases to match any imports you've used earlier --- */
export { createBrowserClient as createClient };     // some files import { createClient }
export { createServerClient as supabaseServer };    // some files import { supabaseServer }
export default createServerClient;                  // default also available if used
