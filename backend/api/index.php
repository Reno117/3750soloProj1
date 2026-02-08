<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

echo json_encode([
    'status' => 'ok',
    'message' => 'Bible Verse Memorization API',
    'endpoints' => [
        'GET /getVerses.php' => 'Get all verses',
        'POST /addVerse.php' => 'Add a new verse',
        'POST /updateVerse.php' => 'Update an existing verse',
        'POST /deleteVerse.php' => 'Delete a verse'
    ]
]);
?>