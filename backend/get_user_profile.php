<?php
// CORS fejlécek – engedélyezik a React frontend elérését
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Adatbázis kapcsolat létrehozása
$conn = new PDO("mysql:host=localhost;dbname=edulearn_db", "root", "");

// Csak akkor keressük meg a felhasználót, ha az UID meg van adva az URL-ben
if (isset($_GET['uid'])) {
    // Felhasználó keresése a Firebase UID alapján (összeköti a Firebase-t a MySQL-lel)
    $stmt = $conn->prepare("SELECT * FROM users WHERE firebase_uid = ?");
    $stmt->execute([$_GET['uid']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // Ha megtaláltuk a felhasználót, visszaküldjük az adatait (full_name, role, stb.)
        echo json_encode($user);
    } else {
        // Ha nincs ilyen felhasználó az adatbázisban
        echo json_encode(["error" => "User not found"]);
    }
}
?>
