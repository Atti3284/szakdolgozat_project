import React from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';

import Dashboard from './components/Dashboard'; // Kiszervezzük a főoldalt
import CoursePage from './components/CoursePage';
import Calendar from './components/Calendar';
import Messages from './components/Messages';
import Assignments from './components/Assignments';
import MyCourses from './components/MyCourses';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="Dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/course/:courseId" element={<CoursePage />} />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;