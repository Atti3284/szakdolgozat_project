import { FileText, MessageSquare, Search } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();
  // Az aktuális URL elérési út – az aktív menüpont kiemeléséhez szükséges
  const location = useLocation();

  // Oldalsáv menüpontok: ikon, megjelenítési szöveg és célútvonal
  const menuItems = [
    { icon: Search, label: 'All Courses', path: '/all-courses' },
    { icon: FileText, label: 'Assignments', path: '/assignments' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)]">
      <nav className="p-4 space-y-2">
        {/* Menüpontok dinamikus renderelése – aktív elem kék kiemelést kap */}
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          // Az aktív állapotot az aktuális URL és az elem elérési útja alapján döntjük el
          const isActive = location.pathname === item.path;

          return (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'   // Aktív állapot: kék háttér és szín
                  : 'text-gray-700 hover:bg-gray-50' // Inaktív állapot: szürke hover effekt
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
