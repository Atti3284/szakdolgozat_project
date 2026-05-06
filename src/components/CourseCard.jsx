import { useNavigate } from 'react-router-dom';
import { Clock, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CourseCard({
  id, title, instructor, instructor_uid, progress, students, color, imageUrl, totalLessons, isEnrolled,
  showProgress = true
}) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  //Vendégellenőrző segédfüggvény
  const checkGuest = () => {
    if (currentUser?.dbData?.role === 'guest'){
      alert("Ez a funkció nem elérhető. Kérjük, jelentkezzen be!");
      navigate('/login');
      return true;
    }
    return false;
  };

  const handleEnroll = async (e) => {
    e.stopPropagation(); // Megakadályozza, hogy a kártyára való kattintás is lefusson
    if (checkGuest()) return;

    console.log("Jelentkezés folyamatban...", currentUser.uid);

    try {
      const response = await fetch('http://localhost/edulearn_api/enroll_course.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_uid: currentUser.uid,
          course_id: id
        })
      });
      
      const result = await response.json();
      if(result.status === 'success') {
        alert("Sikeresen feliratkoztál!");
        window.location.reload(); 
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Hiba a feliratkozásnál:", error);
    }
  };

  return (
    <div
      onClick={() => {
        if (!checkGuest()) navigate(`/course/${id}`);
      }}
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

        <p className="text-sm text-gray-600 mb-4">
           {currentUser?.uid === instructor_uid ? "Saját kurzusod" : instructor}
        </p>

        {/* --- INTERAKTÍV RÉSZ KEZDETE --- */}
        <div className="mb-4 min-h-[50px] flex flex-col justify-center">
          {currentUser?.dbData?.role === 'teacher' ? (
            <button className="w-full bg-gray-100 text-gray-600 py-2 px-4 rounded-lg font-semibold border border-gray-200 cursor-default">
              Oktatói nézet
            </button>
          ) : isEnrolled ? (
            showProgress ? (
              /* HA FEL VAN IRATKOZVA ÉS MUTATJUK A PROGRESSET (Dashboard, My Courses) */
              progress !== null ? (
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
                <p className="text-xs text-gray-400 italic text-center">Nincs még tananyag</p>
              )
            ) : (
              /* HA NINCS FELIRATKOZVA, DE NEM MUATJUK A PROGRESSET (All Courses) */
              <button disabled className="w-full dg-green-50 text-green-700 py-2 px-4 rounded-lg font-semibold border border-green-200 cursor-default">
                ✓ Már feliratkozva
              </button>
            )
          ) : (
            /* HA NINCS FELIRATKOZVA: Feliratkozás gomb */
            <button
              onClick={handleEnroll}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
              Feliratkozás
            </button>
          )}
        </div>
        {/* --- INTERAKTÍV RÉSZ VÉGE --- */}

        {/* Course Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-600 border-t pt-4">
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