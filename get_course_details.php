<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Adatbázis kapcsolat
$conn = new PDO("mysql:host=localhost;dbname=edulearn_db", "root", "");
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$course_id = $_GET['course_id'] ?? '';
$uid = $_GET['uid'] ?? '';

if (empty($course_id)) {
    echo json_encode(["status" => "error", "message" => "Hiányzó kurzus ID"]);
    exit;
}

try {
    // 1. KURZUS ADATAINAK LEKÉRÉSE
    $stmtCourse = $conn->prepare("SELECT * FROM courses WHERE id = ?");
    $stmtCourse->execute([$course_id]);
    $course = $stmtCourse->fetch(PDO::FETCH_ASSOC);

    if (!$course) {
        echo json_encode(["status" => "error", "message" => "A kurzus nem található"]);
        exit;
    }

    // 2. LECKÉK ÉS HALADÁS LEKÉRÉSE
    // Megnézzük a leckéket, és összekötjük a user_progress táblával az adott UID alapján
    $sqlLessons = "SELECT l.*, 
                   CASE WHEN up.id IS NOT NULL THEN 1 ELSE 0 END as completed
                   FROM lessons l
                   LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_uid = ?
                   WHERE l.course_id = ?";
                   
    $stmtLessons = $conn->prepare($sqlLessons);
    $stmtLessons->execute([$uid, $course_id]);
    $lessons = $stmtLessons->fetchAll(PDO::FETCH_ASSOC);

    // 3. VÁLASZ ELKÜLDÉSE A REACT-NEK
    echo json_encode([
        "status" => "success",
        "course" => $course,
        "lessons" => $lessons
    ]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Adatbázis hiba: " . $e->getMessage()]);
}
?>