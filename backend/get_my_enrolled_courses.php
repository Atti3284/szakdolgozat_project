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

// FELIRATKOZOTT KURZUSOK LEKÉRÉSE haladási adatokkal
// Alszintű lekérdezések számítják az összes és befejezett leckék számát az adott felhasználóra
$sql = "SELECT c.*, 
        (SELECT COUNT(*) FROM lessons WHERE course_id = c.id) as total_lessons,
        (SELECT COUNT(*) FROM user_progress up 
         JOIN lessons l ON up.lesson_id = l.id 
         WHERE l.course_id = c.id AND up.user_uid = ?) as completed_lessons,
        (SELECT COUNT(*) FROM enrollments WHERE course_id = c.id) as real_student_count
        FROM courses c
        JOIN enrollments e ON c.id = e.course_id
        WHERE e.user_uid = ? 
        GROUP BY c.id";

$stmt = $conn->prepare($sql);
$stmt->execute([$uid, $uid]);
$courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

// EREDMÉNY FORMÁZÁSA – haladás kiszámítása és strukturált válasz összeállítása
$result = [];
foreach ($courses as $course) {
    $total = (int)$course['total_lessons'];
    $completed = (int)$course['completed_lessons'];
    $result[] = [
        "id" => $course['id'],
        "title" => $course['title'],
        "instructor" => $course['instructor'],
        "imageUrl" => $course['imageUrl'],
        // Haladás százalék: 0 ha nincs lecke, különben kerekített arány
        "progress" => $total > 0 ? round(($completed / $total) * 100) : 0,
        "totalLessons" => $total,
        "isEnrolled" => true, // Ez az endpoint csak feliratkozott kurzusokat ad vissza
        "students" => (int)$course['real_student_count'] // Valós feliratkozottak száma
    ];
}
echo json_encode($result);
