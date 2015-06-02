function initCanvasContext(desternation){
  var c : any  = document.getElementById(desternation);
  return new Array(c.getContext("2d"),c.width, c.height);
}

function drawCanvasPath(preparedData, contextData){
  var context = contextData[0]
  context.clearRect ( 0 , 0 , contextData[1], contextData[2] );
  context.beginPath();
  context.moveTo(0, 0);
  var xRange = 0; // some day its the time value
  var data = preparedData;
  for(var i in data) {
    var x1 = data[i].x;
    var y1 = data[i].y;
    context.lineTo(x1,y1);
  }
  context.stroke();
}

