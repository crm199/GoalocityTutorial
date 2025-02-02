import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabase_url = "https://eikjnlrevzbpnifsfaxa.supabase.co";
const supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpa2pubHJldnpicG5pZnNmYXhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1Mjg0NDEsImV4cCI6MjA1NDEwNDQ0MX0.JV57sAKnTyMe3_USpZ12o23kzwNwUtr-gAXNpDsj6sM";

const supabase = createClient(supabase_url, supabase_key, {
  localStorage: AsyncStorage,
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: false,
});
console.log ("Supabase client initialized.")
export { supabase };


