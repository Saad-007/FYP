import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kecchipeimysyhjylnqi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlY2NoaXBlaW15c3loanlsbnFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwODYzMDcsImV4cCI6MjA5MzY2MjMwN30.vi97UNFUEXxnSREyrBpCE0TIo_py2c2dXmbVXPG4FtY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)