<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

$conn = new PDO("mysql:host=localhost;dbname=edulearn_db", "root", "");

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->user_uid) && !empty($data->course_id)) {
    // Ellenőrizzük, hogy nem iratkozott-e már fel
    $check = $conn->prepare("SELECT id FROM enrollments WHERE user_uid = ? AND course_id = ?");
    $check->execute([$data->user_uid, $data->course_id]);
    
    if ($check->rowCount() > 0) {
        echo json_encode(["status" => "error", "message" => "Már feliratkoztál erre a kurzusra!"]);
        exit;
    }

    // Mentés
    $stmt = $conn->prepare("INSERT INTO enrollments (user_uid, course_id) VALUES (?, ?)");
    
    try {
        $stmt->execute([$data->user_uid, $data->course_id]);
        echo json_encode(["status" => "success", "message" => "Sikeres feliratkozás!"]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}
?>