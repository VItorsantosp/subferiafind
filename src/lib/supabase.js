import { createClient } from '@supabase/supabase-js';

// 1. Cole aqui o SEU Project URL exato
const supabaseUrl = 'https://crfezleomfildocxcxkx.supabase.co';

// 2. Cole aqui a SUA Chave gigante que começa com eyJ
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyZmV6bGVvbWZpbGRvY3hjeGt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMDA1MDksImV4cCI6MjA5MTc3NjUwOX0.SW-stfrvOiX4eHUAOnxnfQ0U7Gr6HVlWnq57PjRAZUo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);