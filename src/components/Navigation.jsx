import { BookOpen, Bell, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
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
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Dashboard
            </button>
            <button className="text-gray-700 hover:text-blue-600 transition-colors">
              My Courses
            </button>
            <button className="text-gray-700 hover:text-blue-600 transition-colors">
              Calendar
            </button>
          </div>

          {/* Profile Name and PFP - DINAMIKUS ADATOKKAL */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Bell className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l">
              <div className="text-right hidden sm:block">
                {/* A dbData-ból kérjük le a valódi nevet és szerepkört */}
                <p className="text-sm font-bold text-gray-900 leading-tight">
                  {currentUser?.dbData?.full_name || currentUser?.email || 'Vendég'}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {currentUser?.dbData?.role || 'Guest'}
                </p>
              </div>

              {/* Profilkép vagy Monogram */}
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border border-gray-200 overflow-hidden">
                {currentUser?.dbData?.avatar_url ? (
                  <img 
                    src={currentUser.dbData.avatar_url} 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <span className="text-blue-600 font-bold">
                    {(currentUser?.dbData?.full_name || 'V').charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}