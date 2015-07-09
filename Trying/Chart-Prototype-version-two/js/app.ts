/// <reference path="../libs/jquery.d.ts" />

var linesWidth,linesCount,mouseEvent,canvasWidth,canvasHeight;
var linesData = [];
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
  console.log(techType);

  if(techType=="canvas2d"){
  	activeLines=[];
  	contextData = initCanvasContext('myCanvas');
    generateLines();
    drawCanvasLines(linesData,0,0);
  }else if(techType=="svg"){
    generateLines();
    drawSvgLines(linesData, $(".svgHolder"));
  }else if(techType=="webgl"){
    generateLines();
    //generateWebGLLines();
    generateWebGLTriangles();
    drawWebGlLines(webGLPoints);
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
  
  for(var i in linesData){
    if(linesData[i][0][0] > selectBoxX && linesData[i][0][0] < (selectBoxX+selectBoxWidth) && linesData[i][0][1] > selectBoxY && linesData[i][0][1] < (selectBoxY+selectBoxHeight)){
      activeLines[i] = i;
      selectedLines[i] = 1;
      if(deselect){
        activeLines[i] = -1;
      }
    }

    if(linesData[i][1][0] > selectBoxX && linesData[i][1][0] < (selectBoxX+selectBoxWidth) && linesData[i][1][1] > selectBoxY && linesData[i][1][1] < (selectBoxY+selectBoxHeight)){
      activeLines[i] = i;
      selectedLines[i] = 1;
	      if(deselect){
        activeLines[i] = -1;
      }
    }

    var xyValues = checkPointsForAngle(linesData[i]);

    var x1 = (selectBoxX+selectBoxWidth);
    var y1 = (selectBoxY+selectBoxHeight);
	console.log("selectBoxY"+selectBoxY);
	console.log("x1"+x1);
	console.log(xyValues.y0);

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

                        
      activeLines[i] = i;
      selectedLines[i] = 1;
	  if(deselect){
	  	console.log("deselect");
        activeLines[i] = -1;
      }
    }
  }
  
  console.log(activeLines);
  console.log("--------------------");
  console.log(selectedLines);
    
  if(e.ctrlKey){
    for(var i in linesData){

      if(selectedLines[i] != 1){
		  if(typeof activeLines[i] === 'undefined' || activeLines[i] == "0" || activeLines[i] == "-1"){
		    activeLines[i] = 1;
		  }else{
		    activeLines[i] = 0;
		  }
	  }
    }
  }

  if(techType=="canvas2d"){
    drawCanvasLines(linesData,1,1);
  }else if(techType=="svg"){
    selectSvgLines(activeLines);
  }
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
  linesData = [];


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
  	if(techType=="webgl"){
  		var pTriangles = new Array();
  		if(lastPointX == 0 && lastPointY == 0){
  			lastPointX = x1;
  			lastPointY = y1;
  		}

        pTriangles[0] = new Array(lastPointX,lastPointY);
        pTriangles[1] = new Array(lastPointX+10,lastPointY);
        pTriangles[2] = new Array(lastPointX,lastPointY+10);

        pTriangles[3] = new Array(lastPointX+10,lastPointY);
        pTriangles[4] = new Array(lastPointX+10,lastPointY+10);
        pTriangles[5] = new Array(lastPointX,lastPointY+10);
       
        //pTriangles[0] = new Array(5,5);
        //pTriangles[1] = new Array(10,5);
        //pTriangles[2] = new Array(5,10);

        //pTriangles[3] = new Array(10,5);
        //pTriangles[4] = new Array(10,10);
        //pTriangles[5] = new Array(5,10);
        
        for(var j=0;j<pTriangles.length;j++){
           linesData.push(new Array(new Array(pTriangles[j][0],pTriangles[j][1])));
        }
  	}else{
  	  linesData.push(new Array(new Array(x1,y1),new Array(x2,y2)));
  	}
  }	 
  console.log(linesData);
}


