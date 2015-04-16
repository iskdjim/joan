function getData(){
    	  console.log("getData");
    
    	  $.get('api/request_handler.php', {} , function(data) {
    	  	console.log(data);
                if(data){
                	return data;
                }   
           }, 'json');

}
    
function getJsonData(){

		return "sd";
		$.getJSON( "api/data.json", function( data ) {
	
			return "data";
			
		});

    
}    


function stats(){
	        var stats = new Stats();
			stats.setMode(0); // 0: fps, 1: ms
			
			// align top-left
			stats.domElement.style.position = 'absolute';
			stats.domElement.style.left = '0px';
			stats.domElement.style.top = '0px';

			document.body.appendChild( stats.domElement );

			
			return stats;
}

function mstats(){
	       
			var mstats = new Stats();
			stats.setMode(1); //
			
			mstats.domElement.style.position = 'fixed';
			mstats.domElement.style.right  = '0px';
			mstats.domElement.style.top   = '0px';

			document.body.appendChild( mstats.domElement );
			
			return mstats;
}
