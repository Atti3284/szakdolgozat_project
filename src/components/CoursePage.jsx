import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navigation from './Navigation';
import Sidebar from './Sidebar';
import { CheckCircle2, Circle, FileText, Play, Clock } from 'lucide-react';

export default function CoursePage() {
  // 1. Kiszedjük az URL-ből az ID-t (pl. /course/1 -> courseId = 1)
  const { courseId } = useParams();
  
  // 2. Állapotok (States) létrehozása
  const [lessons, setLessons] = useState([]); // Itt tároljuk a PHP-ból jött leckéket
  const [selectedLesson, setSelectedLesson] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // 3. A HOOK: Ez fut le, amikor az oldal betöltődik
  useEffect(() => {
    // Megszólítjuk a PHP-t, és elküldjük neki, melyik kurzus leckéi kellenek
    fetch(`http://localhost/edulearn_api/get_lessons.php?id=${courseId}`)
      .then(response => response.json())
      .then(data => {
        setLessons(data);    // Elmentjük a leckéket a state-be
        setIsLoading(false); // Leállítjuk a töltésjelzőt
      })
      .catch(error => {
        console.error("Hiba a leckék betöltésekor:", error);
        setIsLoading(false);
      });
  }, [courseId]); // Ha megváltozik az ID az URL-ben, fusson le újra

  if (isLoading) {
    return <div className="p-10 text-center">Betöltés...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          {/* Kurzus címe (egyelőre statikus, vagy lekérhetjük egy másik API-ból) */}
          <div className="bg-white border-b border-gray-200 px-8 py-6">
            <h1 className="text-2xl text-gray-900 mb-2">Course Lessons</h1>
            <p className="text-gray-600">ID: {courseId} kurzus tartalma</p>
          </div>

          <div className="flex h-[calc(100vh-185px)]">
            {/* Bal oldali lecke lista */}
            <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
              <div className="p-4">
                <h2 className="text-lg text-gray-900 mb-4">Course Content</h2>
                <div className="space-y-2">
                  {lessons.length > 0 ? (
                    lessons.map((lesson, index) => (
                      <button
                        key={lesson.id}
                        onClick={() => setSelectedLesson(index)}
                        className={`w-full flex items-start gap-3 p-3 rounded-lg transition-colors text-left ${
                          selectedLesson === index ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                        }`}
                      >
                        {parseInt(lesson.completed) ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-gray-900 mb-1">{lesson.title}</div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{lesson.duration}</span>
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">Nincsenek leckék ehhez a kurzushoz.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Jobb oldali tartalom (Videó helye) */}
            <div className="flex-1 overflow-y-auto bg-white p-8">
               <div className="bg-gray-900 rounded-xl aspect-video flex items-center justify-center mb-6">
                  <Play className="w-16 h-16 text-blue-600 fill-current" />
               </div>
               <h2 className="text-3xl font-bold mb-4">
                  {lessons[selectedLesson]?.title || "Válassz egy leckét"}
               </h2>
               <p className="text-gray-600">Itt jelenik meg a lecke részletes leírása a PHP/MySQL-ből...</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}