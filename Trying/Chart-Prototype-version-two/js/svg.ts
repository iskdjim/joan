function drawSvgLines(linesData, target){
  var shiftCounter = 0;
  var linePoints = new Array(new Array(0,0));

  var data = prepareData;
  for(var i in data) {
    shiftCounter++;
    linePoints.push(new Array( data[i].x, data[i].y));
    if(shiftCounter > 1){
     linePoints.shift();
    }
					
    var x1 = linePoints[0][0];
    var y1 = linePoints[0][1];
    var x2 = linePoints[1][0];
    var y2 = linePoints[1][1];

    var newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
    newLine.setAttribute('id','time_'+data[i].time);
    newLine.setAttribute('x1',x1.toString());
    newLine.setAttribute('y1',y1.toString());
    newLine.setAttribute('x2',x2.toString());
    newLine.setAttribute('y2',y2.toString());
    newLine.setAttribute('style','stroke:rgb(0,0,0)');

    target.append(newLine)

  }
}