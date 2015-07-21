<?php


$csvFile = "data/sensor_data_akt.csv";
$handle = fopen($csvFile,"r");
$json_data = array();
$counter = 0;
$limit = $_GET['limit'];
$channel_one = array();
$channel_two = array();
$channel_three = array();

while($data = fgetcsv($handle, 9999, ";")){
	$counter++;
	$channel_one[] = array('time' => $data[0], 'y' => $data[5]/100);
	$channel_two[] = array('time' => $data[0], 'y' => $data[7]/100);	
	$channel_three[] = array('time' => $data[0], 'y' => $data[9]/100);
	/*var lineChartData = [
			// First series
	{
		label: "Series 1",
		values: [ {time: 1370044800, y: 100}, {time: 1370044801, y: 1000}, ... ]
	},
	
	// The second series
	{
		label: "Series 2",
		values: [ {time: 1370044800, y: 78}, {time: 1370044801, y: 98}, ... ]
	},
	
	...
	];
	/*$dataset = array("time" => $data[0], 
					 "chanels" => 
						array(
							array("chanel" => "1", "value" => $data[5]),
							array("chanel" => "2", "value" => $data[9]),
							array("chanel" => "3", "value" => $data[7])
						)
					
					);
		
*/
	if($counter > $limit){
		//$datas[] = $dataset;	
		break;
	}
/*	}else{
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
	}	*/			
}
$lineChartData = array(array('label'=> "Channel 1", 'values' => $channel_one),array('label'=> "Channel 2", 'values' => $channel_two),array('label'=> "Channel 3", 'values' => $channel_three));

$json_file = fopen("data.min.js", "w");
fwrite($json_file, "var jsonData = ".json_encode($lineChartData));
fclose($json_file);

$json_file2 = fopen("data.json", "w");
fwrite($json_file2, json_encode($json_data, JSON_PRETTY_PRINT));
fclose($json_file2);



var_dump(json_encode($json_data, JSON_PRETTY_PRINT));

?>
