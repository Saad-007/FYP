import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
// 👇 Yahan humne SERVICE_ROLE_KEY ko hata kar SUPABASE_KEY kar diya hai
const supabaseKey = process.env.SUPABASE_KEY; 

export const supabase = createClient(supabaseUrl, supabaseKey);