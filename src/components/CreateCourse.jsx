import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

export default function CreateCourse() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [color, setColor] = useState('bg-blue-600');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Színválasztó opciók Tailwind osztályokkal
  const colorOptions = [
    { label: 'Kék', value: 'bg-blue-600' },
    { label: 'Zöld', value: 'bg-green-500' },
    { label: 'Lila', value: 'bg-purple-600' },
    { label: 'Piros', value: 'bg-red-600' },
    { label: 'Sárga', value: 'bg-yellow-500' },
    { label: 'Indigó', value: 'bg-indigo-600' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("A kurzus címe kötelező!");

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost/edulearn_api/create_course.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          instructor: currentUser.dbData.full_name || currentUser.email.split('@')[0],
          instructor_uid: currentUser.uid,
          color,
          imageUrl: imageUrl.trim() !== '' ? imageUrl : null
        })
      });

      const result = await response.json();

      if (result.status === 'success') {
        alert("Kurzus sikeresen létrehozva!");
        navigate('/my-courses'); // Visszavisszük a kurzusaihoz
      } else {
        alert("Hiba: " + result.message);
      }
    } catch (error) {
      console.error("Hiba a mentés során:", error);
      alert("Hálózati hiba történt.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Új Kurzus Létrehozása</h1>
            <p className="text-gray-600 mb-8">Oszd meg a tudásod a diákokkal! Töltsd ki az alábbi űrlapot az új kurzusod indításához.</p>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              
              {/* Kurzus Címe */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Kurzus Címe *</label>
                <input
                  type="text"
                  placeholder="Pl. Haladó React technikák"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Borítókép URL */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Borítókép (URL) - opcionális</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">Másolj be egy kép linket, vagy hagyd üresen egy alapértelmezett színes háttérhez.</p>
              </div>

              {/* Színválasztó */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 mb-2">Téma Színe (ha nincs kép)</label>
                <div className="flex gap-4">
                  {colorOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setColor(opt.value)}
                      className={`w-10 h-10 rounded-full transition-transform ${opt.value} ${color === opt.value ? 'ring-4 ring-offset-2 ring-blue-400 scale-110' : 'hover:scale-110'}`}
                      title={opt.label}
                    />
                  ))}
                </div>
              </div>

              {/* Gombok */}
              <div className="flex gap-4 border-t pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Mentés folyamatban...' : 'Kurzus Létrehozása'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/my-courses')}
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Mégsem
                </button>
              </div>

            </form>
          </div>
        </main>
      </div>
    </div>
  );
}