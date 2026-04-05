/*
import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navigation from './components/Navigation';
import CourseCard from './components/CourseCard';

function App() {
  // 1. Létrehozunk egy állapotot (state) a kurzusoknak, alapból üres tömb
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Ez a függvény kéri le az adatokat a PHP-tól
  useEffect(() => {
    fetch('http://localhost/edulearn_api/index.php')
      .then(response => response.json())
      .then(data => {
        setCourses(data); // Elmentjük a kapott adatokat
        setIsLoading(false); // Kikapcsoljuk a töltés jelzést
      })
      .catch(error => {
        console.error('Hiba az adatok lekérésekor:', error);
        setIsLoading(false);
      });
  }, []); // A [] biztosítja, hogy csak egyszer fusson le betöltéskor

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-50 flex flex-col">
        {/* FELSŐ NAVIGÁCIÓ }
        <Navigation />

        <div className='flex flex-1'>
          {/* OLDALSÓ MENÜ }
          <Sidebar />

          {/* FŐ TARTALOM }
          <main className="flex-1 p-8">
           <header className="mb-8">
             <h1 className="text-3xl font-bold text-gray-900">Welcome back, John!</h1>
             <p className="text-gray-600 mt-1">Here's what's happening with your courses today.</p>
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
    </BrowserRouter>
  );
}

export default App;*/
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Dashboard from './components/Dashboard'; // Kiszervezzük a főoldalt
import CoursePage from './components/CoursePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/course/:courseId" element={<CoursePage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;