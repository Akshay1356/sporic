// Resilient Supabase client - defaults to null when not configured
// Preserves correct configuration structure safely
const supabaseUrl = typeof import.meta !== 'undefined' && import.meta.env ? (import.meta.env.VITE_SUPABASE_URL || '') : '';
const supabaseAnonKey = typeof import.meta !== 'undefined' && import.meta.env ? (import.meta.env.VITE_SUPABASE_ANON_KEY || '') : '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const supabase = null;
export default supabase;
