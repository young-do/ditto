import { SUPABASE_URL, SUPABASE_KEY } from '@/utils/const';
import { createClient } from '@supabase/supabase-js';
import { Database } from './schema';

export type SupabaseClient = ReturnType<typeof createSupabaseClient>;

export const createSupabaseClient = () => createClient<Database>(SUPABASE_URL, SUPABASE_KEY);
