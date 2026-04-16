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
      .then(() => signInWithEmailAndPassword(auth, email, password));
  }

  // Kijelentkezés funkció
  async function logout() {
    await signOut(auth);
    setCurrentUser(null);
  }

  // Vendég funkció
  function loginAsGuest() {
  setCurrentUser({
    uid: 'guest_user',
    email: 'guest@edulearn.com',
    dbData: {
      full_name: 'Vendég',
      role: 'guest'
    }
  });
}

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // Ha vendéglént vagyunk bent, ne csináljon semmit a Firebase figyelő
      if (currentUser?.uid === 'guest_user') return;
      
      if (firebaseUser) {
        // Lekérjük a MySQL-ből a kiegészítő adatokat
        try {
          const res = await fetch(`http://localhost/edulearn_api/get_user_profile.php?uid=${firebaseUser.uid}`);
          const mysqlData = await res.json();
          
          setCurrentUser({ ...firebaseUser, dbData: mysqlData });// Itt lesz a full_name, role, stb.
        } catch (err) {
          console.error("MySQL profil hiba:", err);
          setCurrentUser(firebaseUser);
        }
      } else {
        // Ha nincs Firebase user és nem is vendég vagyunk
        if (currentUser?.uid !== 'guest_user') {
          setCurrentUser(null);
        }
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [currentUser?.uid]);

  const value = { currentUser, login, logout, loginAsGuest };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}