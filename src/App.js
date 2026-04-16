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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* ALAPÉRTELMEZETT ÚTVONAL: Ha be van lépve -> Dashboard, ha nincs -> Login */}
      <Route path="/" element={
        currentUser ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
      } />
      
      {/* PUBLIKUS ÚTVONALAK */}
      <Route path="/login" element={
        !currentUser ? <Login /> : <Navigate to="/dashboard" />
      } />
      <Route path="/register" element={
        !currentUser ? <Register /> : <Navigate to="/dashboard" />
      } />
      
      {/* VÉDETT ÚTVONALAK: Ha nincs currentUser, visszadob a Loginra */}
      <Route path="/dashboard" element={
        currentUser ? <Dashboard /> : <Navigate to="/login" />
      } />
      
      <Route path="/all-courses" element={
        currentUser ? <AllCourses /> : <Navigate to="/login" />
      } />

      <Route path="/my-courses" element={
        currentUser ? <MyCourses /> : <Navigate to="/login" />
      } />

      <Route path="/course/:courseId" element={
        currentUser ? <CoursePage /> : <Navigate to="/login" />
      } />

      <Route path="/assignments" element={
        currentUser ? <Assignments /> : <Navigate to="/login" />
      } />

      <Route path="/messages" element={
        currentUser ? <Messages /> : <Navigate to="/login" />
      } />

      <Route path="/calendar" element={
        currentUser ? <Calendar /> : <Navigate to="/login" />
      } />

      {/* 404 - Ha olyan oldalra megy, ami nem létezik */}
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