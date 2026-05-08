import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 🚀 CRITICAL FIX: Hum custom 'storageKey' de rahay hain taake 
// browser ka purana atka hua (corrupted) data ignore ho jaye.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storageKey: 'edu-ai-quest-auth-token', // Ye naya naam hai
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})