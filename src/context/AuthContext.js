import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // EGYELŐRE: "Színleljük" a bejelentkezést, amíg nincs Firebase
    // Ez segít megírni a designt a valódi adatokkal
    const mockUser = {
      id: 1,
      full_name: 'Kovács János',
      role: 'student',
      avatar: 'https://via.placeholder.com/40'
    };
    
    setCurrentUser(mockUser);
    setLoading(false);
  }, []);

  const value = { currentUser };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}