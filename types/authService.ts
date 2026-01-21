import type { Session } from '@supabase/supabase-js';
import type { AuthResult, AuthStateCallback } from '@/types/auth';

export type AuthService = {
  signInWithGitHub: () => Promise<AuthResult>;
  signInWithEmail: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  getSession: () => Promise<Session | null>;
  getGitHubToken: () => Promise<string | null>;
  onAuthStateChange: (callback: AuthStateCallback) => () => void;
};
