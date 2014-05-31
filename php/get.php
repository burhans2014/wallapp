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

$lock = $latDir . $longFile . ".lock";
while(!mkdir($lock)) {};
	
$file = fopen($longFile, "r");

fseek($file, $_SESSION["pos"]);

while(!feof($file)) {
		
	echo fgets($file);
}

$_SESSION["pos"] = ftell($file);

fclose($file);

rmdir($lock);
?>
