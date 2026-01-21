import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';
import type { AuthResult, AuthStateCallback, AuthUser } from '@/types/auth';

const mapSessionToUser = (session: Session | null): AuthUser | undefined => {
  if (!session?.user) {
    return undefined;
  }

  const provider = session.user.app_metadata?.provider === 'github' ? 'github' : 'email';

  return {
    id: session.user.id,
    email: session.user.email ?? undefined,
    provider,
    avatarUrl: session.user.user_metadata?.avatar_url ?? undefined,
  };
};

export const authService = {
  async signInWithGitHub(): Promise<AuthResult> {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'github' });

    if (error) {
      return { success: false, error: { message: error.message } };
    }

    return { success: true };
  },
  async signInWithEmail(email: string, password: string): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: { message: error.message } };
    }

    return { success: true, user: mapSessionToUser(data.session) };
  },
  async signUp(email: string, password: string): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      return { success: false, error: { message: error.message } };
    }

    return { success: true, user: mapSessionToUser(data.session) };
  },
  async signOut(): Promise<void> {
    await supabase.auth.signOut();
  },
  async getSession(): Promise<Session | null> {
    const { data } = await supabase.auth.getSession();
    return data.session ?? null;
  },
  async getGitHubToken(): Promise<string | null> {
    const { data } = await supabase.auth.getSession();
    return data.session?.provider_token ?? null;
  },
  onAuthStateChange(callback: AuthStateCallback): () => void {
    const { data } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        callback(event, session);
      },
    );

    return () => {
      data.subscription.unsubscribe();
    };
  },
};
