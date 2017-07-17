<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  
	$file = "locationdata.json";

	$filedata = $_POST['filedata'];
	if($filedata != ""){
		file_put_contents($file,$filedata);
	}
}
?>