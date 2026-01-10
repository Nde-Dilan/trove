import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '../supabase/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLUSHABLE_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables. Check your .env file.")
}

export const supabase = createBrowserClient<Database>(
  supabaseUrl,
  supabaseAnonKey
)

export function createClient() {
  return supabase
}
