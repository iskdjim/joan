function initCanvasContext(desternation){
  var c : any  = document.getElementById(desternation);
  return new Array(c.getContext("2d"),c.width, c.height);
}

function drawCanvasPath(preparedData, contextData){
  var context = contextData[0]
  context.clearRect ( 0 , 0 , contextData[1], contextData[2] );
  context.beginPath();

  var data = preparedData;
  for(var i in data) {
    var x1 = data[i].x;
    var y1 = data[i].y;

    context.lineTo(x1,y1);
  }
  context.stroke();
}


function drawCanvasLines(preparedData, contextData){
  var context = contextData[0]
  context.clearRect ( 0 , 0 , contextData[1], contextData[2] );
  context.beginPath();

  var lastx = 0;
  var lasty = 290;
  context.lineWidth = canvasLineWidth;
  var data = preparedData;
  for(var i in data) {
    var x1 = data[i].x;
    var y1 = data[i].y;

    context.beginPath();
    context.moveTo(lastx,lasty);
    context.lineTo(x1,y1);
    context.strokeStyle = '#000000';
    var offset = $('#myCanvas').offset();
    if(mouseEvent){
      var mouse_x = mouseEvent.pageX - offset.left;
      var mouse_y = mouseEvent.pageY - offset.top;
      if(mouse_x > lastx && mouse_x < x1 && mouse_y > lasty-(canvasLineWidth/2) && mouse_y < y1+(canvasLineWidth/2)){
        context.strokeStyle = '#FF0000';
      }
    }
    context.stroke();
    context.closePath();
    lastx = x1;
    lasty = y1;
  }

}

