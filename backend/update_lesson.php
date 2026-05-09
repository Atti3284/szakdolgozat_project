<?php
// CORS fejlécek – engedélyezik a React frontend elérését, POST és OPTIONS kéréseket fogad
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// OPTIONS preflight kérés kezelése (böngésző CORS ellenőrzés) – válaszolunk és kilépünk
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// Adatbázis kapcsolat létrehozása
$conn = new PDO("mysql:host=localhost;dbname=edulearn_db", "root", "");

// JSON kérés törzs beolvasása tömbként (true paraméter = asszociatív tömb)
$data = json_decode(file_get_contents("php://input"), true);

// Csak akkor folytatjuk, ha minden szükséges mező meg van adva
if (isset($data['lessonId']) && isset($data['completed']) && isset($data['uid']) && isset($data['courseId'])) {

    $lessonId = $data['lessonId'];
    $isCompleted = $data['completed']; // true = pipa be, false = pipa ki
    $uid = $data['uid'];
    $courseId = $data['courseId'];

    if ($isCompleted) {
        // LECKE BEFEJEZETTNEK JELÖLÉSE – sor beszúrása a user_progress táblába
        // INSERT IGNORE: ha már létezik az adott (uid, lesson_id) pár, nem hibázik
        $stmt = $conn->prepare("INSERT IGNORE INTO user_progress (user_uid, lesson_id) VALUES (?, ?)");
        $result = $stmt->execute([$uid, $lessonId]);
    } else {
        // PIPA VISSZAVONÁSA – sor törlése a user_progress táblából
        $stmt = $conn->prepare("DELETE FROM user_progress WHERE user_uid = ? AND lesson_id = ?");
        $result = $stmt->execute([$uid, $lessonId]);
    }

    if ($result) {
        // UTOLSÓ AKTIVITÁS FRISSÍTÉSE – a Dashboard a legutóbb használt 3 kurzust mutatja,
        // ehhez az enrollments táblában tárolt last_activity mezőt frissítjük
        $updateActivity = $conn->prepare("UPDATE enrollments SET last_activity = CURRENT_TIMESTAMP WHERE user_uid = ? AND course_id = ?");
        $updateActivity->execute([$uid, $courseId]);

        echo json_encode(["status" => "success", "message" => "Personal progress updated"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Update failed"]);
    }
} else {
    // Ha hiányoznak a kötelező mezők a kérésből
    echo json_encode(["status" => "error", "message" => "Missing data"]);
}
?>
