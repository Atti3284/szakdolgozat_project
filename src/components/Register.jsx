import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

export default function Register() {
  // Regisztrációs form mezők állapotai
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();

  // Regisztráció kezelése: Firebase + MySQL mentés egyszerre
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // 1. FIREBASE REGISZTRÁCIÓ – létrehozza a felhasználót a Firebase Auth-ban
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. MYSQL MENTÉS – kiegészítő adatok (teljes név, szerepkör) mentése a saját adatbázisba
      await fetch('http://localhost/edulearn_api/register_user.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,       // Firebase UID – összeköti a két rendszert
          email: user.email,
          full_name: fullName,
          role: 'student'      // Új regisztrálók alapértelmezetten diák szerepkört kapnak
        })
      });

      // Sikeres regisztráció után az új diák a dashboardra kerül
      navigate('/dashboard');
    } catch (error) {
      alert("Hiba: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* REGISZTRÁCIÓS FORM */}
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Regisztráció</h2>

        {/* Teljes név mező */}
        <input
          type="text" placeholder="Teljes név" className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setFullName(e.target.value)} required
        />
        {/* Email mező */}
        <input
          type="email" placeholder="Email" className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setEmail(e.target.value)} required
        />
        {/* Jelszó mező – minimum 6 karaktert a Firebase megkövetel */}
        <input
          type="password" placeholder="Jelszó (min. 6 karakter)" className="w-full p-2 mb-6 border rounded"
          onChange={(e) => setPassword(e.target.value)} required
        />
        {/* Regisztráció gomb – form elküldését indítja */}
        <button className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
          Fiók létrehozása
        </button>
      </form>
    </div>
  );
}
