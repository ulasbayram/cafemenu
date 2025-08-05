"use client";
import type { Database } from './types';
import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!/*, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }}*/)