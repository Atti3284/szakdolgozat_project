import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navigation from './Navigation';
import Sidebar from './Sidebar';
import { CheckCircle, Circle, ArrowLeft, Trash2, Plus, BookOpen } from 'lucide-react';

export default function CoursePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeLesson, setActiveLesson] = useState(null);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonContent, setNewLessonContent] = useState("");

  const isTeacher = currentUser && course && currentUser.uid === course.instructor_uid;

  useEffect(() => {
    fetchCourseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, currentUser]);

  const fetchCourseData = async () => {
    try {
      const res = await fetch(`http://localhost/edulearn_api/get_course_details.php?course_id=${courseId}&uid=${currentUser?.uid || ''}`);
      const data = await res.json();
      setCourse(data.course);
      setLessons(data.lessons);
      
      // Ha vannak leckék, alapból az elsőt jelöljük ki
      if (data.lessons.length > 0 && !activeLesson) {
        setActiveLesson(data.lessons[0]);
      }
    } catch (error) {
      console.error("Hiba:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLesson = async () => {
    if (!newLessonTitle.trim()) return;
    try {
      const res = await fetch('http://localhost/edulearn_api/add_lesson.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_id: courseId,
          title: newLessonTitle,
          content: newLessonContent
        })
      });
      if (res.ok) {
        setNewLessonTitle("");
        setNewLessonContent("");
        fetchCourseData();
      }
    } catch (error) {
      console.error("Hiba a hozzáadáskor:", error);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("Biztosan törlöd ezt a leckét?")) return;
    try {
      const res = await fetch('http://localhost/edulearn_api/delete_lesson.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lesson_id: lessonId }),
      });
      const data = await res.json();
      if (data.status === "success") {
        fetchCourseData();
        if (activeLesson?.id === lessonId) setActiveLesson(null); // Ha az aktívat töröltük, ürítsük ki
      }
    } catch (error) {
      console.error("Hiba a lecke törlésekor:", error);
    }
  };

  const toggleLesson = async (lessonId, currentStatus) => {
    try {
      const res = await fetch('http://localhost/edulearn_api/update_lesson.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: currentUser.uid,
          courseId: courseId,
          lessonId: lessonId,
          completed: !currentStatus
        })
      });
      if (res.ok) {
        // Frissítjük a listát
        setLessons(prev => prev.map(l => l.id === lessonId ? { ...l, completed: !currentStatus } : l));
        // SZINKRONIZÁLJUK az activeLesson-t is, hogy a gomb színe azonnal megváltozzon!
        if (activeLesson?.id === lessonId) {
          setActiveLesson(prev => ({ ...prev, completed: !currentStatus }));
        }
      }
    } catch (error) {
      console.error("Hiba:", error);
    }
  };

  if (isLoading) return <div className="p-10 text-center">Betöltés...</div>;

  // Segédváltozó a "Next Lesson" gombhoz (hanyadik az aktív lecke a listában)
  const activeLessonIndex = lessons.findIndex(l => l.id === activeLesson?.id);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navigation />
        
        <main className="flex-1 overflow-y-auto p-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 mb-6 hover:text-blue-600 transition-colors">
            <ArrowLeft size={20} /> Vissza a kurzusokhoz
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* BAL OLDAL: LECKE TARTALMA ÉS GOMBOK */}
            <div className="lg:col-span-2 space-y-6">
              {activeLesson ? (
                <div className="bg-white rounded-2xl shadow-sm border p-8 flex flex-col min-h-[400px]">
                  <h1 className="text-3xl font-bold text-gray-800 mb-6">{activeLesson.title}</h1>
                  
                  {/* Lecke szövege */}
                  <div className="prose max-w-none text-gray-600 leading-relaxed flex-1">
                    {activeLesson.content ? (
                       activeLesson.content.split('\n').map((line, i) => <p key={i} className="mb-4">{line}</p>)
                    ) : (
                      <p className="italic text-gray-400">Ehhez a leckéhez még nincs tartalom.</p>
                    )}
                  </div>

                  {/* AKCIÓ GOMBOK (Visszahozva és bekötve az új logikába) */}
                  {!isTeacher && ( // Tanárnak ezek a gombok feleslegesek
                    <div className="flex items-center gap-4 pt-8 mt-4 border-t border-gray-100">
                      <button 
                        onClick={() => toggleLesson(activeLesson.id, activeLesson.completed)}
                        className={`px-8 py-3 rounded-xl font-semibold transition-all shadow-md ${
                          Number(activeLesson.completed) === 1
                            ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg'
                        }`}
                      >
                        {Number(activeLesson.completed) === 1 ? 'Completed ✓' : 'Mark as Completed'}
                      </button>
                      
                      <button 
                        onClick={() => {
                          if (activeLessonIndex < lessons.length - 1) {
                            setActiveLesson(lessons[activeLessonIndex + 1]);
                          }
                        }}
                        disabled={activeLessonIndex === lessons.length - 1}
                        className={`px-8 py-3 rounded-xl transition-all border ${
                          activeLessonIndex === lessons.length - 1
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                            : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200 shadow-sm'
                        }`}
                      >
                        {activeLessonIndex === lessons.length - 1 ? 'Utolsó lecke' : 'Next Lesson →'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
                  <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                  <h2 className="text-xl font-semibold text-gray-500">Válassz egy leckét a folytatáshoz!</h2>
                </div>
              )}
            </div>

            {/* JOBB OLDAL: LECKELISTÁK ÉS HALADÁS */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border">
                <h3 className="font-bold text-gray-800 mb-4">Tananyag</h3>
                
                {/* Haladás sáv diákoknak */}
                {!isTeacher && lessons.length > 0 && (
                  <div className="mb-6">
                    <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${(lessons.filter(l => Number(l.completed) === 1).length / lessons.length) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 text-right">
                      {lessons.filter(l => Number(l.completed) === 1).length} / {lessons.length} kész
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  {lessons.map((lesson) => (
                    <div 
                      key={lesson.id} 
                      onClick={() => setActiveLesson(lesson)} 
                      className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                        activeLesson?.id === lesson.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50 border-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {!isTeacher && (
                          <button onClick={(e) => { e.stopPropagation(); toggleLesson(lesson.id, lesson.completed); }}>
                            {Number(lesson.completed) === 1 ? <CheckCircle className="text-green-500" size={20} /> : <Circle className="text-gray-300" size={20} />}
                          </button>
                        )}
                        <span className={`font-medium ${activeLesson?.id === lesson.id ? 'text-blue-700' : 'text-gray-700'}`}>
                          {lesson.title}
                        </span>
                      </div>
                      {isTeacher && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLesson(lesson.id);
                          }}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* TANÁRI FUNKCIÓ: Létrehozás tartalommal */}
                {isTeacher && (
                  <div className="mt-8 pt-6 border-t space-y-3">
                    <h4 className="font-semibold text-sm text-gray-600">Új lecke hozzáadása</h4>
                    <input 
                      value={newLessonTitle} 
                      onChange={(e) => setNewLessonTitle(e.target.value)}
                      placeholder="Lecke címe..." 
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                    <textarea 
                      value={newLessonContent}
                      onChange={(e) => setNewLessonContent(e.target.value)}
                      placeholder="Lecke tartalma..."
                      rows="4"
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-sm"
                    />
                    <button onClick={handleAddLesson} className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2">
                      <Plus size={20} /> Hozzáadás
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}