<?php
require_once 'connect.php';

if ( !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest' ) {


   if (isset($_POST['forma_1']) && $_POST['forma_1']!='') {
        $dane=[];
       parse_str($_POST["forma_1"], $dane);
       forma_1_send($dane,$conn);
   }
   elseif (isset($_POST['kod_pocztowy']) && $_POST['kod_pocztowy']!='')
   {
       $dane=[];

       $kod_pocztowy=$_POST['kod_pocztowy'];

            if ($kod_pocztowy!='null') {
                forma_2_send($kod_pocztowy, $conn);
            }
            else
            {
                forma_2_send('', $conn);
            }
   }
}



function forma_1_send($dane,$conn)
{
    try {

        //bind parameters and prepare sql
        $stmt = $conn->prepare("INSERT INTO dane (nazwa,tel,kod,info) VALUES (:nazwa, :tel, :kod,:info)");
        $stmt->bindParam(':nazwa', $dane['imie']);
        $stmt->bindParam(':tel', $dane['nr_tel']);
        $stmt->bindParam(':kod', $dane['kod_pocztowy']);
        $stmt->bindParam(':info', $dane['msg']);
        $stmt->execute();
        echo 'ok';
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
    $conn = null;
}


function forma_2_send($dane,$conn)
{
    try {

        $wynik=searchRecord_kodPocztowy($dane,$conn);


       $randIndex=array_rand($wynik);
       $tmp_wynik=$wynik[$randIndex];


       $json['nazwa']=$tmp_wynik['nazwa'];
       $json['tel']=$tmp_wynik['tel'];
       $json['msg']=$tmp_wynik['info'];

       echo json_encode($json);


    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
    $conn = null;
}

function searchRecord_kodPocztowy($kod_pocztowy,$conn)
{
   $wynik=false;
$last_kod=$kod_pocztowy;
$wynik_all=array();


if ($last_kod!="") {
    while (!$wynik_all) {
        $stmt = $conn->prepare("SELECT nazwa,tel,info from dane where kod like :kod");

        $string = "$last_kod%";
        $stmt->bindParam(':kod', $string);
        $stmt->execute();
        $tmp_wynik = $stmt->fetchAll();

        if (!$tmp_wynik) {
            $last_kod = substr($last_kod, 0, -1);
        } else {
            foreach ($tmp_wynik as $row) {
                array_push($wynik_all, $row);
            }
        }
    }

    return $wynik_all;
}
else{

    $stmt = $conn->prepare("SELECT nazwa,tel,info from dane");

    $stmt->execute();
    $tmp_wynik = $stmt->fetchAll();
    
    return $tmp_wynik;
}
}







