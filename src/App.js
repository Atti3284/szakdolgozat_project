import React from 'react';
import CourseCard from './components/CourseCard'; // Importáljuk a kártyát
import { BrowserRouter } from 'react-router-dom'; // Ez kell a navigációhoz

function App() {
  // Példa adatok, amiket később a PHP backend fog adni
  const courses = [
    {
      id: "1",
      title: "Introduction to Web Development",
      instructor: "Dr. Kovács János",
      progress: 75,
      students: 120,
      color: "bg-blue-500",
      imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "2",
      title: "Data Structures and Algorithms",
      instructor: "Szabó Anna",
      progress: 30,
      students: 85,
      color: "bg-purple-500",
      imageUrl: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=400&q=80"
    }
  ];

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-50">
        {/* ... (Sidebar marad a régi) ... */}
        
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">My Courses</h1>
          
          {/* Itt hívjuk meg a kártyákat egy rácsban */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;