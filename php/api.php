<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

//DB
$db_path = '../data/dbe1w2.sqlite';

if (!file_exists($db_path)) {
    $db = new PDO('sqlite:' . $db_path);
    $db->exec('CREATE TABLE notes(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL DEFAULT "",
    content TEXT NOT NULL DEFAULT "",
    public TEXT NOT NULL DEFAULT "0",
    date TEXT NOT NULL DEFAULT "")');
    
    include_once 'dummy.php';
} else {
    $db = new PDO('sqlite:' . $db_path);
}





//
// INSERT CONTENT TO DB
//
if (isset($_GET['save'])) {
    // find end of first HTML tag
    $count = strpos($_POST['content'], '><')+1;
    // no tag found, title and content are the same
    if ($count ===1) {
        $title = substr(strip_tags($_POST['content']), 0, 20);
        $content = $_POST['content'];
    }
    // prepare title and content
    else {
        $title = strip_tags(substr($_POST['content'], 0, $count));
        $content = substr($_POST['content'], $count);
    }

    // decide to add new (0) or update note
    $id = $_POST['id'];
    if ("0" === $id) {
        $insert = $db->prepare("INSERT INTO notes (`content`, `title`, `date`) VALUES ( ?,?,?)") or sqlFehler($db->errorInfo()[2]);
        $saved = $insert->execute([$content, $title, date("Y-m-d H:i:s")]);
        $id = $db->lastInsertId();
    } else {
        $sql = "UPDATE notes SET content=?, title=? WHERE id=?";
        $saved = $db->prepare($sql)->execute([$content, $title, $id]);
    }

    $select = $db->prepare("SELECT id, title FROM notes ") or sqlFehler($db->errorInfo()[2]);
    $select->execute([]);
    $notes_list = $select->fetchAll(PDO::FETCH_ASSOC);


    $response = [];
    if ($saved) {
        $response['code'] = 200;
        $response['data']['title'] = $title;
        $response['data']['id'] = $id;
        $response['data']['list'] = $notes_list;
        return_JSON($response);
    }
}




//
// SHOW NOTE BY ID
//
if (isset($_GET['id'])) {
    $select = $db->prepare("SELECT * FROM notes WHERE id =?") or sqlFehler($db->errorInfo()[2]);
    $select->execute([$_POST['id']]);
    $note = $select->fetch(PDO::FETCH_ASSOC);
    if ($note) {
        $response['code'] = 200;
        $response['data'] = $note;
    } else {
        $response['code'] = 200;
        $response['data']['title'] = '';
        $response['data']['content'] = 'Note not found';
    }
    return_JSON($response);
}


if (isset($_GET['remove'])) {
    $select = $db->prepare("DELETE FROM notes WHERE id =?") or sqlFehler($db->errorInfo()[2]);
    $del = $select->execute([$_POST['id']]);
    if ($del) {
        $response['code'] = 200;
        return_JSON($response);
    }
}





//
// LIST FOR SIDEBAR
//
if (isset($_GET['list'])) {
    $select = $db->prepare("SELECT id, title FROM notes ") or sqlFehler($db->errorInfo()[2]);
    $select->execute([]);
    $notes_list = $select->fetchAll(PDO::FETCH_ASSOC);

    if ($notes_list) {
        $response['code'] = 200;
        $response['data'] = $notes_list;
        return_JSON($response);
    }
}





 


//
// send response as JSON
//
function return_JSON($response)
{
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');

    // header('Access-Control-Allow-Origin: http://127.0.0.1:5500', true);
    // header('Access-Control-Allow-Origin: *');
    // header('Content-Type: application/json; charset=UTF-8');
    // header('Access-Control-Allow-Methods: POST,GET');
    // header('Access-Control-Max-Age: 3600');
    // header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

    // header('Access-Control-Allow-Origin: *');
    // header('Access-Control-Allow-Methods: *');
    // header('Access-Control-Allow-Headers: *');
    // header('Access-Control-Max-Age: 86400');
    // header("X-Frame-Options: *");

    // header('Access-Control-Allow-Headers: X-Requested-With, Content-Type, X-Token-Auth, Authorization');
    // header('Access-Control-Allow-Origin: *');
    // hesder('Access-Control-Allow-Headers: *');

    echo json_encode($response);
}

// preflight ?? handshake?? maybe not neccessary...
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: *');
    header('Access-Control-Allow-Headers: *');
    header('Access-Control-Max-Age: 1728000');
    die();
}
