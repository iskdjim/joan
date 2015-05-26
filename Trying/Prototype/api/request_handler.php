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
							array("chanel" => "1", "value" => $data[5]),
							array("chanel" => "2", "value" => $data[6]),
							array("chanel" => "3", "value" => $data[7])
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
					 				array("chanel" => "1", "min" => "", "max" => ""),
									array("chanel" => "2", "min" => "", "max" => ""),
									array("chanel" => "3", "min" => "", "max" => "")
								 )
				);
		break;
	}				
}

$json_file = fopen("data.json", "w");
fwrite($json_file, json_encode($json_data));
fclose($json_file);

echo json_encode($json_data);

?>
