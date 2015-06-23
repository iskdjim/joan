/// <reference path="../libs/jquery.d.ts" />

declare function simplify(points, tolerance, quality);

var iterationCounter,statsDataFps,statsDataMs,rawData,webGLPoints,linetype,lineWidth,mouseEvent,lineDetect;
var polygoneLinePoints = new Array();
var xValueRange = 0.02;
var canvasLineWidth = 1;
var zoomFaktor = 1;
var pointDivisor = 50;
var startIndex = 0;
var endIndex;
var isZoom = false;
var zoomCount = 1;
var xAxeStart = 0;
var xAxeStep = 60;

function doDrawing(type){
  iterationCounter = 0;
  statsDataFps = new Array();
  statsDataMs = new Array();
  drawChart(type);
  showStats(statsDataFps,statsDataMs);
};

function drawChart (type) {
  var iterations = $('#iterations').val();
  var simplifyOptions = new Array();

  if($('#tolerance').val() != "0"){
    var simplifyOptions = new Array(true,$('#tolerance').val());
  }

  // create Data for draw actions
  var preparedData = prepareData(rawData,type,$('#limitLines').val(),simplifyOptions);
  
  $('#counterSimply').html((preparedData.length-1).toString());

  // iteractions for drawing
  while(iterations > iterationCounter){
    var t0 = performance.now();
    var linePoints = new Array(new Array(0,0));

    iterationCounter++;
    $("#container").empty();

    if(type == "svg"){
      if($('#drawType').val() == "lines"){
        drawSvgLines(preparedData, $("#container"));
      }else{
        drawSvgPath(preparedData, $("#container"));
      }
    }else if(type == "canvas"){
      var context = initCanvasContext('myCanvas');
      if($('#drawType').val() == "lines"){
        drawCanvasLines(preparedData, context);
      }else{
        drawCanvasPath(preparedData, context);
      }
    }else{
      drawWebGlLines(preparedData);
    }

    // stats stuff
    var t1 = performance.now();
    var fpsValue = requestAnimFrame();
    statsDataFps.push(fpsValue);
    statsDataMs.push(t1 - t0);

  }
}

function prepareData(data,type,range,simplifyOptions){

  var rangedPoints = new Array();
  var rangeCounter = 0;
  var xRange = -1; // some day its the time value
  var xRangeValue = xValueRange*zoomFaktor;
  polygoneLinePoints = new Array();  
  var index = 0;
  var highQuality = false;
  var pointsString = "-1.0, 0.0, 0.0";
  var lastPointX = 0;
  var lastPointY = 0;

  webGLPoints = new Float32Array(range*7);

  if(type == "webgl" && linetype != "line"){
    webGLPoints = new Float32Array(range*7*6);

    // no left data     
    if(startIndex < 0){
  	  var newStart = ((startIndex/10)*-5)*xRangeValue;
      xRange = xRange+newStart;
      endIndex = 100;
    }
  }

  

  for(var i in data) {
    if(range < rangeCounter){
      break;
    }
    
    if(i < startIndex || i > endIndex){
    	continue;
    }


	if(type == "webgl"){
	  if(rangeCounter > 0 && linetype != "line"){
        var pTriangles = new Array();

        pTriangles[0] = new Array(lastPointX,lastPointY);
        pTriangles[1] = new Array(xRange,(data[i].chanels[0].value/pointDivisor));
        pTriangles[2] = new Array(lastPointX,lastPointY+lineWidth);

        pTriangles[3] = new Array(lastPointX,lastPointY+lineWidth);
        pTriangles[4] = new Array(xRange,(data[i].chanels[0].value/pointDivisor));
        pTriangles[5] = new Array(xRange,(data[i].chanels[0].value/pointDivisor)+lineWidth);

        polygoneLinePoints.push(new Array(pTriangles[0],pTriangles[1],pTriangles[2],pTriangles[3],pTriangles[4],pTriangles[5], index));
        
        for(var j=0;j<pTriangles.length;j++){
        	if(isZoom){
        	  pointsString += ","+pixelToPointsNew(index,new Array(pTriangles[j][0],pTriangles[j][1]));     
        	}else{
              pointsString += ","+pixelToPoints(index,new Array(pTriangles[j][0],pTriangles[j][1]));       	  
        	}

          index++;
        }
        lastPointX = pTriangles[4][0];
	    lastPointY = pTriangles[4][1];
              
      }else{
      	//polygoneLinePoints.push(new Array(0,0,0,0,0,0, index));
      	if(isZoom){
          pointsString += ","+pixelToPointsNew(i,new Array(xRange,(data[i].chanels[0].value/pointDivisor)));
        }else{
          pointsString += ","+pixelToPoints(i,new Array(xRange,(data[i].chanels[0].value/pointDivisor)));
        }
        //index++;
        lastPointX = xRange;
	    lastPointY = (data[i].chanels[0].value/pointDivisor);
      }

	}else{
      rangedPoints.push({x:xRange, y:(data[i].chanels[0].value/pointDivisor), time:data[i].time});
    }
    rangeCounter++;
    xRange += xRangeValue;

  }

  if(type == "webgl"){
  	return webGLPoints;
  }

  if(simplifyOptions[0]){
  	data = simplify(rangedPoints, simplifyOptions[1], highQuality);
  }else{
    data = rangedPoints;
  }

  return data;
}

var outputUpdate = function(val){
  $('#limitLines').val(val);
}

var fps;
var lastCalledTime;

// fps stats stuff
function requestAnimFrame() {

  if(!lastCalledTime) {
    lastCalledTime = Date.now();
    fps = 0;
    return 66;
  }
  var delta = (new Date().getTime() - lastCalledTime)/1000;
  lastCalledTime = Date.now();
  fps = 1/delta;
  if(fps == "Infinity"){
  	fps=66;
  }else if(fps > 66){
  	fps=66;
  }
  return fps;
}

function showStats(statsDataFps,statsDataMs){
  var fps = 0;
  var ms = 0;
  var data = statsDataFps;
  for(var i in data) {
    if(i>0){
      fps = fps+data[i];
      ms = ms+statsDataMs[i];
    }
  }

  var fpsAv = fps/($('#iterations').val()-1);
  var msAv = ms/($('#iterations').val()-1);

  $('#averageFps').html((Math.round(fpsAv * 100) / 100).toString());
  $('#averageMs').html((Math.round(msAv * 100) / 100).toString());
  //var sumMs = msAv*$('#iterations').val();
  //$('#sumMs').html(sumMs.toString());
}

function checkMouseHit(target,e){
  var offset = target.offset();
  var mouse_x = e.pageX - offset.left;
  var mouse_y = e.pageY - offset.top;

  var x_reach = 600; 

  if(mouse_x < (x_reach/2)){
  	mouse_x = ((100/(x_reach/2))*mouse_x)*(-0.01);
  	mouse_x = (1+mouse_x)*-1;
  }else if(mouse_x == 0){
  	mouse_x = 0;
  }else{
  	mouse_x = (100/(x_reach/2))*(mouse_x-(x_reach/2))*(0.01);
  }

  $.each(polygoneLinePoints, function(i, val){
    if(mouse_x > val[0][0] && mouse_x < val[1][0] && mouse_y > val[0][1] && mouse_y < val[5][1]){
      var index = (i*6);
      //console.log("hit for line:"+(i+1));
      $.each(val, function(j, points){
        if(j < 6){
          webGLPoints[((index+j)*7)+3] = 1;
	      webGLPoints[((index+j)*7)+4] = 0;
	      webGLPoints[((index+j)*7)+5] = 0;
	      webGLPoints[((index+j)*7)+6] = 1;
        }
      });
    }else{
      //console.log("no hit for line:"+(i+1));
    }
  });

}

function xAxeLabel(){
      	console.log(xAxeStart);
  for(var i=0;i<10;i++){ 	
  	var labelValue = (xAxeStart)+(i*(xAxeStep/zoomCount)); // start value * zoom faktor + steps with zoop faktor half
    $('#x'+i).html("<span>"+Math.round(labelValue)+"</span>");
  }
}