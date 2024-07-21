'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useUser() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        setError(error.message);
      } else {
        setUser(data?.user || null);
      }
      setIsLoading(false);
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { user, error, isLoading };
}
