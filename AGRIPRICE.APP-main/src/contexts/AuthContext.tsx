import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { login as apiLogin, signup as apiSignup, fetchUser, setToken, getToken } from '../lib/mockApi';

export interface MockUser {
  id: number;
  email: string;
  full_name?: string;
  role?: string;
  market?: string;
  county?: string;
  sub_location?: string;
  phone?: string;
  shop_name?: string;
  shop_location?: string;
}

interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role: string, phone?: string, county?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await fetchUser();
        setUser(currentUser);
      } catch {
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const { user: userData, token } = await apiLogin({ email, password });
      setToken(token);
      setUser(userData);
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, fullName: string, role: string, phone?: string, county?: string) => {
      setLoading(true);
      try {
        const { user: userData, token } = await apiSignup({
          email,
          password,
          full_name: fullName,
          role,
          phone,
          county,
        });
        setToken(token);
        setUser(userData);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    setToken(null);
    setUser(null);
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    signOut,
    signIn,
    signUp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
