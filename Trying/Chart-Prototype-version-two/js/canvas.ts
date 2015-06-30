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

	//if(mouseX && lineX && activeLines[i]){
	if(lineX && activeLines[i]){	
      context.strokeStyle = '#FF0000';
      if(activeLines[i] == "-1"){
        context.strokeStyle = '#000000';
      }
	}

	context.stroke();    
	//if(mouseX && lineX){
	//  context.beginPath();
	//  context.arc(lineX,lineY,tolerance,0,Math.PI*2);
	//  context.closePath();
	//  context.fill();
    //}  
  }
}


// handle mousemove events
// calculate how close the mouse is to the line
// if that distance is less than tolerance then
// display a dot on the line
function handleMousemove(e, action){
  e.preventDefault();
  e.stopPropagation();
  mouseX= e.clientX-offsetX;
  mouseY= e.clientY-offsetY;

  var boundingHit = 0;

  // check if mouse hits a bounding box
  possibleBoundingBoxes = [];
  for(var i in linesData){
    var xyValues = checkPointsForAngle(linesData[i]);

    if(mouseX<xyValues.x0 || mouseX>xyValues.x1 || mouseY<xyValues.y0  || mouseY>xyValues.y1){
      //console.log("no hit for line"+i);
	  boundingHit = 0;
	  continue;
	}
	  boundingHit = 1;
	  possibleBoundingBoxes[i] = i;

	}

    if(!boundingHit){
      //drawCanvasLines(linesData,0,0);
    }

    if(possibleBoundingBoxes.length > 0){
      var nearestLineIndex = -1;
      var bestDistance = 999999;
      // check which line is the nearest from the possible ones
      for(var j in possibleBoundingBoxes){
      	var linepoint=linepointNearestMouse(linesData[possibleBoundingBoxes[j]],mouseX,mouseY);
        var dx=mouseX-linepoint.x;
        var dy=mouseY-linepoint.y;
        var distance=Math.abs(Math.sqrt(dx*dx+dy*dy));
        // best distance => nearest line and set index
       	if(bestDistance > distance){
       	  bestDistance = distance;
       	  nearestLineIndex = possibleBoundingBoxes[j];
       	}
      }
	  if(bestDistance<tolerance){
	    if(action == "click"){
	  	  activeLines[nearestLineIndex] = 1;
	  	  if(e.shiftKey) {
	  	  activeLines[nearestLineIndex] = 0;	
	  	  }
	    }
        drawCanvasLines(linesData,linepoint.x,linepoint.y);
	  }else{
	    //drawCanvasLines(linesData,0,0);
	  }
    }
}

