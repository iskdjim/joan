function initCanvasContext(desternation){       
  var c : any  = document.getElementById(desternation);
  return new Array(c.getContext("2d"),c.width, c.height);
}
	
function drawCanvasPath(prepared_data, context_data){
  var context = context_data[0]
  context.clearRect ( 0 , 0 , context_data[1], context_data[2] );
  context.beginPath();
  context.moveTo(0, 0);
  var x_range = 0; // some day its the time value    
  var data = prepared_data;
  for(var i in data) {     
    var x1 = data[i].x;
    var y1 = data[i].y;
    context.lineTo(x1,y1);
  }

  context.stroke();
}

