import React from 'react';
import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext';

// Komponensek importálása
import Dashboard from './components/Dashboard';
import CoursePage from './components/CoursePage';
import Calendar from './components/Calendar';
import Messages from './components/Messages';
import Assignments from './components/Assignments';
import MyCourses from './components/MyCourses';
import AllCourses from './components/AllCourses';
import Login from './components/Login';
import Register from './components/Register';
import CreateCourse from './components/CreateCourse';

// Az útvonalakat kezelő belső komponens (azért van külön, hogy hozzáférjen az AuthContext-hez)
function AppRoutes() {
  const { currentUser, loading } = useAuth();

  // Segédváltozók a jogosultságok egyszerűbb kezeléséhez
  const isGuest = currentUser?.dbData?.role === 'guest';
  const isLoggedIn = !!currentUser; // true, ha van bármilyen user (vendég is)
  const isRealUser = isLoggedIn && !isGuest; // true, ha regisztrált user

  // Betöltés közben egy pörgő animációt mutatunk
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* ALAPÉRTELMEZETT ÚTVONAL: szerepkör alapján irányít tovább */}
      <Route path="/" element={
        isRealUser ? (
          currentUser?.dbData?.role === 'teacher' ? <Navigate to="/my-courses" /> : <Navigate to="/dashboard" />
        ) : (
          isGuest ? <Navigate to="/all-courses" /> : <Navigate to="/login" />
        )
      } />
      
      {/* PUBLIKUS ÚTVONALAK: csak bejelentkezés előtt elérhetők */}
      <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/" /> } />
      <Route path="/register" element={!isLoggedIn ? <Register /> : <Navigate to="/" /> } />
      
      {/* VENDÉGEKNEK IS ELÉRHETŐ: bejelentkezés szükséges, de vendég is megtekintheti */}
      <Route path="/all-courses" element={isLoggedIn ? <AllCourses /> : <Navigate to="/login" /> } />

      {/* CSAK REGISZTRÁLT FELHASZNÁLÓKNAK: vendégtől és kijelentkezve is védett */}
      <Route path="/dashboard" element={isRealUser ? <Dashboard /> : <Navigate to="/login" /> } />
      <Route path="/my-courses" element={isRealUser ? <MyCourses /> : <Navigate to="/login" /> } />
      <Route path="/course/:courseId" element={isRealUser ? <CoursePage /> : <Navigate to="/login" /> } />
      <Route path="/assignments" element={isRealUser ? <Assignments /> : <Navigate to="/login" /> } />
      <Route path="/messages" element={isRealUser ? <Messages /> : <Navigate to="/login" /> } />
      <Route path="/calendar" element={isRealUser ? <Calendar /> : <Navigate to="/login" /> } />

      {/* CSAK TANÁROKNAK: szerepkörellenőrzés szükséges */}
      <Route path="/create-course" element={isRealUser && currentUser?.dbData?.role === 'teacher' ? <CreateCourse /> : <Navigate to="/" /> } />

      {/* 404 – ismeretlen útvonal esetén visszairányít a főoldalra */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

// A fő App komponens, ami körbeöleli az egészet az AuthProvider-rel
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
