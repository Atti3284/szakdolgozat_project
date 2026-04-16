import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loginAsGuest } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      alert("Hiba a bejelentkezésnél: " + error.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Edulearn Belépés</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input 
              type="email"
              placeholder="pelda@email.com"
              className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Jelszó</label>
            <input 
              type="password"
              placeholder="••••••••"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        
          <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Belépés
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300"></span>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Vagy</span>
          </div>
        </div>

        <button 
          type="button"
          onClick={() => { loginAsGuest(); navigate('/all-courses'); }}
          className="w-full py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
        >
          Folytatás vendégként
        </button>

        {/* REGISZTRÁCIÓS LINK */}
        <div className="mt-6 text-center border-t pt-4">
          <p className="text-sm text-gray-600">
            Még nincs fiókod?{' '}
            <Link to="/register" className="text-blue-600 hover:underline font-medium">
              Regisztrálj itt!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}