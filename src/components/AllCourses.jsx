import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import Sidebar from './Sidebar';
import CourseCard from './CourseCard';
import { useAuth } from '../context/AuthContext';

export default function AllCourses() {
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    const handleCardClick = () => {
      if (currentUser?.dbData?.role === 'guest') {
        alert("A kurzus megtekintéséhez kérjük, jelentkezz be!");
        navigate('/login');
        return;
      }
      navigate(`/course/${id}`);
    };

    const fetchAllCourses = async () => {
      setIsLoading(true);

      // 1. KURZUSOK LEKÉRÉSE
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


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">
          {/* kis szöveg*/}
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Összes elérhető kurzus
            </h1>
            <p className="text-gray-600 mt-1">
                Válogass kedvedre és iratkozz fel új tananyagokra!
            </p>
          </header>

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