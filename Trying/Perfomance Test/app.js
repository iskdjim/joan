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
