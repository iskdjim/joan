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

// handle mousemove events
// calculate how close the mouse is to the line
// if that distance is less than tolerance then
// display a dot on the line
function handleBoxSelect(){
  var boundingHit = 0;

  // check if mouse hits a bounding box
  var selectBoxHits = [];
  //console.log("left top x:"+selectBoxX+"left top y:"+selectBoxY);
  //console.log("right bottom x:"+(selectBoxX+selectBoxWidth)+"right bottom y:"+(selectBoxY+selectBoxHeight));

  for(var i in linesData){
    if(linesData[i][0][0] > selectBoxX && linesData[i][0][0] < (selectBoxX+selectBoxWidth) && linesData[i][0][1] > selectBoxY && linesData[i][0][1] < (selectBoxY+selectBoxHeight)){
      activeLines[i] = i;
      if(deselect){
        activeLines[i] = 0;
      }
    }

    if(linesData[i][1][0] > selectBoxX && linesData[i][1][0] < (selectBoxX+selectBoxWidth) && linesData[i][1][1] > selectBoxY && linesData[i][1][1] < (selectBoxY+selectBoxHeight)){
      activeLines[i] = i;
      if(deselect){
        activeLines[i] = 0;
      }
    }

    var xyValues = checkPointsForAngle(linesData[i]);

    var x1 = (selectBoxX+selectBoxWidth);
    var y1 = (selectBoxY+selectBoxHeight);

    // calculate the angle for the diffrent box points
    var angleDeg = Math.atan2(xyValues.y1 - xyValues.y0, xyValues.x1 - xyValues.x0) * 180 / Math.PI;
    var rightTop = Math.atan2((selectBoxY) - xyValues.y0, (x1) - xyValues.x0) * 180 / Math.PI;
    var rightBottom = Math.atan2((y1) - xyValues.y0, (x1) - xyValues.x0) * 180 / Math.PI;
    var leftBottom = Math.atan2((y1) - xyValues.y0, (selectBoxX)-xyValues.x0) * 180 / Math.PI;
    var leftTop = Math.atan2((selectBoxY) - xyValues.y0, (selectBoxX)-xyValues.x0) * 180 / Math.PI;  

    // calculate the distance for the box points
    var dist_angleDeg = Math.sqrt(Math.pow(xyValues.x1 - xyValues.x0,2) + Math.pow(xyValues.y1 - xyValues.y0,2));
    var dist_rightTop = Math.sqrt(Math.pow(x1 - xyValues.x0,2) + Math.pow(selectBoxY - xyValues.y0,2));
    var dist_rightBottom = Math.sqrt(Math.pow(x1 - xyValues.x0,2) + Math.pow(y1 - xyValues.y0,2));
    var dist_leftBottom = Math.sqrt(Math.pow(selectBoxX - xyValues.x0,2) + Math.pow(y1 - xyValues.y0,2));
    var dist_leftTop = Math.sqrt(Math.pow(selectBoxX - xyValues.x0,2) + Math.pow(selectBoxY - xyValues.y0,2));


    // if all angles are bigger => no colision
    if(rightTop > angleDeg && rightBottom > angleDeg && leftBottom > angleDeg && leftTop > angleDeg){

    // if all angles are smaller => no colision	
    }else if(rightTop < angleDeg && rightBottom < angleDeg && leftBottom < angleDeg && leftTop < angleDeg){

    // check if box is on the line width the distance results
    }else if(dist_rightTop > dist_angleDeg && dist_rightBottom > dist_angleDeg && dist_leftBottom > dist_angleDeg && dist_leftTop > dist_angleDeg){

    }else{
      activeLines[i] = i;
      if(deselect){
        activeLines[i] = 0;
      }
    }
  }
  drawCanvasLines(linesData,1,1);
}

function checkPointsForAngle(lineData){
  var xRange0 = lineData[0][0];
  var xRange1 = lineData[1][0];

  var yRange0 = lineData[0][1];
  var yRange1 = lineData[1][1];

  // check if first x value is bigger
  if(lineData[0][0] > lineData[1][0]){
    //xRange0 = lineData[1][0];
    //xRange1 = lineData[0][0];
  }

  // check if first y value is bigger
  if(lineData[0][1] > lineData[1][1]){
    //yRange0 = lineData[1][1];
    //yRange1 = lineData[0][1];
  }
  return ({x0:xRange0,y0:yRange0,x1:xRange1,y1:yRange1});
}
