<?php
// CORS fejlécek – engedélyezik a React frontend elérését különböző portról
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Adatbázis kapcsolat létrehozása PDO-val
$conn = new PDO("mysql:host=localhost;dbname=edulearn_db", "root", "");

// A kérés törzséből beolvasott JSON adat dekódolása
$data = json_decode(file_get_contents("php://input"));

// Csak akkor futtatjuk, ha a kötelező mezők (kurzus azonosító és cím) meg vannak adva
if (!empty($data->course_id) && !empty($data->title)) {
    // Új lecke beszúrása a lessons táblába (content opcionális, hiány esetén üres string)
    $stmt = $conn->prepare("INSERT INTO lessons (course_id, title, content) VALUES (?, ?, ?)");
    if ($stmt->execute([$data->course_id, $data->title, $data->content ?? ''])) {
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Hiba a mentés során"]);
    }
}
?>
