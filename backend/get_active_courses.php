<?php
// CORS fejlécek – engedélyezik a React frontend elérését
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Adatbázis kapcsolat létrehozása
$conn = new PDO("mysql:host=localhost;dbname=edulearn_db", "root", "");

// Felhasználói UID lekérése az URL paraméterből
$uid = $_GET['uid'] ?? '';

// Ha nincs UID megadva, üres tömbbel visszatérünk
if (empty($uid)) { echo json_encode([]); exit; }

// AKTÍV KURZUSOK LEKÉRDEZÉSE – a felhasználó által legutóbb használt 3 kurzus
// Alszintű lekérdezések számítják az összes és a befejezett leckék számát
$sql = "SELECT c.*, 
        (SELECT COUNT(*) FROM lessons WHERE course_id = c.id) as total_lessons,
        (SELECT COUNT(*) FROM user_progress up 
         JOIN lessons l ON up.lesson_id = l.id 
         WHERE l.course_id = c.id AND up.user_uid = ?) as completed_lessons,
        (SELECT COUNT(*) FROM enrollments WHERE course_id = c.id) as real_student_count,
        1 as is_enrolled
        FROM courses c
        JOIN enrollments e ON c.id = e.course_id
        WHERE e.user_uid = ? 
        ORDER BY e.last_activity DESC
        LIMIT 3";

$stmt = $conn->prepare($sql);
$stmt->execute([$uid, $uid]);
$courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

// EREDMÉNY FORMÁZÁSA – haladás százalék kiszámítása és strukturált válasz összeállítása
$result = [];
foreach ($courses as $course) {
    $total = (int)$course['total_lessons'];
    $completed = (int)$course['completed_lessons'];
    $result[] = [
        "id" => $course['id'],
        "title" => $course['title'],
        "instructor" => $course['instructor'],
        "imageUrl" => $course['imageUrl'],
        // Haladás százalék: befejezett / összes * 100 (0 ha nincs lecke)
        "progress" => $total > 0 ? round(($completed / $total) * 100) : 0,
        "totalLessons" => $total,
        "isEnrolled" => true,
        "students" => (int)$course['real_student_count'] // Valós feliratkozott diákok száma
    ];
}
echo json_encode($result);
