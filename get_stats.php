<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$user_uid = $_GET['uid'] ?? '';

if (empty($user_uid)) {
    echo json_encode(["totalCourses" => 0, "completedLessons" => 0, "averageProgress" => 0]);
    exit;
}

try {
    $conn = new PDO("mysql:host=localhost;dbname=edulearn_db", "root", "");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 1. Felhasználó saját kurzusainak száma
    $stmt1 = $conn->prepare("SELECT COUNT(*) as total FROM enrollments WHERE user_uid = ?");
    $stmt1->execute([$user_uid]);
    $totalMyCourses = $stmt1->fetch(PDO::FETCH_ASSOC)['total'];

    // 2. Felhasználó saját befejezett leckéinek száma (az új user_progress táblából)
    $stmt2 = $conn->prepare("SELECT COUNT(*) as completed FROM user_progress WHERE user_uid = ?");
    $stmt2->execute([$user_uid]);
    $completedLessons = $stmt2->fetch(PDO::FETCH_ASSOC)['completed'];

    // 3. Átlagos haladás kiszámítása (opcionális, de így pontosabb)
    // Megszámoljuk az összes leckét a kurzusain, és megnézzük a kész leckék arányát
    $stmt3 = $conn->prepare("
        SELECT COUNT(l.id) as total_needed 
        FROM lessons l
        JOIN enrollments e ON l.course_id = e.course_id
        WHERE e.user_uid = ?
    ");
    $stmt3->execute([$user_uid]);
    $totalLessonsNeeded = $stmt3->fetch(PDO::FETCH_ASSOC)['total_needed'];
    
    $averageProgress = 0;
    if ($totalLessonsNeeded > 0) {
        $averageProgress = round(($completedLessons / $totalLessonsNeeded) * 100);
    }

    echo json_encode([
        "totalCourses" => (int)$totalMyCourses,
        "completedLessons" => (int)$completedLessons,
        "averageProgress" => (int)$averageProgress
    ]);

} catch(PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>