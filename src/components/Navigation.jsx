import { BookOpen, Bell, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navigation() {
  const navigate = useNavigate();

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

          {/* Right side icons */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <div className="text-sm text-gray-900">John Doe</div>
                <div className="text-xs text-gray-500">Student</div>
              </div>
              <button className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300 transition-colors">
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}