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

function drawChart(type){
  if(type=="canvas2d"){
  	contextData = initCanvasContext('myCanvas');
	var $canvas=$("#myCanvas");
	var canvasOffset=$canvas.offset();
	offsetX=canvasOffset.left;
	offsetY=canvasOffset.top;
    generateLines();
  }
}