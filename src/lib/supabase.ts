import { createClient } from '@supabase/supabase-js'

// Butun ilovada BITTA instance — GoTrueClient warning yo'qoladi
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
