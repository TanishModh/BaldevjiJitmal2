import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://brlkrualghugxskjzydi.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJybGtydWFsZ2h1Z3hza2p6eWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3ODQ4NjksImV4cCI6MjA5NTM2MDg2OX0.QMpHa57RDFuS6VLiadoQDj0EqXbsu1BDUUL6pKrN6Lo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
