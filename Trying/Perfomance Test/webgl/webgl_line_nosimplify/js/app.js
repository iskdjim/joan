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
