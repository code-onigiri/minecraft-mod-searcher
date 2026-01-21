import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

export type AuthProvider = 'github' | 'email';

export type AuthUser = {
  id: string;
  email?: string;
  provider: AuthProvider;
  avatarUrl?: string;
};

export type AuthError = {
  message: string;
};

export type AuthResult = {
  success: boolean;
  user?: AuthUser;
  error?: AuthError;
};

export type AuthStateCallback = (event: AuthChangeEvent, session: Session | null) => void;
