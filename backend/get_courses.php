<?php
// CORS fejlécek – engedélyezik a React frontend elérését
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Hibaüzenetek elrejtése a JSON kimenetből (elkerüli a JSON parse hibát)
error_reporting(0);

// Adatbázis kapcsolat létrehozása
$conn = new PDO("mysql:host=localhost;dbname=edulearn_db", "root", "");

// Felhasználói UID lekérése – a feliratkozás állapotának ellenőrzéséhez szükséges
$user_uid = $_GET['uid'] ?? '';

// ÖSSZES KURZUS LEKÉRÉSE – feliratkozási állapottal és statisztikákkal együtt
// is_enrolled: 1 ha a felhasználó feliratkozott, 0 ha nem
// real_student_count: valós feliratkozottak száma (nem a tárolts)
$sql = "SELECT 
            c.*, 
            COUNT(DISTINCT l.id) as total_lessons,
            SUM(CASE WHEN l.completed = 1 THEN 1 ELSE 0 END) as completed_lessons,
            (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id AND e.user_uid = ?) as is_enrolled,
            (SELECT COUNT(*) FROM enrollments e2 WHERE e2.course_id = c.id) as real_student_count
        FROM courses c
        LEFT JOIN lessons l ON c.id = l.course_id
        GROUP BY c.id";

$stmt = $conn->prepare($sql);
$stmt->execute([$user_uid]);
$courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

// EREDMÉNY FORMÁZÁSA – haladás százalék kiszámítása és strukturált válasz összeállítása
$result = [];

foreach ($courses as $course) {
    $total = (int)$course['total_lessons'];
    $completed = (int)$course['completed_lessons'];

    // Ha nincs lecke a kurzusban, a haladás null (nem 0%), hogy a kártya kezelni tudja
    if ($total > 0) {
        $progress = round(($completed / $total) * 100);
    } else {
        $progress = null;
    }

    $result[] = [
        "id" => $course['id'],
        "title" => $course['title'],
        "instructor" => $course['instructor'],
        // ?? operátor megakadályozza a Warning-ot, ha az imageUrl kulcs hiányzik
        "imageUrl" => $course['imageUrl'] ?? null,
        "progress" => $progress,
        "totalLessons" => $total,
        // is_enrolled értéke 0 vagy 1 – bool-lá alakítjuk a React számára
        "isEnrolled" => $course['is_enrolled'] > 0,
        "students" => (int)$course['real_student_count']
    ];
}

echo json_encode($result);
?>
