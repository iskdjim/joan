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
