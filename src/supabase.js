import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://anzecifiirzllukdpihu.supabase.co"
const supabaseKey = "sb_publishable_9Us2d_C221-moz_wouqLhA_FnFkzbb4"

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)