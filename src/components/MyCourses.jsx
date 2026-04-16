import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import Sidebar from './Sidebar';
import CourseCard from './CourseCard';
import { Search } from 'lucide-react'; // Importálunk egy kereső ikont
import { useAuth } from '../context/AuthContext';

export default function MyCourses() {
  const { currentUser } =useAuth();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // Kereséshez

  useEffect(() => {
    if (!currentUser?.uid) return;

    fetch(`http://localhost/edulearn_api/get_my_enrolled_courses.php?uid=${currentUser.uid}`)
      .then(response => response.json())
      .then(data => {
        setCourses(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Hiba:', error);
        setIsLoading(false);
      });
  }, [currentUser]);

  // Szűrés a keresőmező alapján
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
              <p className="text-gray-600">Itt találod az összes kurzust, amire jelentkeztél.</p>
            </div>

            {/* KERESŐMEZŐ */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Keresés a kurzusaim között..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64 italic text-gray-500">
                Loading your courses...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.length > 0 ? (
                filteredCourses.map(course => (
                  <CourseCard key={course.id} {...course} />
                ))
              ) : (
                <div className="col-span-full text-center p-12 bg-white rounded-xl border border-dashed border-gray-300">
                   <p className="text-gray-500">Még nem iratkoztál fel egy kurzusra sem, vagy nincs találat.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}