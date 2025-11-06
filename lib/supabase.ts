import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para las tablas de Supabase
export interface ProjectRow {
  id: number;
  title: string;
  category: string;
  description: string;
  tools: string[];
  thumbnail_url: string;
  external_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectMediaRow {
  id: string;
  project_id: number;
  name: string;
  type: 'image' | 'video';
  file_path: string;
  file_url: string;
  created_at: string;
}

