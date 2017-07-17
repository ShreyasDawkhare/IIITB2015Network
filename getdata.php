<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
	$file = "locationdata.json";

	echo file_get_contents($file);

}
?>