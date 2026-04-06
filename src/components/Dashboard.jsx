import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import Sidebar from './Sidebar';
import CourseCard from './CourseCard';
import { BookOpen, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({ totalCourses: 0, completedLessons: 0 });
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
    const fetchData = async () => {
      // 1. KURZUSOK LEKÉRÉSE (Ez a fő tartalom)
      try {
        const res = await fetch('http://localhost/edulearn_api/get_courses.php');
        if (!res.ok) throw new Error('Hiba a kurzusok lekérésekor');
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        console.error("Kurzus hiba:", error);
        // Itt akár egy hibaüzenetet is be lehet állítani a felhasználónak
      }

      // 2. STATISZTIKÁK LEKÉRÉSE (Ez kiegészítő infó)
      try {
        const res = await fetch('http://localhost/edulearn_api/get_stats.php');
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
  }, []);


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Üdvözlünk újra!</h1>
            <p className="text-gray-600 mt-1">Íme a jelenlegi kurzusaid és a haladásod.</p>
          </header>

          {/* STATISZTIKA KÁRTYÁK */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            
            {/* 1. Kártya: Kurzusaim */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="p-3 gb-blue-100 rounded-lg text-blue-600">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase font-semibold">Kurzusaim</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
              </div>
            </div>

            {/* 2. Kártya: Befejezett leckék */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg text-green-600">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase font semibold">Befejezett leckék</p>
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
              {courses.map(course => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}