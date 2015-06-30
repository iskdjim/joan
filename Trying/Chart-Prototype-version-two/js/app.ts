/// <reference path="../libs/jquery.d.ts" />

var linesWidth,linesCount,mouseEvent,canvasWidth,canvasHeight;
var linesData = [];
var contextData;
var mouseX = 0;
var mouseY = 0;
var offsetX;
var offsetY;
var tolerance=5;
var lineIndex = -1;
var activeLines = [];
var possibleBoundingBoxes = [];

var selectBoxWidth,selectBoxHeight,selectBoxX,selectBoxY,selectBoxActive;

var deselect;

function drawChart(type){
  if(type=="canvas2d"){
  	activeLines=[];
  	contextData = initCanvasContext('myCanvas');
	var $canvas=$("#myCanvas");
	var canvasOffset=$canvas.offset();
	offsetX=canvasOffset.left;
	offsetY=canvasOffset.top;
    generateLines();
    drawCanvasLines(linesData,0,0);
  }else if(type=="svg"){
    generateLines();
    drawSvgLines(linesData, $(".svgHolder"));
  }
}

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
      deselect = 1;
    }
  });

}

function removeBox(e){
  $('#chartWrapper #selectBox').remove();
  if(selectBoxActive){
    selectBoxActive = 0;
    handleBoxSelect();
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

  for(var i=0; i<linesCount;i++){
  	var x1 = Math.floor((Math.random() * canvasWidth) + 1);
  	var y1 = Math.floor((Math.random() * canvasHeight) + 1);
  	var x2 = Math.floor(Math.random()*(canvasHeight-x1+1)+x1);
  	var y2 = Math.floor((Math.random() * canvasHeight) + 1);
  	
    linesData.push(new Array(new Array(x1,y1),new Array(x2,y2)));
  }	 
}

