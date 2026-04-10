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

          {/* Profile Name and PFP */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">{currentUser?.full_name || 'Vendég'}</p>
              <p className="text-xs text-gray-500 capitalize">{currentUser?.role || 'Guest'}</p>
            </div>
            <img 
              src={currentUser?.avatar || 'default_avatar_url'} 
              className="w-10 h-10 rounded-full border border-gray-200"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}