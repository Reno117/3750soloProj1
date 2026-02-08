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

// Check if file exists, create empty array if not
if (!file_exists($dataFile)) {
    $dir = dirname($dataFile);
    if (!is_dir($dir)) {
        mkdir($dir, 0777, true);
    }
    file_put_contents($dataFile, json_encode([]));
}

$verses = file_get_contents($dataFile);
echo $verses;
?>
