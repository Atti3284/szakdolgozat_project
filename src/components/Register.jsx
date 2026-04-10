import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // 1. Regisztráció Firebase-be
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Adatok mentése a saját MySQL adatbázisunkba
      await fetch('http://localhost/edulearn_api/register_user.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          full_name: fullName,
          role: 'student'
        })
      });

      navigate('/dashboard');
    } catch (error) {
      alert("Hiba: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Regisztráció</h2>
        <input 
          type="text" placeholder="Teljes név" className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setFullName(e.target.value)} required
        />
        <input 
          type="email" placeholder="Email" className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setEmail(e.target.value)} required
        />
        <input 
          type="password" placeholder="Jelszó (min. 6 karakter)" className="w-full p-2 mb-6 border rounded"
          onChange={(e) => setPassword(e.target.value)} required
        />
        <button className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
          Fiók létrehozása
        </button>
      </form>
    </div>
  );
}