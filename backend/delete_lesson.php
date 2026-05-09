<?php
// CORS fejlécek – engedélyezik a React frontend elérését
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Adatbázis kapcsolat létrehozása
$conn = new PDO("mysql:host=localhost;dbname=edulearn_db", "root", "");

// JSON kérés törzs beolvasása és dekódolása
$data = json_decode(file_get_contents("php://input"));

// Csak akkor törlünk, ha a lecke azonosítója meg van adva
if (!empty($data->lesson_id)) {
    // Lecke törlése az adatbázisból az azonosítója alapján
    $stmt = $conn->prepare("DELETE FROM lessons WHERE id = ?");
    $stmt->execute([$data->lesson_id]);
    echo json_encode(["status" => "success"]);
}
?>
