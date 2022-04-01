<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

//DB
$db_path = '../data/db.sqlite';

if (!file_exists($db_path)) {
    $db = new PDO('sqlite:' . $db_path);
    $db->exec('CREATE TABLE notes(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL DEFAULT "",
    public TEXT NOT NULL DEFAULT "0",
    date TEXT NOT NULL DEFAULT "")');
} else {
    $db = new PDO('sqlite:' . $db_path);
}

if (isset($_POST['content'])) {
    $insert = $db->prepare("INSERT INTO notes (`content`, `date`) VALUES ( :content, :date)") or sqlFehler($db->errorInfo()[2]);
    $insert->bindValue(':content', $_POST["content"]);
    $insert->bindValue(':date', date("Y-m-d H:i:s"));
    $response = [];
    if ($insert->execute()) {
        $response['code'] = 200;
        $response['data']['id'] = 0;
        return_JSON($response);
    }
}

if (isset($_GET['all'])) {
    $select = $db->prepare("SELECT * FROM notes ") or sqlFehler($db->errorInfo()[2]);
    $select->execute([]);
    $notes = $select->fetchAll(PDO::FETCH_ASSOC);

    if ($notes) {
        $response['code'] = 200;
        $response['data'] = $notes;
        return_JSON($response);
    }
}


function return_JSON($response)
{
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json; charset=UTF-8');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Max-Age: 3600');
    header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    echo json_encode($response);
}
