import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import CourseCard from './CourseCard';
import { BookOpen, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  // Bejelentkezett felhasználó adatainak elérése
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Aktív kurzusok listája (legutóbb használt 3 kurzus)
  const [courses, setCourses] = useState([]);
  // Összesített statisztikák (kurzuszszám, befejezett leckék)
  const [stats, setStats] = useState({ totalCourses: 0, completedLessons: 0 });
  // Betöltési állapot – amíg true, a pörgő animáció látható
  const [isLoading, setIsLoading] = useState(true);

  // Adatok lekérése az API-ból, valahányszor változik a bejelentkezett user
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser?.uid) return;

      setIsLoading(true);

      // 1. AKTÍV KURZUSOK LEKÉRÉSE – a legutóbb használt 3 kurzus jelenik meg
      try {
        const res = await fetch(`http://localhost/edulearn_api/get_active_courses.php?uid=${currentUser.uid}`);
        if (!res.ok) throw new Error('Hiba a kurzusok lekérésekor');
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        console.error("Dashboard kurzus hiba:", error);
      }

      // 2. STATISZTIKÁK LEKÉRÉSE – kurzuszszám és befejezett leckék száma
      try {
        const res = await fetch(`http://localhost/edulearn_api/get_stats.php?uid=${currentUser.uid}`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Statisztika hiba:", error);
        // Ha a statisztika API nem érhető el, az oldal akkor is működik (alapértelmezett 0 értékekkel)
      }

      setIsLoading(false);
    };

    fetchData();
    // A useEffect újrafut, ha a bejelentkezett felhasználó megváltozik
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">

          {/* FEJLÉC – dinamikus üdvözlés a felhasználó nevével */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Üdvözlünk újra, {currentUser?.dbData?.full_name || 'Tanuló'}!
            </h1>
            <p className="text-gray-600 mt-1">Íme a jelenlegi a haladásod.</p>
          </header>

          {/* STATISZTIKA KÁRTYÁK – összesített adatok vizuális megjelenítése */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

            {/* 1. Kártya: Feliratkozott kurzusok száma */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase font-semibold text-nowrap">Kurzusaim</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
              </div>
            </div>

            {/* 2. Kártya: Az összes befejezett lecke száma */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg text-green-600">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase font-semibold text-nowrap">Befejezett leckék</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedLessons}</p>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-6">Folytasd a tanulást</h2>

          {/* KURZUSLISTA – betöltés közben animáció, utána kártyák vagy üres állapot */}
          {isLoading ? (
            // Betöltési animáció
            <div className="flex justify-center p-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.length > 0 ? (
                // Ha vannak aktív kurzusok, megjelenítjük CourseCard komponensként
                courses.map(course => (
                  <CourseCard key={course.id} {...course} />
                ))
              ) : (
                // Ha nincs aktív kurzus, bátorítjuk a felhasználót új kurzus keresésére
                <div className="col-span-full bg-white p-10 rounded-xl border border-dashed border-gray-300 text-center">
                  <p className="text-gray-500 mb-4">Úgy tűnik, az elmúlt héten nem foglalkoztál kurzusokkal.</p>
                  <button
                    onClick={() => navigate('/all-courses')}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Böngéssz az összes kurzus között →
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
