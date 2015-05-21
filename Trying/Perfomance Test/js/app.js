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
