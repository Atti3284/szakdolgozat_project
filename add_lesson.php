<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$conn = new PDO("mysql:host=localhost;dbname=edulearn_db", "root", "");
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->course_id) && !empty($data->title)) {
    $stmt = $conn->prepare("INSERT INTO lessons (course_id, title, content) VALUES (?, ?, ?)");
    if ($stmt->execute([$data->course_id, $data->title, $data->content ?? ''])) {
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Hiba a mentés során"]);
    }
}
?>