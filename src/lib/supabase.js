import { createClient } from "@supabase/supabase-js";

// Use placeholders during build time if environment variables are missing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn("Warning: Supabase credentials are missing. Using placeholders for build-time safety.");
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey);
