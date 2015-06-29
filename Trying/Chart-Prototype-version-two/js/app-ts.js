/// <reference path="../libs/jquery.d.ts" />
var linesWidth, linesCount, mouseEvent, canvasWidth, canvasHeight;
var linesData = [];
var contextData;
var mouseX = 0;
var mouseY = 0;
var offsetX;
var offsetY;
var tolerance = 5;
var lineIndex = -1;
var activeLines = [];
var possibleBoundingBoxes = [];
function drawChart(type) {
    if (type == "canvas2d") {
        contextData = initCanvasContext('myCanvas');
        var $canvas = $("#myCanvas");
        var canvasOffset = $canvas.offset();
        offsetX = canvasOffset.left;
        offsetY = canvasOffset.top;
        generateLines();
    }
}
function initCanvasContext(desternation) {
    var c = document.getElementById(desternation);
    return new Array(c.getContext("2d"), c.width, c.height);
}
function drawCanvasPath(preparedData, contextData) {
    var context = contextData[0];
    context.clearRect(0, 0, contextData[1], contextData[2]);
    context.beginPath();
    var data = preparedData;
    for (var i in data) {
        var x1 = data[i].x;
        var y1 = data[i].y;
        context.lineTo(x1, y1);
    }
    context.stroke();
}
function drawCanvasLines(linesData, lineX, lineY) {
    var context = contextData[0];
    context.clearRect(0, 0, contextData[1], contextData[2]);
    context.beginPath();
    context.lineWidth = linesWidth;
    for (var i in linesData) {
        var x0 = linesData[i][0][0];
        var y0 = linesData[i][0][1];
        var x1 = linesData[i][1][0];
        var y1 = linesData[i][1][1];
        context.beginPath();
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.strokeStyle = '#000000';
        //console.log(activeLines);
        if (mouseX && lineX && activeLines[i]) {
            context.strokeStyle = '#FF0000';
        }
        context.stroke();
    }
}
function generateLines() {
    linesData = [];
    for (var i = 0; i < linesCount; i++) {
        var x1 = Math.floor((Math.random() * canvasWidth) + 1);
        var y1 = Math.floor((Math.random() * canvasHeight) + 1);
        var x2 = Math.floor((Math.random() * canvasWidth) + 1);
        var y2 = Math.floor((Math.random() * canvasHeight) + 1);
        linesData.push(new Array(new Array(x1, y1), new Array(x2, y2)));
    }
    drawCanvasLines(linesData, 0, 0);
}
// calculate the point on the line that's 
// nearest to the mouse position
function linepointNearestMouse(line, x, y) {
    var lerp = function (a, b, x) { return (a + x * (b - a)); };
    var dx = line[1][0] - line[0][0];
    var dy = line[1][1] - line[0][1];
    var t = ((x - line[0][0]) * dx + (y - line[0][1]) * dy) / (dx * dx + dy * dy);
    var lineX = lerp(line[0][0], line[1][0], t);
    var lineY = lerp(line[0][1], line[1][1], t);
    return ({ x: lineX, y: lineY });
}
;
// handle mousemove events
// calculate how close the mouse is to the line
// if that distance is less than tolerance then
// display a dot on the line
function handleMousemove(e, action) {
    e.preventDefault();
    e.stopPropagation();
    mouseX = e.clientX - offsetX;
    mouseY = e.clientY - offsetY;
    var boundingHit = 0;
    // check if mouse hits a bounding box
    possibleBoundingBoxes = [];
    for (var i in linesData) {
        var xRange0 = linesData[i][0][0];
        var xRange1 = linesData[i][1][0];
        var yRange0 = linesData[i][0][1];
        var yRange1 = linesData[i][1][1];
        // check if first x value is bigger
        if (linesData[i][0][0] > linesData[i][1][0]) {
            xRange0 = linesData[i][1][0];
            xRange1 = linesData[i][0][0];
        }
        // check if first y value is bigger
        if (linesData[i][0][1] > linesData[i][1][1]) {
            yRange0 = linesData[i][1][1];
            yRange1 = linesData[i][0][1];
        }
        if (mouseX < xRange0 || mouseX > xRange1 || mouseY < yRange0 || mouseY > yRange1) {
            //console.log("no hit for line"+i);
            boundingHit = 0;
            continue;
        }
        boundingHit = 1;
        possibleBoundingBoxes[i] = i;
    }
    if (!boundingHit) {
    }
    if (possibleBoundingBoxes.length > 0) {
        var nearestLineIndex = -1;
        var bestDistance = 999999;
        // check which line is the nearest from the possible ones
        for (var j in possibleBoundingBoxes) {
            var linepoint = linepointNearestMouse(linesData[possibleBoundingBoxes[j]], mouseX, mouseY);
            var dx = mouseX - linepoint.x;
            var dy = mouseY - linepoint.y;
            var distance = Math.abs(Math.sqrt(dx * dx + dy * dy));
            // best distance => nearest line and set index
            if (bestDistance > distance) {
                bestDistance = distance;
                nearestLineIndex = possibleBoundingBoxes[j];
            }
        }
        if (bestDistance < tolerance) {
            if (action == "click") {
                activeLines[nearestLineIndex] = 1;
                if (e.shiftKey) {
                    activeLines[nearestLineIndex] = 0;
                }
            }
            drawCanvasLines(linesData, linepoint.x, linepoint.y);
        }
        else {
        }
    }
}
