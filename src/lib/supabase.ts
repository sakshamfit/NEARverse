import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ciwwfdypldrsstyljrmg.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_wfL4xzPLMPxvrznf46D7wA_WTfWmgtw';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types for Supabase tables
export interface Profile {
  id: string;
  full_name: string;
  skills: string[] | null;
  bio: string | null;
  latitude: number | null;
  longitude: number | null;
  updated_at: string;
}

export interface GameTask {
  id: string;
  title: string;
  description: string;
  reward: number;
  location: string;
  category: string;
  poster_id: string;
  poster_name: string;
  status: 'open' | 'accepted' | 'completed';
  created_at: string;
}