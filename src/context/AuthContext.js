import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../firebase'; // Firebase Auth konfiguráció importálása
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { setPersistence, browserSessionPersistence } from "firebase/auth";

// Globális Auth kontextus létrehozása – ezen keresztül érjük el a felhasználói adatokat bárhonnan
const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Aktuális bejelentkezett felhasználó állapota (null, ha nincs)
  const [currentUser, setCurrentUser] = useState(null);
  // Betöltési állapot – amíg true, az alkalmazás nem renderelésal (fehér villanás elkerülése)
  const [loading, setLoading] = useState(true);

  // Bejelentkezés: session-szintű perzisztenciával (böngésző bezárásakor kijelentkezik)
  function login(email, password) {
    return setPersistence(auth, browserSessionPersistence)
      .then(() => signInWithEmailAndPassword(auth, email, password));
  }

  // Kijelentkezés: Firebase-ből kilép és törli a helyi user állapotot
  async function logout() {
    await signOut(auth);
    setCurrentUser(null);
  }

  // Vendég bejelentkezés: nem valódi Firebase user, csak egy szimulált objektum
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

  // Firebase Auth figyelő – automatikusan fut, ha változik a bejelentkezési állapot
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // Vendég esetén nem kell semmit csinálni, a Firebase nem kezeli őt
      if (currentUser?.uid === 'guest_user') return;
      
      if (firebaseUser) {
        // Bejelentkezett user esetén lekérjük a MySQL adatbázisból a kiegészítő adatokat (név, szerepkör)
        try {
          const res = await fetch(`http://localhost/edulearn_api/get_user_profile.php?uid=${firebaseUser.uid}`);
          const mysqlData = await res.json();
          
          // A Firebase user adatait és a MySQL adatokat összevonjuk egy objektumba
          setCurrentUser({ ...firebaseUser, dbData: mysqlData });
        } catch (err) {
          console.error("MySQL profil hiba:", err);
          // Ha az API nem érhető el, legalább a Firebase user adatait mentjük
          setCurrentUser(firebaseUser);
        }
      } else {
        // Ha nincs Firebase user és nem vendégként vagyunk bent, töröljük az állapotot
        if (currentUser?.uid !== 'guest_user') {
          setCurrentUser(null);
        }
      }
      setLoading(false);
    });

    // Cleanup: leiratkozás a figyelőről, ha a komponens eltávolításra kerül
    return unsubscribe;
  }, [currentUser?.uid]);

  // A kontextuson keresztül publikált értékek és függvények
  const value = { currentUser, login, logout, loginAsGuest };

  return (
    <AuthContext.Provider value={value}>
      {/* Csak akkor rendereli a gyermekeket, ha a betöltés kész (elkerüli a villanást) */}
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Egyszerűsített hook az AuthContext eléréséhez bármely komponensből
export function useAuth() {
  return useContext(AuthContext);
}
