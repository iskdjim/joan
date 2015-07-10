/// <reference path="../libs/jquery.d.ts" />

var linesWidth,linesCount,mouseEvent,canvasWidth,canvasHeight;
var linesData = [];
var linesDataDraw = [];
var webGLLinesData = [];
var contextData;
var mouseX = 0;
var mouseY = 0;
var offsetX;
var offsetY;
var tolerance=5;
var lineIndex = -1;
var activeLines = [];
var possibleBoundingBoxes = [];
var svgLineIds = [];
var selectBoxWidth,selectBoxHeight,selectBoxX,selectBoxY,selectBoxActive;
var techType;
var deselect;
var webGLPoints;
var triangles = true;
 var mousedDownFired = false;

function drawChart(type){
  techType = type;
  var $chart=$("#chartWrapper");
  var chartOffset=$chart.offset();
  offsetX=chartOffset.left;
  offsetY=chartOffset.top;
  activeLines=[];
  linesDataDraw = [];
  linesData = [];
 
  if(techType=="canvas2d"){
  	contextData = initCanvasContext('myCanvas');
    generateLines();
    drawCanvasLines(linesData,0,0);
  }else if(techType=="svg"){	
    generateLines();
    drawSvgLines(linesData, $(".svgHolder"));
  }else if(techType=="webgl"){
    generateLines();
    
    if(triangles){
      generateWebGLTriangles();    	
    }else{
      generateWebGLLines();	
    }

    drawWebGlLines(webGLPoints);
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
  
  // reset boundig box
  if(action == 'click'){
    $('#selectBox').css({'left':'0px', 'top':'0px','height': '0px', 'width': '0px'});	
  }

  var boundingHit = 0;
  if(action == "click" && !e.shiftKey && !e.ctrlKey){
  	activeLines = [];
  	linesDataDraw = [];
  }
 
  // check if mouse hits a bounding box
  possibleBoundingBoxes = [];
  for(var i in linesData){
    if(action == "click" && !e.shiftKey && !e.ctrlKey){
      activeLines[i] = 0;	
    }
    var xyValues = checkPointsForAngle(linesData[i]);

    if(mouseX<xyValues.x0 || mouseX>xyValues.x1){
      //console.log("X: no hit for line"+i);
	  boundingHit = 0;
	  continue;
	}
	
	if(xyValues.y0 < xyValues.y1){
	  if(mouseY>xyValues.y1 || mouseY<xyValues.y0){
        //console.log("Y: no hit for line"+i);
	    boundingHit = 0;
	    continue;
	  }
	}else{
	  if(mouseY>xyValues.y0 || mouseY<xyValues.y1){
        //console.log("Y: no hit for line"+i);
	    boundingHit = 0;
	    continue;
	  }	
	}
	
	  boundingHit = 1;
	  possibleBoundingBoxes[i] = i;

	}

    //console.log(possibleBoundingBoxes);
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
	      if(e.ctrlKey && activeLines[nearestLineIndex] == 1){
	        activeLines[nearestLineIndex] = 0;	
	      }else{
	  	    activeLines[nearestLineIndex] = 1;
	  	  }
	  	 
	    }
	  }

	  if(techType=="canvas2d"){
	    drawCanvasLines(linesData,linepoint.x,linepoint.y);
	  }else if(techType=="svg"){
	    selectSvgLines(activeLines);
	  }else if(techType=="webgl"){  	
        $.each(activeLines, function(i, value){
	      if(value){
	        console.log("line found"+i);
	        console.log("set Color red");
	        for(var j=(6*i);j<(6*i+6);j++){
	          webGLPoints[(j*7)+3] = 1; // r
	        }
	      }else{
	        for(var j=(6*i);j<(6*i+6);j++){
	          webGLPoints[(j*7)+3] = 0; // r
	        }
	      }
	    });
        drawWebGlLines(webGLPoints);
	  }
  }
}



// handle mousemove events
// calculate how close the mouse is to the line
// if that distance is less than tolerance then
// display a dot on the line
function handleBoxSelect(e){
	
  if(!e.shiftKey && !e.ctrlKey){
  	activeLines = [];
  }
  
  var selectedLines = [];
  
  var foundBounding = 0; // check if point in box
  for(var i in linesData){
  	if(!e.shiftKey && !e.ctrlKey){
  	  activeLines[i] = 0;
  	}
    if(linesData[i][0][0] > selectBoxX && linesData[i][0][0] < (selectBoxX+selectBoxWidth) && linesData[i][0][1] > selectBoxY && linesData[i][0][1] < (selectBoxY+selectBoxHeight)){
      activeLines[i] = checkToggleState(e,activeLines[i])
      continue;
    }

    if(linesData[i][1][0] > selectBoxX && linesData[i][1][0] < (selectBoxX+selectBoxWidth) && linesData[i][1][1] > selectBoxY && linesData[i][1][1] < (selectBoxY+selectBoxHeight)){
      activeLines[i] = checkToggleState(e,activeLines[i])
      continue;
    }

    var xyValues = checkPointsForAngle(linesData[i]);

    var x1 = (selectBoxX+selectBoxWidth);
    var y1 = (selectBoxY+selectBoxHeight);

    // calculate the angle for the diffrent box points
    var angleDeg = Math.atan2((xyValues.y1 - xyValues.y0),(xyValues.x1 - xyValues.x0)) * (180 / Math.PI);
    
    var rightTop = Math.atan2((selectBoxY - xyValues.y0),(x1 - xyValues.x0)) * (180 / Math.PI);
    var rightBottom = Math.atan2((y1) - xyValues.y0, (x1) - xyValues.x0) * 180 / Math.PI;
    var leftBottom = Math.atan2((y1) - xyValues.y0, (selectBoxX)-xyValues.x0) * 180 / Math.PI;
    var leftTop = Math.atan2((selectBoxY) - xyValues.y0, (selectBoxX)-xyValues.x0) * 180 / Math.PI;  

    // calculate the distance for the box points
    var dist_angleDeg = Math.sqrt(Math.pow(xyValues.x1 - xyValues.x0,2) + Math.pow(xyValues.y1 - xyValues.y0,2));
    var dist_rightTop = Math.sqrt(Math.pow(x1 - xyValues.x0,2) + Math.pow(selectBoxY - xyValues.y0,2));
    var dist_rightBottom = Math.sqrt(Math.pow(x1 - xyValues.x0,2) + Math.pow(y1 - xyValues.y0,2));
    var dist_leftBottom = Math.sqrt(Math.pow(selectBoxX - xyValues.x0,2) + Math.pow(y1 - xyValues.y0,2));
    var dist_leftTop = Math.sqrt(Math.pow(selectBoxX - xyValues.x0,2) + Math.pow(selectBoxY - xyValues.y0,2));


	// if x values of boxer are smaller as line x values
	if(x1 < xyValues.x0 && selectBoxX < xyValues.x0){

    // if all angles are bigger => no colision  
    }else if(rightTop > angleDeg && rightBottom > angleDeg && leftBottom > angleDeg && leftTop > angleDeg){
		console.log("angle check 1");
    // if all angles are smaller => no colision	
    }else if(rightTop < angleDeg && rightBottom < angleDeg && leftBottom < angleDeg && leftTop < angleDeg){
		console.log("angle check 2");
    // check if box is on the line width the distance results
    }else if(dist_rightTop > dist_angleDeg && dist_rightBottom > dist_angleDeg && dist_leftBottom > dist_angleDeg && dist_leftTop > dist_angleDeg){
      console.log("distance check 1");
     
    //}else if(dist_rightTop < dist_angleDeg && dist_rightBottom < dist_angleDeg && dist_leftBottom < dist_angleDeg && dist_leftTop < dist_angleDeg){  
    //   console.log("distance check 2");   	
    }else{   
      activeLines[i] = checkToggleState(e,activeLines[i])

      selectedLines[i] = 1;
	  if(deselect){
        activeLines[i] = 0;
      }
    }
  }

  if(techType=="canvas2d"){
    drawCanvasLines(linesData,1,1);
  }else if(techType=="svg"){
    selectSvgLines(activeLines);
  }else if(techType=="webgl"){
  	console.log(activeLines);
    $.each(activeLines, function(i, value){
	  if(value){
	    console.log("web gl active line: "+i);
	    console.log("set Color red");
	    for(var j=(6*i);j<(6*i+6);j++){
	      webGLPoints[(j*7)+3] = 1; // r
	    }
	  }else{
	  	 for(var j=(6*i);j<(6*i+6);j++){
	      webGLPoints[(j*7)+3] = 0; // r
	    }
	  }
	});
    drawWebGlLines(webGLPoints);
  }
}

function checkToggleState(e,activeLine){
  if(e.ctrlKey && activeLine == 1){
    activeLine = 0;	
  }else{
    activeLine = 1;
  }
  return activeLine
}

function checkPointsForAngle(lineData){
  var xRange0 = lineData[0][0];
  var xRange1 = lineData[1][0];
  var yRange0 = lineData[0][1];
  var yRange1 = lineData[1][1];

  // check if first x value is bigger
  if(lineData[0][0] > lineData[1][0]){
    xRange0 = lineData[1][0];
    xRange1 = lineData[0][0];
    yRange0 = lineData[1][1];
    yRange1 = lineData[0][1];    
  }

  // check if first y value is bigger
  //if(lineData[0][1] > lineData[1][1]){
  //  yRange0 = lineData[1][1];
  //  yRange1 = lineData[0][1];
  //}
  return ({x0:xRange0,y0:yRange0,x1:xRange1,y1:yRange1});
}

// create select Box
function createBox(e){
  $('#chartWrapper').append("<div id='selectBox' class='selectBox'></div>");

  // get start positions of mouse in canvas
  selectBoxX = e.clientX-offsetX;
  selectBoxY = e.clientY-offsetY;

  var selectBoxXCalc = e.clientX-offsetX;
  var selectBoxYCalc = e.clientY-offsetY;
  $('#selectBox').css({'left': selectBoxXCalc, 'top': selectBoxYCalc ,'height': '0px', 'width': '0px'});	
  $("#chartWrapper").mousemove(function(event){
    // mousemove position
    var xPositionMouseMove = event.pageX-offsetX;
    var yPositionMouseMove = event.pageY-offsetY;

    // box grows right bottom
	if(xPositionMouseMove > selectBoxXCalc && yPositionMouseMove > selectBoxYCalc){
	  selectBoxWidth = xPositionMouseMove-selectBoxXCalc;
	  selectBoxHeight = yPositionMouseMove-selectBoxYCalc;
	  $('#selectBox').css({'left': selectBoxXCalc, 'top': selectBoxYCalc ,'height': selectBoxHeight, 'width': selectBoxWidth});
	  selectBoxX = e.clientX-offsetX;
      selectBoxY = e.clientY-offsetY;

    // box grows left bottom
	}else if(xPositionMouseMove < selectBoxXCalc && yPositionMouseMove > selectBoxYCalc){
	  selectBoxWidth = selectBoxXCalc-xPositionMouseMove;
	  selectBoxHeight = yPositionMouseMove-selectBoxYCalc;
	  $('#selectBox').css({'left': xPositionMouseMove, 'top': selectBoxYCalc, 'height': selectBoxHeight, 'width': selectBoxWidth});
	  selectBoxX = xPositionMouseMove;
      selectBoxY = yPositionMouseMove-selectBoxHeight;

	// box grows up left
	}else if(xPositionMouseMove < selectBoxXCalc && yPositionMouseMove < selectBoxYCalc){
	  selectBoxWidth = selectBoxXCalc-xPositionMouseMove;
	  selectBoxHeight = selectBoxYCalc-yPositionMouseMove;
	  $('#selectBox').css({'left': xPositionMouseMove, 'top': yPositionMouseMove, 'height': selectBoxHeight, 'width': selectBoxWidth});
	  selectBoxX = selectBoxXCalc-selectBoxWidth;
      selectBoxY = selectBoxYCalc-selectBoxHeight;

	// box grows up right
	}else if(xPositionMouseMove > selectBoxXCalc && yPositionMouseMove < selectBoxYCalc){
	  selectBoxWidth = xPositionMouseMove-selectBoxXCalc;
	  selectBoxHeight = selectBoxYCalc-yPositionMouseMove;
	  $('#selectBox').css({'left': selectBoxXCalc, 'top': yPositionMouseMove ,'height': selectBoxHeight, 'width': selectBoxWidth});
	  selectBoxX = selectBoxXCalc;
      selectBoxY = yPositionMouseMove;	
	}

    selectBoxActive = 1;
    deselect = 0;
    if(e.shiftKey) {
      //deselect = 1;
    }
  });

}

function removeBox(e){
  $('#chartWrapper #selectBox').remove();
  if(selectBoxActive){
    selectBoxActive = 0;
    handleBoxSelect(e);
  }
}


// calculate the point on the line that's 
// nearest to the mouse position
function linepointNearestMouse(line,x,y) {
  var lerp=function(a,b,x){ return(a+x*(b-a)); };
  var dx=line[1][0]-line[0][0];
  var dy=line[1][1]-line[0][1];
  var t=((x-line[0][0])*dx+(y-line[0][1])*dy)/(dx*dx+dy*dy);
  var lineX=lerp(line[0][0], line[1][0], t);
  var lineY=lerp(line[0][1], line[1][1], t);
  return ({x:lineX,y:lineY});
};

function generateLines(){
  linesData,linesDataDraw = [];


  if(triangles){
    webGLPoints = new Float32Array(linesCount*7*6);
  }else{
    webGLPoints = new Float32Array(linesCount*7*2);  	
  }
  var lastPointX = 0;
  var lastPointY = 0;
  var webglwidth = 20;
  for(var i=0; i<linesCount;i++){
  	var x1 = Math.floor((Math.random() * canvasWidth) + 1);
  	var y1 = Math.floor((Math.random() * canvasHeight) + 1);
  	var x2 = Math.floor(Math.random()*(canvasWidth-x1+1)+x1);
  	var y2 = Math.floor((Math.random() * canvasHeight) + 1);
  	
  	// web gl triangle points
  	if(triangles && techType=="webgl"){
  		var pTriangles = new Array();
  		if(lastPointX == 0 && lastPointY == 0){
  			lastPointX = x1;
  			lastPointY = y1;
  		}

  		var lineWidth = linesWidth;
  	
        var angleforLineWidth = Math.atan2((y2 - y1),(x2 - x1)) * (180 / Math.PI);
        console.log(angleforLineWidth);
        var xWidthValue = lineWidth;
        var yWidthValue = lineWidth;
        // minus angle => y2 > y1
        // generate x,y position for vertikal lines
        if(angleforLineWidth < 0){
        	xWidthValue = (5/90)*(Math.abs(angleforLineWidth));
        	yWidthValue = lineWidth;
        }else{
        	xWidthValue = (5/90)*(Math.abs(angleforLineWidth));
        	yWidthValue = lineWidth*-1;
        }
		var angleValue = 1;

        pTriangles[0] = new Array(x1+xWidthValue,y1+yWidthValue);
        pTriangles[1] = new Array(x2+xWidthValue,y2+yWidthValue);
        pTriangles[2] = new Array(x2,y2);

        pTriangles[3] = new Array(x1+xWidthValue,y1+yWidthValue);
        pTriangles[4] = new Array(x2,y2);
        pTriangles[5] = new Array(x1,y1);
       
        //pTriangles[0] = new Array(5,5);
        //pTriangles[1] = new Array(10,5);
        //pTriangles[2] = new Array(5,10);

        //pTriangles[3] = new Array(10,5);
        //pTriangles[4] = new Array(10,10);
        //pTriangles[5] = new Array(5,10);
        
        for(var j=0;j<pTriangles.length;j++){
           linesDataDraw.push(new Array(new Array(pTriangles[j][0],pTriangles[j][1])));
        }
           linesData.push(new Array(new Array(x1,y1),new Array(x2,y2)));
  	}else{
  	  linesData.push(new Array(new Array(x1,y1),new Array(x2,y2)));
  	}
  }	 
}


