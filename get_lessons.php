<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$conn = new PDO("mysql:host=localhost;dbname=edulearn_db", "root", "");

$course_id = $_GET['id'] ?? '';
$uid = $_GET['uid'] ?? ''; // Szükségünk van az UID-ra a pipákhoz!

// Összekötjük a leckéket a progress táblával: 
// Ha van egyezés, a completed 1 lesz, ha nincs, akkor 0.
$sql = "SELECT l.*, 
        CASE WHEN up.id IS NOT NULL THEN 1 ELSE 0 END as completed
        FROM lessons l
        LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_uid = ?
        WHERE l.course_id = ?";

$stmt = $conn->prepare($sql);
$stmt->execute([$uid, $course_id]);

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>