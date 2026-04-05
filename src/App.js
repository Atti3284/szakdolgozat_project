import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Dashboard from './components/Dashboard'; // Kiszervezzük a főoldalt
import CoursePage from './components/CoursePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/course/:courseId" element={<CoursePage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;