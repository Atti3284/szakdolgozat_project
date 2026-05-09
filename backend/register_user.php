<?php
// CORS fejlécek – engedélyezik a React frontend elérését
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Adatbázis kapcsolat létrehozása
$conn = new PDO("mysql:host=localhost;dbname=edulearn_db", "root", "");

// JSON kérés törzs beolvasása és dekódolása
$data = json_decode(file_get_contents("php://input"));

// Csak akkor mentünk, ha az email és a Firebase UID meg van adva
if (!empty($data->email) && !empty($data->uid)) {
    // Új felhasználó beszúrása – szerepkör alapértelmezetten 'student'
    $stmt = $conn->prepare("INSERT INTO users (firebase_uid, email, full_name, role) VALUES (?, ?, ?, 'student')");

    // Ha nincs full_name megadva, az email @ előtti részét használjuk névként
    $full_name = $data->full_name ?? explode('@', $data->email)[0];

    try {
        $stmt->execute([$data->uid, $data->email, $full_name]);
        echo json_encode(["status" => "success", "message" => "Felhasználó mentve"]);
    } catch (PDOException $e) {
        // Például duplikált UID esetén (ha valaki kétszer próbál regisztrálni)
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}
?>
