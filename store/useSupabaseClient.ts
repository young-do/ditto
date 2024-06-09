import { SupabaseClient, createSupabaseClient } from '@/lib/supabase/client';
import { create } from 'zustand';

type SupabaseClientState = {
  supabaseClient: SupabaseClient;
};

export const useSupabaseClient = create<SupabaseClientState>(() => ({
  supabaseClient: createSupabaseClient(),
}));
