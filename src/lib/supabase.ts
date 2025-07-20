import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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