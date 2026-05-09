<?php
// CORS fejlécek – engedélyezik a React frontend elérését
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Adatbázis kapcsolat létrehozása, hibakezelési mód beállítása
$conn = new PDO("mysql:host=localhost;dbname=edulearn_db", "root", "");
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// URL paraméterek beolvasása: kurzus azonosító és felhasználói UID
$course_id = $_GET['course_id'] ?? '';
$uid = $_GET['uid'] ?? '';

// Ha nincs kurzus azonosító megadva, hibaüzenettel leállítjuk
if (empty($course_id)) {
    echo json_encode(["status" => "error", "message" => "Hiányzó kurzus ID"]);
    exit;
}

try {
    // 1. KURZUS ADATAINAK LEKÉRÉSE – alap információk a courses táblából
    $stmtCourse = $conn->prepare("SELECT * FROM courses WHERE id = ?");
    $stmtCourse->execute([$course_id]);
    $course = $stmtCourse->fetch(PDO::FETCH_ASSOC);

    // Ha a kurzus nem található az adatbázisban
    if (!$course) {
        echo json_encode(["status" => "error", "message" => "A kurzus nem található"]);
        exit;
    }

    // 2. LECKÉK ÉS HALADÁS LEKÉRÉSE
    // LEFT JOIN a user_progress táblával: ha van egyezés, a lecke befejezettnek számít
    $sqlLessons = "SELECT l.*, 
                   CASE WHEN up.id IS NOT NULL THEN 1 ELSE 0 END as completed
                   FROM lessons l
                   LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_uid = ?
                   WHERE l.course_id = ?";

    $stmtLessons = $conn->prepare($sqlLessons);
    $stmtLessons->execute([$uid, $course_id]);
    $lessons = $stmtLessons->fetchAll(PDO::FETCH_ASSOC);

    // 3. ÖSSZESÍTETT VÁLASZ ELKÜLDÉSE A REACT FRONTENDNEK
    echo json_encode([
        "status" => "success",
        "course" => $course,
        "lessons" => $lessons
    ]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Adatbázis hiba: " . $e->getMessage()]);
}
?>
