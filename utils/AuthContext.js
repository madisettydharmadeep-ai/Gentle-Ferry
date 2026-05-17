'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [rawUser, setRawUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isTestingMode = process.env.NEXT_PUBLIC_APP_MODE === 'testing';

  // Overwrite user object when in testing mode
  const user = isTestingMode && rawUser ? {
    ...rawUser,
    name: "Kazama",
    image: null, // Forces text-based avatar showing first char "K" in navbar and profile
  } : rawUser;

  useEffect(() => {
    const stored = localStorage.getItem('wj_user');
    if (stored) {
      try {
        setRawUser(JSON.parse(stored));
      } catch {}
    } else if (isTestingMode) {
      // frictionless mock login for demo testing mode
      setRawUser({
        id: 'test-user-id',
        _id: 'test-user-id-abcdef',
        name: 'Kazama',
        email: 'kazama@whimsical.com',
        createdAt: '2026-02-14T14:30:00.000Z' // Hardcoded to Valentine's Day 2026 for consistent cozy manifest data!
      });
    }
    setLoading(false);
  }, [isTestingMode]);

  const login = (userData) => {
    setRawUser(userData);
    localStorage.setItem('wj_user', JSON.stringify(userData));
  };

  const logout = () => {
    setRawUser(null);
    localStorage.removeItem('wj_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
