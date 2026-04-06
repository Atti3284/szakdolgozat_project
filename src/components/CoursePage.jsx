import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navigation from './Navigation';
import Sidebar from './Sidebar';
import { CheckCircle2, Circle, Play, Clock } from 'lucide-react';

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

  // 4. Lecke állapotának frissítése (Update - POST kérés a PHP-nak)
  const toggleLessonComplete = () => {
    const currentLesson = lessons[selectedLesson];
    if (!currentLesson) return;

    // Szigorú összehasonlítás (Number-ré alakítva a biztonság kedvéért)
    const currentStatus = Number(currentLesson.completed);
    // Ha 1 (true), akkor 0 (false) lesz, és fordítva
    const newStatus = currentStatus === 1 ? 0 : 1;

    fetch('http://localhost/edulearn_api/update_lesson.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lessonId: currentLesson.id,
        completed: newStatus
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        // Lokális frissítés, hogy azonnal látszódjon a változás a pipánál
        const updatedLessons = [...lessons];
        updatedLessons[selectedLesson].completed = newStatus;
        setLessons(updatedLessons);
      }
    })
    .catch(err => console.error("Hiba a mentéskor:", err));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
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
                        {/* Pipa ikon állapottól függően */}
                        {parseInt(lesson.completed) === 1 ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 mb-1 truncate">{lesson.title}</div>
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
            <div className="flex-1 overflow-y-auto bg-white">
              <div className="p-8 max-2-4xl mx-auto">
                {/* Videó "lejátszó" (Placeholder) */}
                <div className="bg-gray-900 rounded-2xl aspect-video flex items-center justify-center mb-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                  <button className="flex items-center justify-center w-20 h-20 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-transform hover:scale-110 z-10 shadow-lg">
                    <Play className="w-10 h-10 ml-1 fill-current" />
                  </button>
                </div>

                {/* Lecke információk */}
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {lessons[selectedLesson]?.title || "Válassz egy leckét"}
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Üdvözöljük ebben a leckében! Itt mélyebben megismerkedhetsz a témával. 
                    A haladásodat bármikor rögzítheted az alábbi gombbal, ami frissíti az adatbázist.
                  </p>
                </div>
                
                {/* Akció gombok */}
                <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                  <button 
                    onClick={toggleLessonComplete}
                    className={`px-8 py-3 rounded-xl font-semibold transition-all shadow-md ${
                      lessons[selectedLesson]?.completed === 1
                        ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg'
                    }`}
                  >
                    {Number(lessons[selectedLesson]?.completed) === 1 ? 'Completed ✓' : 'Mark as Completed'}
                  </button>
                  
                  <button className="px-8 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl transition-all">
                    Next Lesson →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}