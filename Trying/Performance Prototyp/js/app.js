var mili_secs = 0;

function getData(){
  $.get('api/request_handler.php', {} , function(data) {
    if(data){
      return data;
    }   
  }, 'json');
}
    
function getJsonData(){
  return "test";
  $.getJSON( "api/data.json", function( data ) {
    return "data";
  }); 
}    

function stats(){
  var stats = new Stats();
  stats.setMode(0); // 0: fps, 1: ms
			
  // align top-left
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0em';
  stats.domElement.style.top = '0em';

  document.body.appendChild( stats.domElement );
  return stats;
}

function mstats(){
  var mstats = new Stats();
  stats.setMode(1); 
  
  mstats.domElement.style.position = 'fixed';
  mstats.domElement.style.right  = '0em';
  mstats.domElement.style.top   = '0em';

  document.body.appendChild( mstats.domElement );
			
  return mstats;
}

    
var outputUpdate = function(val){
  $('#limit_lines').val(val);
}


function mSecStats(){
  var mili_secs_interval;
  mili_secs_interval = setInterval(function(){
    mili_secs++; 
  }, 1);
  return 1;

}

var fps;
var lastCalledTime;
		
function requestAnimFrame() {
		
  if(!lastCalledTime) {
    lastCalledTime = Date.now();
    fps = 0;
    return 66;
  }
  delta = (new Date().getTime() - lastCalledTime)/1000;
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
    
  $.each(stats_data_fps, function(i,val){
    if(i>0){
      fps = fps+val;
      ms = ms+stats_data_ms[i];
    }
  });

  var fps_av = fps/($('#iterations').val()-1);
  var ms_av = ms/($('#iterations').val()-1);
			
  $('#average_fps').html(fps_av);
  $('#average_ms').html(ms_av);
  $('#sum_ms').html(ms_av*$('#iterations').val());
}

function prepareData(data,type,range,simplify_options){
  var ranged_points = new Array();
  var range_counter = 0;	
  var x_range = 0; // some day its the time value  
  var high_quality = false;
  $.each(data, function(i,val){
    if(range < range_counter){
      return;
    }
    ranged_points.push({x:x_range, y:(val.chanels[0].value/50), time:val.time});	
    range_counter++;
    x_range += 0.02;
  })
  if(simplify_options[0]){
  	data = simplify(ranged_points, simplify_options[1], high_quality);
  }else{
    data = ranged_points;
  }  
  	
  return data;

}


function drawSvgLines(prepare_data, target){
  var shift_counter = 0;	
  var line_points = new Array(new Array(0,0));
  
  $.each(prepare_data, function(i,val){        
    shift_counter++;
    line_points.push(new Array( val.x, val.y));
    if(shift_counter > 1){
     line_points.shift();
    }
							
    x1 = line_points[0][0];
    y1 = line_points[0][1];
    x2 = line_points[1][0];
    y2 = line_points[1][1];

    var newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
    newLine.setAttribute('id','time_'+val.time);
    newLine.setAttribute('x1',x1);
    newLine.setAttribute('y1',y1);
    newLine.setAttribute('x2',x2);
    newLine.setAttribute('y2',y2);
    newLine.setAttribute('style','stroke:rgb(0,0,0)');

    target.append(newLine);	
  					  
  })

}

function drawSvgPath(prepare_data, target){
  var line_points = "M0 0";
  var x_range = 0; // some day its the time value  
 // console.log(prepare_data);
  
  $.each(prepare_data, function(i,val){
    line_points += " L"+val.x+" "+(val.y);    
  })
  newpath = document.createElementNS('http://www.w3.org/2000/svg','path');
  newpath.setAttributeNS(null, "id", "pathIdD");  
  newpath.setAttributeNS(null, "d", line_points);  
  newpath.setAttributeNS(null, "stroke", "black"); 
  newpath.setAttributeNS(null, "stroke-width", 1);  
  newpath.setAttributeNS(null, "opacity", 1);  
  newpath.setAttributeNS(null, "fill", "none");
            
  target.append(newpath);	 

}


function drawCanvasPath(prepared_data, context_data){
  context = context_data[0]
  context.clearRect ( 0 , 0 , context_data[1], context_data[2] );
  context.beginPath();
  context.moveTo(0, 0);
  var x_range = 0; // some day its the time value    
  $.each(prepared_data, function(i,val){
    x1 = val.x;
    y1 = val.y;
    context.lineTo(x1,y1);
  })

  context.stroke();
}


	    
function createPointsArray(chanel){
  var x_range = 0;
  var points_pixel = points_data;
	
  var points_string = "-1.0, 1.0,0.0";
  points = new Float32Array(points_pixel.length*3);
  $.each(points_pixel, function(i,val){
    y_range = (val['chanels'][chanel].value/50);
    x_range += 0.01;
      points_string += ","+pixelToPoints(i,new Array(x_range,y_range))
    });
     return points             
  };
		
  // helpfer function for point generation - by Michi
function pixelToPoints(index,point){
  var x = 0;
  var y = 0;
  var range_value = 100;
  if(point[0] < canvas.width/2){
    if(point[0] > 0){
      x = (range_value-(((range_value/(canvas.width/2))*point[0])))*-0.01;
    }else{
      x = -1;
    }	
  }else if(point[0] > canvas.width/2){
    x = ((((range_value/(canvas.width/2))*point[0])))*0.01;
  }
        
  if(point[1] < canvas.height/2){
    if(point[1] > 0){
      y = (range_value-(((range_value/(canvas.height/2))*point[1])))*0.01;
    }else{
      y = -1;
    }	
  }else if(point[1] > canvas.height/2){
    y = (range_value-(((range_value/(canvas.height/2))*point[1])))*0.01;
  }

  points[(index*3)] = x;
  points[(index*3)+1] = y;
  points[(index*3)+2] = 0.0;
}

function getShader(gl, id) {
  var shaderScript = document.getElementById(id);
  if (!shaderScript) {
    return null;
  }
  var str = "";
  var k = shaderScript.firstChild;
  while (k) {
    if (k.nodeType == 3) {
      str += k.textContent;
    }
    k = k.nextSibling;
  }
  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }
  gl.shaderSource(shader, str);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}
