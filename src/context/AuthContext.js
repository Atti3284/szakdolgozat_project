import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../firebase'; // Importáljuk a configot
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Bejelentkezés funkció
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Kijelentkezés funkció
  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    // Ez a függvény figyeli a Firebase állapotát (be van-e lépve valaki)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Itt majd később összekötjük a saját MySQL adatbázisoddal is!
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          full_name: user.displayName || user.email.split('@')[0],
          role: 'student' // Alapértelmezett szerepkör
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = { currentUser, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}