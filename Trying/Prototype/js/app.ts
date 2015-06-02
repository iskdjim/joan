/// <reference path="../libs/jquery.d.ts" />

declare function simplify(points, tolerance, quality);

var iterationCounter,statsDataFps,statsDataMs,rawData,webGLPoints,linetype,lineWidth;

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
      drawCanvasPath(preparedData, context);
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
  var xRange = 0; // some day its the time value
  var xRangeValue = 0.02;
  var index = 0;
  var highQuality = false;
  var pointsString = "-1.0, 0.0,0.0";
  var lastPointX = 0;
  var lastPointY = 0;

  webGLPoints = new Float32Array(data.length*3);

  if(type == "webgl" && linetype != "line"){
    webGLPoints = new Float32Array(data.length*3*6);
  }
  for(var i in data) {
    if(range < rangeCounter){
      break;
    }

	if(type == "webgl"){
	  if(rangeCounter > 0 && linetype != "line"){
        var pTriangles = new Array();

        pTriangles[0] = new Array(lastPointX,lastPointY);
        pTriangles[1] = new Array(xRange+lineWidth,(data[i].chanels[0].value/50)+lineWidth);	 			
        pTriangles[2] = new Array(xRange,(data[i].chanels[0].value/50));

        pTriangles[3] = new Array(lastPointX,lastPointY);
        pTriangles[4] = new Array(lastPointX+lineWidth,(data[i].chanels[0].value/50)+lineWidth);	 			
        pTriangles[5] = new Array(xRange+lineWidth,(data[i].chanels[0].value/50)+lineWidth);

        for(var j=0;j<pTriangles.length;j++){
          pointsString += ","+pixelToPoints(index,new Array(pTriangles[j][0],pTriangles[j][1]));
          index++;
        }
      }else{
        pointsString += ","+pixelToPoints(i,new Array(xRange,(data[i].chanels[0].value/50)));
        //index++;
      }
	  lastPointX = xRange;
	  lastPointY = (data[i].chanels[0].value/50);
	}else{
      rangedPoints.push({x:xRange, y:(data[i].chanels[0].value/50), time:data[i].time});
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
