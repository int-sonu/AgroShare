'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (user: User, token: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('accessToken');

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        if (storedToken) {
          setAccessToken(storedToken);
        }

        const res = await fetch(`${API}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });

        if (!res.ok) {
          setLoading(false);
          return;
        }

        const data = await res.json();

        if (!data.accessToken) {
          setLoading(false);
          return;
        }

        setAccessToken(data.accessToken);
        localStorage.setItem('accessToken', data.accessToken);

        const userRes = await fetch(`${API}/auth/user`, {
          headers: {
            Authorization: `Bearer ${data.accessToken}`,
          },
        });

        if (userRes.ok) {
          const userData = await userRes.json();

          setUser(userData.user);

          localStorage.setItem('user', JSON.stringify(userData.user));
        }
      } catch {
        console.log('Session restore failed');
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [API]);

  const login = (user: User, token: string) => {
    setUser(user);
    setAccessToken(token);

    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('accessToken', token);
  };

  const logout = async () => {
    try {
      await fetch(`${API}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch {
      console.log('Logout failed');
    }

    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');

    setUser(null);
    setAccessToken(null);

    window.location.href = '/auth/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        logout,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
