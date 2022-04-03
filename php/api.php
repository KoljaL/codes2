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
    title TEXT NOT NULL DEFAULT "",
    content TEXT NOT NULL DEFAULT "",
    public TEXT NOT NULL DEFAULT "0",
    date TEXT NOT NULL DEFAULT "")');
    
    $insert = $db->prepare("INSERT INTO 'notes' ('id','title','content','public','date') VALUES ('1','Maus','<p>Klein und grau.</p>','0','2022-04-02 22:01:34')");
    $insert->execute();
    $insert = $db->prepare("INSERT INTO 'notes' ('id','title','content','public','date') VALUES ('2','Hund','<p>Jagt die Katze.</p>','0','2022-04-02 22:01:34')");
    $insert->execute();
    $insert = $db->prepare("INSERT INTO 'notes' ('id','title','content','public','date') VALUES ('3','Katze','<p>Fängt die Maus.</p>','0','2022-04-02 22:01:34')");
    $insert->execute();
    $insert = $db->prepare("INSERT INTO 'notes' ('id','title','content','public','date') VALUES ('4','Vogel','<p>Kann fliegen.</p>','0','2022-04-02 22:01:34')");
    $insert->execute();
    $insert = $db->prepare("INSERT INTO 'notes' ('id','title','content','public','date') VALUES ('5','Elefant','<p>Groß und grau.</p>','0','2022-04-02 22:01:34')");
    $insert->execute();
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
        $title =strip_tags($_POST['content']);
        $content = $_POST['content'];
    }
    // prepare title and content
    else {
        $title = strip_tags(substr($_POST['content'], 0, $count));
        $content = substr($_POST['content'], $count);
    }


    // $insert = $db->prepare("INSERT INTO notes (`content`, `title`, `date`) VALUES ( :content, :title, :date)") or sqlFehler($db->errorInfo()[2]);
    // $insert->bindValue(':content', $content);
    // $insert->bindValue(':title', $title);
    // $insert->bindValue(':date', date("Y-m-d H:i:s"));


    $insert = $db->prepare("INSERT INTO notes (`content`, `title`, `date`) VALUES ( ?,?,?)") or sqlFehler($db->errorInfo()[2]);
    // $insert->bindValue(':content', $content);
    // $insert->bindValue(':title', $title);
    // $insert->bindValue(':date', date("Y-m-d H:i:s"));

    

    $response = [];
    if ($insert->execute([$content, $title, date("Y-m-d H:i:s")])) {
        $response['code'] = 200;
        // $response['title'] = $title;
        // $response['content'] = $content;
        // $response['POST'] = $_POST['content'];
        // $response['count'] = $count;
        // $response['data']['id'] = 0;
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
    header('Content-Type: application/json; charset=UTF-8');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Max-Age: 3600');
    header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    echo json_encode($response);
}
