<?php
header("Content-Type: application/json");

$dataFile = __DIR__ . "/../data/verses.json";
$verses = json_decode(file_get_contents($dataFile), true);

$input = json_decode(file_get_contents("php://input"), true);
$id = $input["id"];

$verses = array_values(array_filter($verses, fn($v) => $v["id"] != $id));

file_put_contents($dataFile, json_encode($verses, JSON_PRETTY_PRINT));
echo json_encode(["status" => "deleted"]);
