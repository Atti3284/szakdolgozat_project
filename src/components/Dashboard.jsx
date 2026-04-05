import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import Sidebar from './Sidebar';
import CourseCard from './CourseCard';

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // A korábbi index.php-t neveztük át get_courses.php-ra
    fetch('http://localhost/edulearn_api/get_courses.php')
      .then(response => response.json())
      .then(data => {
        setCourses(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Hiba a kurzusok betöltésekor:', error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Üdvözlünk újra, John!</h1>
            <p className="text-gray-600 mt-1">Íme a jelenlegi kurzusaid és a haladásod.</p>
          </header>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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