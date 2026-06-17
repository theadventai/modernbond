import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://sxaizfjhwaslqokrqrvj.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4YWl6Zmpod2FzbHFva3JxcnZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyODY1NzIsImV4cCI6MjA5Njg2MjU3Mn0.xMRrBcYXqJzm_aKpRwQRjml0SaynyFeBhnGTP4Uzj7c';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type Profile = {
  id: string;
  username: string;
  avatar_url: string | null;
  created_at: string;
};
