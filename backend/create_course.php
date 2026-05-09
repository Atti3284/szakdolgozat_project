<?php
// CORS fejlécek – engedélyezik a React frontend hozzáférését
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Adatbázis kapcsolat létrehozása
$conn = new PDO("mysql:host=localhost;dbname=edulearn_db", "root", "");

// JSON kérés törzs beolvasása és dekódolása
$data = json_decode(file_get_contents("php://input"));

// Csak akkor futtatjuk, ha a kötelező mezők (cím és oktató UID) meg vannak adva
if (!empty($data->title) && !empty($data->instructor_uid)) {
    // Új kurzus beszúrása – students értéke 0-val indul (még nincs feliratkozott)
    $stmt = $conn->prepare("INSERT INTO courses (title, instructor, instructor_uid, color, imageUrl, students) VALUES (?, ?, ?, ?, ?, 0)");

    try {
        $stmt->execute([
            $data->title,
            $data->instructor,
            $data->instructor_uid,
            $data->color ?? 'bg-blue-600', // Ha nincs szín megadva, kék az alapértelmezett
            $data->imageUrl ?? null         // Ha nincs kép URL, null kerül az adatbázisba
        ]);

        // Sikeres esetben visszaküldjük az új kurzus azonosítóját is
        echo json_encode([
            "status" => "success",
            "message" => "Kurzus sikeresen létrehozva!",
            "id" => $conn->lastInsertId()
        ]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} else {
    // Hiányzó kötelező mezők esetén hibaüzenet visszaküldése
    echo json_encode(["status" => "error", "message" => "Hiányzó adatok (cím vagy azonosító)!"]);
}
?>
