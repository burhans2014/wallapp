<?php 
session_start();
if(isset($_POST["latitude"])) {

	$latitude = $_POST["latitude"];
	$longitude = $_POST["longitude"];
	
	$_SESSION["latitude"] = $latitude;
	$_SESSION["longitude"] = $longitude;
	$_SESSION["pos"] = 0;
	
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
	
	if(!is_dir($latDir)) {
		
		mkdir($latDir);
	}
	
	chdir($latDir);
	
	if(!is_file($longFile)) {
	
		touch($longFile);	
	} 
	
} else {
	
	$line = $_POST["line"];
	
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
	
	$file = fopen("$longFile", "a");
	
	$lineArray = explode("\n", $line);
	
	foreach($lineArray as $pos) {
	
		if($pos != "") {
			
			fputs($file, $pos . "\n");
		}
	}
	
	fclose($file);
	
	rmdir($lock);
}
?>