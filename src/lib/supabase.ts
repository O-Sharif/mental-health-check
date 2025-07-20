import { createClient } from '@supabase/supabase-js'

// For Lovable's Supabase integration, these values are automatically provided
// If you see an error, click the Supabase button in the top right to ensure proper connection
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Create client only if we have the required credentials
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export type MentalResetEntry = {
  id?: string
  created_at?: string
  date: string
  mood: string
  activities: string[]
  custom_activity?: string
  control_answer?: string
  not_my_job_answer?: string
  five_days_answer?: string
  next_step?: string
}