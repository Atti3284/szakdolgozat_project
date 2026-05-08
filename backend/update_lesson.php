<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$conn = new PDO("mysql:host=localhost;dbname=edulearn_db", "root", "");

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['lessonId']) && isset($data['completed']) && isset($data['uid']) && isset($data['courseId'])) {
    
    $lessonId = $data['lessonId'];
    $isCompleted = $data['completed']; // true vagy false
    $uid = $data['uid'];
    $courseId = $data['courseId'];

    if ($isCompleted) {
        // 1. HA KÉSZ: Beszúrjuk az új táblába (ha már ott van, az IGNORE miatt nem csinál semmit)
        $stmt = $conn->prepare("INSERT IGNORE INTO user_progress (user_uid, lesson_id) VALUES (?, ?)");
        $result = $stmt->execute([$uid, $lessonId]);
    } else {
        // 2. HA KIVESSZÜK A PIPÁT: Töröljük a táblából
        $stmt = $conn->prepare("DELETE FROM user_progress WHERE user_uid = ? AND lesson_id = ?");
        $result = $stmt->execute([$uid, $lessonId]);
    }

    if ($result) {
        // 3. Aktivítás frissítése (Dashboard sorrendhez)
        $updateActivity = $conn->prepare("UPDATE enrollments SET last_activity = CURRENT_TIMESTAMP WHERE user_uid = ? AND course_id = ?");
        $updateActivity->execute([$uid, $courseId]);

        echo json_encode(["status" => "success", "message" => "Personal progress updated"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Update failed"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Missing data"]);
}
?>