import { useNavigate } from 'react-router-dom';
import { Clock, Users } from 'lucide-react';

export default function CourseCard({
  id,
  title,
  instructor,
  progress,
  students,
  color,
  imageUrl,
}) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/course/${id}`)}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* Course Image */}
      <div className={`h-40 ${color} relative`}>
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover opacity-90"
        />
      </div>

      {/* Course Content */}
      <div className="p-5">
        <h3 className="text-lg text-gray-900 mb-2 line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{instructor}</p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Course Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>12 lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{students} students</span>
          </div>
        </div>
      </div>
    </div>
  );
}
