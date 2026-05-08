<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

$conn = new PDO("mysql:host=localhost;dbname=edulearn_db", "root", "");
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->title) && !empty($data->instructor_uid)) {
    $stmt = $conn->prepare("INSERT INTO courses (title, instructor, instructor_uid, color, imageUrl, students) VALUES (?, ?, ?, ?, ?, 0)");
    
    try {
        $stmt->execute([
            $data->title, 
            $data->instructor, 
            $data->instructor_uid, 
            $data->color ?? 'bg-blue-600', 
            $data->imageUrl ?? null
        ]);
        
        echo json_encode([
            "status" => "success", 
            "message" => "Kurzus sikeresen létrehozva!", 
            "id" => $conn->lastInsertId()
        ]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Hiányzó adatok (cím vagy azonosító)!"]);
}
?>