<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
$conn = new PDO("mysql:host=localhost;dbname=edulearn_db", "root", "");

$uid = $_GET['uid'] ?? '';

$sql = "SELECT c.*, 
        (SELECT COUNT(*) FROM lessons WHERE course_id = c.id) as total_lessons,
        (SELECT COUNT(*) FROM enrollments WHERE course_id = c.id) as students
        FROM courses c 
        WHERE c.instructor_uid = ?";

$stmt = $conn->prepare($sql);
$stmt->execute([$uid]);
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));