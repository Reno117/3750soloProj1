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

// Check if file exists
if (!file_exists($dataFile)) {
    http_response_code(404);
    echo json_encode(["error" => "Data file not found"]);
    exit();
}

// Load existing verses
$verses = json_decode(file_get_contents($dataFile), true);
if (!is_array($verses)) {
    $verses = [];
}

// Get updated verse from request
$input = file_get_contents("php://input");
$updatedVerse = json_decode($input, true);

if (!$updatedVerse || !isset($updatedVerse["id"])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON or missing ID"]);
    exit();
}

// Find and update the verse
$found = false;
foreach ($verses as $index => $verse) {
    if ($verse["id"] == $updatedVerse["id"]) {
        $verses[$index] = $updatedVerse;
        $found = true;
        break;
    }
}

if (!$found) {
    http_response_code(404);
    echo json_encode(["error" => "Verse not found"]);
    exit();
}

// Save to file
file_put_contents($dataFile, json_encode($verses, JSON_PRETTY_PRINT));

echo json_encode($updatedVerse);
?>
