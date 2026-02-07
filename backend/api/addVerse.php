<?php
header("Content-Type: application/json");

$dataFile = __DIR__ . "/../data/verses.json";
$verses = json_decode(file_get_contents($dataFile), true);

$newVerse = json_decode(file_get_contents("php://input"), true);
$newVerse["id"] = time();

$verses[] = $newVerse;

file_put_contents($dataFile, json_encode($verses, JSON_PRETTY_PRINT));
echo json_encode($newVerse);
