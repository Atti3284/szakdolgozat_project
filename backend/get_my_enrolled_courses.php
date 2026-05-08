<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$conn = new PDO("mysql:host=localhost;dbname=edulearn_db", "root", "");
$uid = $_GET['uid'] ?? '';

if (empty($uid)) { echo json_encode([]); exit; }

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

$result = [];
foreach ($courses as $course) {
    $total = (int)$course['total_lessons'];
    $completed = (int)$course['completed_lessons'];
    $result[] = [
        "id" => $course['id'],
        "title" => $course['title'],
        "instructor" => $course['instructor'],
        "imageUrl" => $course['imageUrl'],
        "progress" => $total > 0 ? round(($completed / $total) * 100) : 0,
        "totalLessons" => $total,
        "isEnrolled" => true,
        "students" => (int)$course['real_student_count'] // Itt is a valós számot adjuk át
    ];
}
echo json_encode($result);