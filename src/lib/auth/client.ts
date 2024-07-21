'use client';

import { supabase } from '../supabase';
import type { User } from '@/types/user';

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

class AuthClient {
  async signUp(params: SignUpParams): Promise<{ error?: string }> {
    const { email, password, firstName, lastName } = params;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstName,
          lastName
        }
      }
    });

    return { error: error?.message };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    const { email, password } = params;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    return { error: error?.message };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (!session) {
      return { data: null };
    }

    const { user } = session;
    return { data: user, error: error?.message };
  }

  async signOut(): Promise<{ error?: string }> {
    const { error } = await supabase.auth.signOut();
    return { error: error?.message };
  }
}

export const authClient = new AuthClient();
