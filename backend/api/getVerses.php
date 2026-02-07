<?php
header("Content-Type: application/json");

$dataFile = __DIR__ . "/../data/verses.json";
echo file_get_contents($dataFile);
