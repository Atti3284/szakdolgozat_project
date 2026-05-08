<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$conn = new PDO("mysql:host=localhost;dbname=edulearn_db", "root", "");

if (isset($_GET['uid'])) {
    $stmt = $conn->prepare("SELECT * FROM users WHERE firebase_uid = ?");
    $stmt->execute([$_GET['uid']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo json_encode($user);
    } else {
        echo json_encode(["error" => "User not found"]);
    }
}
?>