<?php
// CORS fejlécek – engedélyezik a React frontend elérését
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Adatbázis kapcsolat létrehozása
$conn = new PDO("mysql:host=localhost;dbname=edulearn_db", "root", "");

// JSON kérés törzs beolvasása és dekódolása
$data = json_decode(file_get_contents("php://input"));

// Csak akkor folytatjuk, ha a felhasználó UID és a kurzus azonosítója meg van adva
if (!empty($data->user_uid) && !empty($data->course_id)) {

    // DUPLIKÁCIÓ ELLENŐRZÉS – megnézzük, hogy a felhasználó már feliratkozott-e erre a kurzusra
    $check = $conn->prepare("SELECT id FROM enrollments WHERE user_uid = ? AND course_id = ?");
    $check->execute([$data->user_uid, $data->course_id]);

    if ($check->rowCount() > 0) {
        // Ha már fel van iratkozva, hibaüzenettel leállítjuk a folyamatot
        echo json_encode(["status" => "error", "message" => "Már feliratkoztál erre a kurzusra!"]);
        exit;
    }

    // FELIRATKOZÁS MENTÉSE – új sor az enrollments táblába
    $stmt = $conn->prepare("INSERT INTO enrollments (user_uid, course_id) VALUES (?, ?)");

    try {
        $stmt->execute([$data->user_uid, $data->course_id]);
        echo json_encode(["status" => "success", "message" => "Sikeres feliratkozás!"]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}
?>
