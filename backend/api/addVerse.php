<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$dataFile = __DIR__ . "/data/verses.json";

// Ensure data directory exists
$dir = dirname($dataFile);
if (!is_dir($dir)) {
    mkdir($dir, 0777, true);
}

// Check if file exists, create empty array if not
if (!file_exists($dataFile)) {
    file_put_contents($dataFile, json_encode([]));
}

// Load existing verses
$verses = json_decode(file_get_contents($dataFile), true);
if (!is_array($verses)) {
    $verses = [];
}

// Get new verse from request
$input = file_get_contents("php://input");
$newVerse = json_decode($input, true);

if (!$newVerse) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON"]);
    exit();
}

// Generate ID and add verse
$newVerse["id"] = time() . rand(1000, 9999); // More unique ID
$verses[] = $newVerse;

// Save to file
file_put_contents($dataFile, json_encode($verses, JSON_PRETTY_PRINT));

echo json_encode($newVerse);
?>
