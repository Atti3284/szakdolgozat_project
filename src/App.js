import React from 'react';
import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext';

// Komponensek importálása
import Dashboard from './components/Dashboard'; // Kiszervezzük a főoldalt
import CoursePage from './components/CoursePage';
import Calendar from './components/Calendar';
import Messages from './components/Messages';
import Assignments from './components/Assignments';
import MyCourses from './components/MyCourses';
import AllCourses from './components/AllCourses';
import Login from './components/Login';
import Register from './components/Register';

function AppRoutes() {
  const { currentUser, loading } = useAuth();

  //Segédváltozó a jogusultságok egyszerűbb kezeléséhez
  const isGuest = currentUser?.dbData?.role === 'guest';
  const isLoggedIn = !!currentUser; // true, ha van bármilyen user (vendég is)
  const isRealUser = isLoggedIn && !isGuest; // true, ha regisztrált user

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* ALAPÉRTELMEZETT ÚTVONAL */}
      <Route path="/" element={
        isRealUser ? <Navigate to="/dashboard" /> : (isGuest ? <Navigate to="/all-courses" /> : <Navigate to="/login" />)
      } />
      
      {/* PUBLIKUS ÚTVONALAK */}
      <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/" /> } />
      <Route path="/register" element={!isLoggedIn ? <Register /> : <Navigate to="/" /> } />
      
      {/* VENDÉGEKNEK IS ELÉRHETŐ */}
      <Route path="/all-courses" element={isLoggedIn ? <AllCourses /> : <Navigate to="/login" /> } />

      {/* CSAK REGISZTRÁLT FELHASZNÁLÓKNAK (Védett a vendégektől is) */}
      <Route path="/dashboard" element={isRealUser ? <Dashboard /> : <Navigate to="/login" /> } />
      <Route path="/my-courses" element={isRealUser ? <MyCourses /> : <Navigate to="/login" /> } />
      <Route path="/course/:courseId" element={isRealUser ? <CoursePage /> : <Navigate to="/login" /> } />
      <Route path="/assignments" element={isRealUser ? <Assignments /> : <Navigate to="/login" /> } />
      <Route path="/messages" element={isRealUser ? <Messages /> : <Navigate to="/login" /> } />
      <Route path="/calendar" element={isRealUser ? <Calendar /> : <Navigate to="/login" /> } />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

// A fő App komponens, ami körbeöleli az egészet a Provider-rel
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;