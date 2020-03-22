<?php
$host = 'host_name';
$user = 'user_name';
$pass = 'password';
$db = 'db_name';

$conn = new PDO("mysql:host=$host;dbname=$db", $user, $pass,array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
// set error mode to exception
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);