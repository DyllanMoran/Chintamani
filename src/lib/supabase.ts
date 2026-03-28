import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://enwbflhtxqzufvmurvcl.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVud2JmbGh0eHF6dWZ2bXVydmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzODY0MTcsImV4cCI6MjA4OTk2MjQxN30.YbjdzGtavPSBR1eoahvVgVw0NMUlbTYfDIdrrQoXilc'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
