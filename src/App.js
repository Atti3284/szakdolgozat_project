import React, { useState, useEffect } from 'react';
import CourseCard from './components/CourseCard';
import { BrowserRouter } from 'react-router-dom';

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
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar rész... */}
        
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">My Courses (From PHP)</h1>
          
          {isLoading ? (
            <div className="flex justify-center italic text-gray-500">Adatok betöltése...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          )}
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;