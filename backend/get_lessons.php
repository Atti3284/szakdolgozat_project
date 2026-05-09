<?php
// CORS fejlécek – engedélyezik a React frontend elérését
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Adatbázis kapcsolat létrehozása
$conn = new PDO("mysql:host=localhost;dbname=edulearn_db", "root", "");

// URL paraméterek beolvasása: kurzus azonosító és felhasználói UID
$course_id = $_GET['id'] ?? '';
$uid = $_GET['uid'] ?? ''; // UID nélkül nem tudnánk megjeleníteni a befejezettségi pipákat

// LECKÉK LEKÉRÉSE HALADÁSSAL EGYÜTT
// LEFT JOIN a user_progress táblával: ha van egyezés az adott UID-ra, a lecke befejezettnek számít
$sql = "SELECT l.*, 
        CASE WHEN up.id IS NOT NULL THEN 1 ELSE 0 END as completed
        FROM lessons l
        LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_uid = ?
        WHERE l.course_id = ?";

$stmt = $conn->prepare($sql);
$stmt->execute([$uid, $course_id]);

// Eredmény visszaküldése JSON formátumban a React frontendnek
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>
