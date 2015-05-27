/// <reference path="../libs/jquery.d.ts" />

declare function simplify(points, tolerance, quality);

var iteration_counter,stats_data_fps,stats_data_ms,raw_data,webgl_points,line_type;
       
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
  var x_range_value = 0.02;
  var index = 0;
  var high_quality = false;
  var points_string = "-1.0, 0.0,0.0";
  var last_point_x = 0;
  var last_point_y = 0;
  var line_width = 3;
  webgl_points = new Float32Array(data.length*3);  
  if(typ == "webgl" && line_type != "line"){
    webgl_points = new Float32Array(data.length*3*6);    	
  }
  for(var i in data) {  
    if(range < range_counter){
      break;
    }
	
	if(typ == "webgl"){
		if(range_counter > 0 && line_type != "line"){
			var p_triangles = new Array();

 			p_triangles[0] = new Array(last_point_x,last_point_y);
 			p_triangles[1] = new Array(x_range+line_width,(data[i].chanels[0].value/50)+line_width);			 			
            p_triangles[2] = new Array(x_range,(data[i].chanels[0].value/50));
            
 			p_triangles[3] = new Array(last_point_x,last_point_y);
 			p_triangles[4] = new Array(last_point_x+line_width,(data[i].chanels[0].value/50)+line_width);			 			
            p_triangles[5] = new Array(x_range+line_width,(data[i].chanels[0].value/50)+line_width);	
 			
			for(var j=0;j<p_triangles.length;j++){
			
			  points_string += ","+pixelToPoints(index,new Array(p_triangles[j][0],p_triangles[j][1]));
			  index++;
			  
			}
		}else{

			points_string += ","+pixelToPoints(i,new Array(x_range,(data[i].chanels[0].value/50)));
			//index++;
		}
		last_point_x = x_range;
		last_point_y = (data[i].chanels[0].value/50);
	}else{
    	ranged_points.push({x:x_range, y:(data[i].chanels[0].value/50), time:data[i].time});
    }
    range_counter++;
    x_range += x_range_value;

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
