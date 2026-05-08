<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Ne jelenítsen meg hibákat a kimenetben, mert elrontja a JSON-t
error_reporting(0); 

$conn = new PDO("mysql:host=localhost;dbname=edulearn_db", "root", "");

$user_uid = $_GET['uid'] ?? '';

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

$result = [];

foreach ($courses as $course) {
    $total = (int)$course['total_lessons'];
    $completed = (int)$course['completed_lessons'];
    
    if ($total > 0) {
        $progress = round(($completed / $total) * 100);
    } else {
        $progress = null; 
    }

    $result[] = [
        "id" => $course['id'],
        "title" => $course['title'],
        "instructor" => $course['instructor'],
        // A ?? operátor megoldja a Warning-ot: ha nincs 'image' kulcs, null lesz
        "imageUrl" => $course['imageUrl'] ?? null, 
        "progress" => $progress,
        "totalLessons" => $total,

	"isEnrolled" => $course['is_enrolled'] > 0,
        // Ha van students oszlopod, azt is kezeld így:
        "students" => (int)$course['real_student_count']
    ];
}

echo json_encode($result);
?>