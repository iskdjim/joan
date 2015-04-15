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
	console.log("getJsonData");
	$(document).ready( function() {
		$.getJSON( "api/data.json", function( data ) {
			$.each(data, function(i,val){
				console.log(val.time);
				$('#data').append("<p>"+(i+1)+")"+val.time+"</p>");
			});
			
		});
	});    
    
}    
