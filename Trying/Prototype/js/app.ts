/// <reference path="../libs/jquery.d.ts" />

declare function simplify(points, tolerance, quality);

var iteration_counter,stats_data_fps,stats_data_ms,raw_data,webgl_points ;
       
function init(typ){
  iteration_counter = 0;
  stats_data_fps = new Array();
  stats_data_ms = new Array();
  drawChart(typ);
        
  showStats(stats_data_fps,stats_data_ms);
};

function drawChart (typ) {
  var iterations = $('#iterations').val();
  var simplify_options = new Array();
          
  if($('#tolerance').val() != "0"){
    var simplify_options = new Array(true,$('#tolerance').val());
  }
  
  // create Data for draw actions
  var prepared_data = prepareData(raw_data,typ,$('#limit_lines').val(),simplify_options);

  $('#counter_simply').html((prepared_data.length-1).toString());
          
  // iteractions for drawing        
  while(iterations > iteration_counter){
    var t0 = performance.now();
    var line_points = new Array(new Array(0,0));
	
    iteration_counter++;          
    $("#container").empty(); 

    if(typ == "svg"){
      if($('#draw_type').val() == "lines"){
        drawSvgLines(prepared_data, $("#container"));
      }else{
        drawSvgPath(prepared_data, $("#container"));	
      }
    }else if(typ == "canvas"){
      var context = initCanvasContext('myCanvas');
      drawCanvasPath(prepared_data, context);
    }else{
      drawWebGlLines(prepared_data);
    }
         
    // stats stuff     
    var t1 = performance.now();
    var fps_value = requestAnimFrame();
    stats_data_fps.push(fps_value);
    stats_data_ms.push(t1 - t0);

  }						
};

	
function prepareData(data,typ,range,simplify_options){
  var ranged_points = new Array();
  var range_counter = 0;	
  var x_range = 0; // some day its the time value  
  var high_quality = false;
  var points_string = "-1.0, 1.0,0.0";
  webgl_points = new Float32Array(data.length*3);  
  for(var i in data) {  
    if(range < range_counter){
      break;
    }

	if(typ == "webgl"){
		points_string += ","+pixelToPoints(i,new Array(x_range,(data[i].chanels[0].value/50)));
	}else{
    	ranged_points.push({x:x_range, y:(data[i].chanels[0].value/50), time:data[i].time});
    }
    range_counter++;
    x_range += 0.02;

  }
 
  if(typ == "webgl"){
  	return webgl_points;
  }

  if(simplify_options[0]){
  	data = simplify(ranged_points, simplify_options[1], high_quality);
  }else{
    data = ranged_points;
  }  
	
  return data;
}

var outputUpdate = function(val){
  $('#limit_lines').val(val);
}

var fps;
var lastCalledTime;

// fps stats stuff		
function requestAnimFrame() {
		
  if(!lastCalledTime) {
    lastCalledTime = Date.now();
    fps = 0;
    return 66;
  }
  var delta = (new Date().getTime() - lastCalledTime)/1000;
  lastCalledTime = Date.now();
  fps = 1/delta;
  if(fps == "Infinity"){
  	fps=66;
  }else if(fps > 66){
  	fps=66;
  }
  return fps;
} 

function showStats(stats_data_fps,stats_data_ms){
  var fps = 0;
  var ms = 0;
  var data = stats_data_fps;
  for(var i in data) {      
    if(i>0){
      fps = fps+data[i];
      ms = ms+stats_data_ms[i];
    }
  }

  var fps_av = fps/($('#iterations').val()-1);
  var ms_av = ms/($('#iterations').val()-1);
			
  $('#average_fps').html(fps_av.toString());
  $('#average_ms').html(ms_av.toString());
  var sum_ms = ms_av*$('#iterations').val();
  $('#sum_ms').html(sum_ms.toString());
}
