import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../firebase'; // Importáljuk a configot
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { setPersistence, browserSessionPersistence } from "firebase/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Bejelentkezés funkció
  function login(email, password) {
    return setPersistence(auth, browserSessionPersistence)
      .then(() => {
        return signInWithEmailAndPassword(auth, email, password);
      });
  }

  // Kijelentkezés funkció
  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Lekérjük a MySQL-ből a kiegészítő adatokat
        try {
          const res = await fetch(`http://localhost/edulearn_api/get_user_profile.php?uid=${firebaseUser.uid}`);
          const mysqlData = await res.json();
          
          setCurrentUser({
            ...firebaseUser,
            dbData: mysqlData // Itt lesz a full_name, role, stb.
          });
        } catch (err) {
          console.error("MySQL profil hiba:", err);
          setCurrentUser(firebaseUser);
        }
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