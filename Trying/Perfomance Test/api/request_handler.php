<?php


$csvFile = "data/sensor_data.csv";
$handle = fopen($csvFile,"r");
$data = array();
while($data = fgetcsv($handle, 99, ";")){
	echo $data[0]."<br />";
}

/*
$data = array(
			"dataset" => array(
					"time" => "2030",
					"kanale" => array(
							"kanal" => "1", "value" => "some wert",
							"kanal" => "2", "value" => "some wert",
							"kanal" => "3", "value" => "some wert"
							)
			)	
		);
 * 
 */
echo json_encode($data);
?>
