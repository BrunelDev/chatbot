import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// Fixed base URL - using correct format without storage path
const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  "https://fcgzgczytodcnsazmitx.storage.supabase.co/storage/v1/s3";

// For production, use proper environment variables
// For development, use a direct key for testing
// WARNING: You should replace this with your actual key from .env
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjZ3pnY3p5dG9kY25zYXptaXR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MzU0NzksImV4cCI6MjA3NjAxMTQ3OX0.VKN32Nf-QOcW3MfAXD33It3bnevBOIZ_KXf402DKGhQ";

// Debug logging (remove in production)
console.log("Supabase URL: ", supabaseUrl, "anon key :", supabaseAnonKey);

// Create the Supabase client with storage
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
