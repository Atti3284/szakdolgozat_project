<?php
// CORS fejlécek – engedélyezik a React frontend elérését
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Adatbázis kapcsolat létrehozása
$conn = new PDO("mysql:host=localhost;dbname=edulearn_db", "root", "");

// Tanár UID lekérése az URL paraméterből
$uid = $_GET['uid'] ?? '';

// TANÁR SAJÁT KURZUSAINAK LEKÉRÉSE – leckék és diákok számával együtt
// Alszintű lekérdezések számítják a leckék és feliratkozottak számát
$sql = "SELECT c.*, 
        (SELECT COUNT(*) FROM lessons WHERE course_id = c.id) as total_lessons,
        (SELECT COUNT(*) FROM enrollments WHERE course_id = c.id) as students
        FROM courses c 
        WHERE c.instructor_uid = ?";

$stmt = $conn->prepare($sql);
$stmt->execute([$uid]);

// Eredmény visszaküldése JSON formátumban
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
