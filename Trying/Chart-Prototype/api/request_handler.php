<?php


$csvFile = "data/sensor_data_akt.csv";
$handle = fopen($csvFile,"r");
$json_data = array();
$counter = 0;
$limit = $_GET['limit'];
while($data = fgetcsv($handle, 9999, ";")){
	$counter++;

	$dataset = array("time" => $data[0], 
					 "chanels" => 
						array(
							array("chanel" => "1", "value" => rand(5, 40))
						)
					
					);
		

	if($counter < $limit){
		$datas[] = $dataset;	
		//die();
	}else{
		$json_data = array(
					 "data" => $datas,
					 "start_time" => "",
					 "end_time"	 => "",
					 "count" => $limit,
					 "limits" => array(
					 				array("chanel" => "1", "min" => "", "max" => "")
								 )
				);
		break;
	}				
}


$json_file = fopen("data_clean.min.js", "w");
fwrite($json_file, "var jsonData = ".json_encode($json_data));
fclose($json_file);

$json_file2 = fopen("data_clean.json", "w");
fwrite($json_file2, json_encode($json_data, JSON_PRETTY_PRINT));
fclose($json_file2);



var_dump(json_encode($json_data, JSON_PRETTY_PRINT));

?>
