<?php
header('Access-Control-Allow-Origin: *'); // Or specify your Netlify domain
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$dataFile = __DIR__ . "/../data/verses.json";
echo file_get_contents($dataFile);
