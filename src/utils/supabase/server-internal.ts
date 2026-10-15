import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Service-role client for trusted server-side code (e.g. webhook processing) only.
// It deliberately ignores request cookies so it never picks up a signed-in user's session,
// which would make requests run under that user's JWT and be subject to RLS.
export async function createClient() {
  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
