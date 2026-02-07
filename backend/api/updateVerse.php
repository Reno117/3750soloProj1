<?php
header("Content-Type: application/json");

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
