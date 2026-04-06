import { useNavigate } from 'react-router-dom';
import { Clock, Users } from 'lucide-react';

export default function CourseCard({
  id,
  title,
  instructor,
  progress, // Ez most már a PHP-tól jövő számolt érték (vagy null)
  students,
  color,
  imageUrl,
  totalLessons // Ezt is átadjuk a PHP-ból
}) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/course/${id}`)}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* Kurzus Kép */}
      <div className={`h-40 ${color || 'bg-blue-600'} relative`}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover opacity-90"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white opacity-20 text-4xl font-bold">
            {title.charAt(0)}
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className="p-5">
        <h3 className="text-lg text-gray-900 mb-2 line-clamp-2 font-semibold">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{instructor}</p>

        {/* Dinamikus Haladás vagy Üres állapot */}
        <div className="mb-4">
          {progress !== null ? (
            <>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span className="font-bold text-blue-600">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          ) : (
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg py-2 px-3">
              <p className="text-xs text-gray-400 text-center italic">
                Nincs még tananyag feltöltve
              </p>
            </div>
          )}
        </div>

        {/* Course Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{totalLessons || 0} lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{students || 0} students</span>
          </div>
        </div>
      </div>
    </div>
  );
}