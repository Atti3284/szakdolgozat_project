import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import Sidebar from './Sidebar';
import CourseCard from './CourseCard';
import { useAuth } from '../context/AuthContext';
import { Search } from 'lucide-react'; // 1. IMPORTÁLTUK A KERESŐ IKONT

export default function AllCourses() {
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // 2. KERESŐ ÁLLAPOT

  useEffect(() => {
    const fetchAllCourses = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost/edulearn_api/get_courses.php?uid=${currentUser?.uid || ''}`);
        if (!res.ok) throw new Error('Hiba a kurzusok lekérésekor');
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        console.error("Hiba a kurzusok betöltésekor:", error);
      }
      setIsLoading(false);
    };

    fetchAllCourses();
  }, [currentUser]);

  // 3. SZŰRÉS LOGIKA
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">
          
          {/* Címsor és Kereső */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Összes elérhető kurzus
              </h1>
              <p className="text-gray-600 mt-1">
                  Válogass kedvedre és iratkozz fel új tananyagokra!
              </p>
            </div>

            {/* KERESŐMEZŐ */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Keresés a kurzusok között..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map(course => (
                      // 4. ITT KAPCSOLJUK KI A PROGRESST: showProgress={false}
                      <CourseCard key={course.id} {...course} showProgress={false} />
                  ))
                ) : (
                  <div className="col-span-full text-center p-12 bg-white rounded-xl border border-dashed border-gray-300">
                     <p className="text-gray-500">Nincs találat a keresésre.</p>
                  </div>
                )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}