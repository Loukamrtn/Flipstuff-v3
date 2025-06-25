import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lpxhepwfmcqjxlyqozhx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxweGhlcHdmbWNxanhseXFvemh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NjQxODcsImV4cCI6MjA2NjQ0MDE4N30.JWp4-Tp-GZuVlKE67rD0hDAJsW0TxJcX-NLxRyFiNCk'; // Remplace par ta clé

export const supabase = createClient(supabaseUrl, supabaseAnonKey);