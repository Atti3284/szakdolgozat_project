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
  
  // ÚJ ÁLLAPOTOK
  const [activeLesson, setActiveLesson] = useState(null); // Ezt a leckét látjuk éppen
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonContent, setNewLessonContent] = useState(""); // Tartalom a létrehozáshoz

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
          content: newLessonContent // Most már a tartalmat is elküldjük!
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

  // ... (delete és toggleProgress marad a régi)

  if (isLoading) return <div className="p-10 text-center">Betöltés...</div>;

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
            
            {/* BAL OLDAL: LECKE TARTALMA (A lényeg!) */}
            <div className="lg:col-span-2 space-y-6">
              {activeLesson ? (
                <div className="bg-white rounded-2xl shadow-sm border p-8">
                  <h1 className="text-3xl font-bold text-gray-800 mb-4">{activeLesson.title}</h1>
                  <div className="prose max-w-none text-gray-600 leading-relaxed">
                    {/* Itt jelenik meg a tartalom! */}
                    {activeLesson.content ? (
                       activeLesson.content.split('\n').map((line, i) => <p key={i} className="mb-4">{line}</p>)
                    ) : (
                      <p className="italic text-gray-400">Ehhez a leckéhez még nincs tartalom.</p>
                    )}
                  </div>
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
                <div className="space-y-3">
                  {lessons.map((lesson) => (
                    <div 
                      key={lesson.id} 
                      onClick={() => setActiveLesson(lesson)} // Kattintásra ez lesz az aktív
                      className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                        activeLesson?.id === lesson.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50 border-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {lesson.completed ? <CheckCircle className="text-green-500" size={20} /> : <Circle className="text-gray-300" size={20} />}
                        <span className={`font-medium ${activeLesson?.id === lesson.id ? 'text-blue-700' : 'text-gray-700'}`}>
                          {lesson.title}
                        </span>
                      </div>
                      {isTeacher && (
                        <button onClick={(e) => { e.stopPropagation(); /* delete hívás */ }} className="text-gray-400 hover:text-red-500">
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