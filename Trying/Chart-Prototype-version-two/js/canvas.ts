function initCanvasContext(desternation){
  var c : any  = document.getElementById(desternation);
  return new Array(c.getContext("2d"),c.width, c.height);
}

function drawCanvasLines(linesData,lineX,lineY){
  var context = contextData[0];
  context.clearRect ( 0 , 0 , contextData[1], contextData[2] );
  context.beginPath();
  context.lineWidth = linesWidth;

  for(var i in linesData) {
    var x0 = linesData[i][0][0];
    var y0 = linesData[i][0][1];
    var x1 = linesData[i][1][0];
    var y1 = linesData[i][1][1];

	context.beginPath();
	context.moveTo(x0,y0);
	context.lineTo(x1,y1);
	context.strokeStyle = '#000000';

	if(lineX && activeLines[i]){	
      context.strokeStyle = '#FF0000';
	}

	context.stroke();
  }
}