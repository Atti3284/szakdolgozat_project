import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import CourseCard from './CourseCard';
import { BookOpen, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({ totalCourses: 0, completedLessons: 0 });
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {

    const fetchData = async () => {
      if (!currentUser?.uid) return;

      // 1. KURZUSOK LEKÉRÉSE
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost/edulearn_api/get_active_courses.php?uid=${currentUser.uid}`);
        if (!res.ok) throw new Error('Hiba a kurzusok lekérésekor');
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        console.error("Dashboard kurzus hiba:", error);
      }

      // 2. STATISZTIKÁK LEKÉRÉSE
      try {
        const res = await fetch(`http://localhost/edulearn_api/get_stats.php?uid=${currentUser.uid}`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Statisztika hiba:", error);
        // Ha ez elszáll, a stats alapértelmezett marad (0, 0), de az oldal fut tovább
      }

      setIsLoading(false);
    };

    fetchData();
    // Amint bejelentkezik valaki, a Dashboard újra lefut, és lekéri a szeméyre szabott adatokat.
  }, [currentUser]);


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">
          {/* Üdvözlés - Dinamikus névvel */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Üdvözlünk újra, {currentUser?.dbData?.full_name || 'Tanuló'}!
            </h1>
            <p className="text-gray-600 mt-1">Íme a jelenlegi a haladásod.</p>
          </header>

          {/* STATISZTIKA KÁRTYÁK */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            
            {/* 1. Kártya: Kurzusaim */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase font-semibold text-nowrap">Kurzusaim</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
              </div>
            </div>

            {/* 2. Kártya: Befejezett leckék */}
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

          {isLoading ? (
            <div className="flex justify-center p-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.length > 0 ? (
                courses.map(course => (
                  <CourseCard key={course.id} {...course} />
                ))
              ) : (
                <div className="col-span-full bg-white p-10 rounded-xl border border-dashed border-gray-300 text-center">
                  <p className="text-gray-500 mb-4">Úgy tűnik, az elmúlt héten nem foglalkoztál kurzusokkal.</p>
                  <button 
                    onClick={() => navigate('/all-courses')} // Ezt mindjárt megcsináljuk
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