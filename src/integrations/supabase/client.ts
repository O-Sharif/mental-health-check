// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qpobdmyztbsbfrnoltlw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwb2JkbXl6dGJzYmZybm9sdGx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMDU4MTAsImV4cCI6MjA2ODU4MTgxMH0.RLoqPFAnboMH1MnY-dQ53Nh9yiRwaFQpjGKYdvm3rLk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});