// src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://myhwjdivtqkzahfexfad.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15aHdqZGl2dHFremFoZmV4ZmFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNTY4OTAsImV4cCI6MjA4NzkzMjg5MH0.tycOEK4pBU_FAVg6QzmWExmOpfqCfIbEbQAsE7H81Bg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);