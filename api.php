<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

//DB
$db_path = 'db.sqlite';

if (!file_exists($db_path)) {
    $db->exec('CREATE TABLE notes(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL DEFAULT "",
    tags TEXT NOT NULL DEFAULT "",
    language TEXT NOT NULL DEFAULT "",
    description TEXT NOT NULL DEFAULT "",
    content TEXT NOT NULL DEFAULT "",
    date TEXT NOT NULL DEFAULT "")');
    $db = new PDO('sqlite:' . $db_path);
} else {
    $db = new PDO('sqlite:' . $db_path);
}
$response = $_POST;
// $request = json_decode( file_get_contents( 'php://input' ), true );
function return_JSON($response)
{

    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json; charset=UTF-8');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Max-Age: 3600');
    header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    echo json_encode($response);
    // exit;
}
