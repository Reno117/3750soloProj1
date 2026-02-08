<?php
header("Content-Type: application/json");
header('Access-Control-Allow-Origin: *'); // Or specify your Netlify domain
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


$dataFile = __DIR__ . "/../data/verses.json";
$verses = json_decode(file_get_contents($dataFile), true);

$updated = json_decode(file_get_contents("php://input"), true);

foreach ($verses as &$v) {
  if ($v["id"] == $updated["id"]) {
    $v = $updated;
    break;
  }
}

file_put_contents($dataFile, json_encode($verses, JSON_PRETTY_PRINT));
echo json_encode(["status" => "ok"]);
