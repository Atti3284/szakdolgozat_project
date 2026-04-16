import React from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';

import Dashboard from './components/Dashboard'; // Kiszervezzük a főoldalt
import CoursePage from './components/CoursePage';
import Calendar from './components/Calendar';
import Messages from './components/Messages';
import Assignments from './components/Assignments';
import MyCourses from './components/MyCourses';
import AllCourses from './components/AllCourses';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="Dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/course/:courseId" element={<CoursePage />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/all-courses" element={<AllCourses />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;