import React, { useState } from 'react';
import { BookOpen, Bell, User, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Hiba a kijelentkezéskor:", error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl text-gray-900">EduLearn</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-gray-700 hover:text-blue-600 transition-colors">
              Dashboard
            </button>
            <button 
              onClick={() => navigate('/my-courses')}
              className="text-gray-700 hover:text-blue-600 transition-colors">
              My Courses
            </button>
            <button 
              onClick={() => navigate('/calendar')}
              className="text-gray-700 hover:text-blue-600 transition-colors">
              Calendar
            </button>
          </div>

          {/* Profile és Dropdown */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Bell className="w-5 h-5" />
            </button>
            
            <div
              className="flex items-center gap-3 pl-4 border-l cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setIsProfileOpen(!isProfileOpen)}>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 leading-tight">
                  {/* 1. Ha van teljes név, azt írjuk ki. 
                      2. Ha nincs, vesszük az emailt, és levágjuk a @ utáni részt. 
                      3. Ha semmi nincs, akkor marad a 'Tanuló' */}
                  {currentUser?.dbData?.full_name || 
                  (currentUser?.email ? currentUser.email.split('@')[0] : 'Tanuló')}
                </p>
                
                <p className="text-xs text-gray-500 capitalize">
                  {/* Ha a role 'student' vagy nincs megadva, írjuk ki hogy 'Diák' 
                      Ha 'teacher', akkor 'Tanár' */}
                  {currentUser?.dbData?.role === 'student' || !currentUser?.dbData?.role 
                    ? 'Diák' 
                    : (currentUser?.dbData?.role === 'teacher' ? 'Tanár' : currentUser.dbData.role)}
                </p>
              </div>

              {/* Profilkép vagy Monogram */}
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border border-gray-200 overflow-hidden">
                {currentUser?.dbData?.avatar_url ? (
                  <img src={currentUser.dbData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-blue-600 font-bold">
                    {/* Elsőnek a full_name első betűje, ha nincs, akkor az email első betűje */}
                    {(currentUser?.dbData?.full_name || currentUser?.email || 'T').charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* --- DROP DOWN ABLAK --- */}
            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-1">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs text-gray-400 font-semibold uppercase">Fiók</p>
                </div>
                
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <User className="w-4 h-4" /> Profilom
                </button>
                
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <Settings className="w-4 h-4" /> Beállítások
                </button>

                <div className="border-t border-gray-100 mt-2 pt-2">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Kijelentkezés
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>


      {isProfileOpen && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => setIsProfileOpen(false)}>
        </div>
      )}
    </nav>
  );
}