<?php 
session_start();
if(!isset($_SESSION["latitude"])) { return; }

$latitude = $_SESSION["latitude"];
$longitude = $_SESSION["longitude"];

if($latitude >= 0) {

	$latDir = "latp" . $latitude;
	
} else {

	$latDir = "latn" . ($latitude * -1);
}

if($longitude >= 0) {

	$longFile = "longp" . $longitude;
	
} else {

	$longFile = "longn" . ($longitude * -1);
}

chdir("data");
chdir($latDir);

$file = $longFile . ".background";

echo file_get_contents($file);
?>