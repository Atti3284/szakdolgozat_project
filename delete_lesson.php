<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$conn = new PDO("mysql:host=localhost;dbname=edulearn_db", "root", "");
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->lesson_id)) {
    $stmt = $conn->prepare("DELETE FROM lessons WHERE id = ?");
    $stmt->execute([$data->lesson_id]);
    echo json_encode(["status" => "success"]);
}
?>