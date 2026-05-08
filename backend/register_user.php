<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

$conn = new PDO("mysql:host=localhost;dbname=edulearn_db", "root", "");

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email) && !empty($data->uid)) {
    $stmt = $conn->prepare("INSERT INTO users (firebase_uid, email, full_name, role) VALUES (?, ?, ?, 'student')");
    
    $full_name = $data->full_name ?? explode('@', $data->email)[0];

    try {
        $stmt->execute([$data->uid, $data->email, $full_name]);
        echo json_encode(["status" => "success", "message" => "Felhasználó mentve"]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}
?>