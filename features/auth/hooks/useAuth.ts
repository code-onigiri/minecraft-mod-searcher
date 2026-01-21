'use client';

import { useEffect, useState } from 'react';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';
import type { AuthUser } from '@/types/auth';

const mapSessionToUser = (session: Session | null): AuthUser | null => {
  if (!session?.user) {
    return null;
  }

  const provider = session.user.app_metadata?.provider === 'github' ? 'github' : 'email';

  return {
    id: session.user.id,
    email: session.user.email ?? undefined,
    provider,
    avatarUrl: session.user.user_metadata?.avatar_url ?? undefined,
  };
};

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      if (!isMounted) {
        return;
      }

      setSession(data.session);
      setUser(mapSessionToUser(data.session));
      setIsLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, nextSession: Session | null) => {
        setSession(nextSession);
        setUser(mapSessionToUser(nextSession));
        setIsLoading(false);
      },
    );

    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    user,
    isLoading,
    isAuthenticated: Boolean(user),
  };
}
