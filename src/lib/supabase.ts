import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://omlyqwvxhwwcmzrqfkbb.supabase.co';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tbHlxd3Z4aHd3Y216cnFma2JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2MDgxMzcsImV4cCI6MjEwODE4NDEzN30.OzdRT9SLTEaLeYiWak4xcji2t0Tux4J9FDsKYDzTOqo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
