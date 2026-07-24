import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

const DEFAULT_USER = {
  isLoggedIn: false,
  user: {
    id: null,
    name: '',
    email: '',
    avatar: null,
    xp: 0,
    level: 1,
    streak: 0,
    subjects: [],
    studyPreferences: {}
  }
};

export function UserProvider({ children }) {
  const [session, setSession] = useState(() => {
    try {
      const stored = localStorage.getItem('ew_user_session');
      return stored ? JSON.parse(stored) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  useEffect(() => {
    localStorage.setItem('ew_user_session', JSON.stringify(session));
  }, [session]);

  const login = (userData) => {
    setSession({
      isLoggedIn: true,
      user: { ...DEFAULT_USER.user, ...userData },
    });
  };

  const updateUser = (updates) => {
    setSession(prev => ({
      ...prev,
      user: { ...prev.user, ...updates }
    }));
  };

  const logout = () => {
    localStorage.removeItem('ew_user_session');
    setSession(DEFAULT_USER);
  };

  return (
    <UserContext.Provider value={{ ...session, login, updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used inside UserProvider');
  return ctx;
}
