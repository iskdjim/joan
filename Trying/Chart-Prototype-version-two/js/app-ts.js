/// <reference path="../libs/jquery.d.ts" />
var linesWidth, linesCount, mouseEvent, canvasWidth, canvasHeight;
var linesData = [];
var webGLLinesData = [];
var contextData;
var mouseX = 0;
var mouseY = 0;
var offsetX;
var offsetY;
var tolerance = 5;
var lineIndex = -1;
var activeLines = [];
var possibleBoundingBoxes = [];
var svgLineIds = [];
var selectBoxWidth, selectBoxHeight, selectBoxX, selectBoxY, selectBoxActive;
var techType;
var deselect;
var webGLPoints;
var triangles = true;
var mousedDownFired = false;
function drawChart(type) {
    techType = type;
    var $chart = $("#chartWrapper");
    var chartOffset = $chart.offset();
    offsetX = chartOffset.left;
    offsetY = chartOffset.top;
    console.log(techType);
    if (techType == "canvas2d") {
        activeLines = [];
        contextData = initCanvasContext('myCanvas');
        generateLines();
        drawCanvasLines(linesData, 0, 0);
    }
    else if (techType == "svg") {
        generateLines();
        drawSvgLines(linesData, $(".svgHolder"));
    }
    else if (techType == "webgl") {
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
function handleBoxSelect(e) {
    if (!e.shiftKey && !e.ctrlKey) {
        activeLines = [];
    }
    var selectedLines = [];
    var foundBounding = 0; // check if point in box
    for (var i in linesData) {
        if (!e.shiftKey && !e.ctrlKey) {
            activeLines[i] = 0;
        }
        if (linesData[i][0][0] > selectBoxX && linesData[i][0][0] < (selectBoxX + selectBoxWidth) && linesData[i][0][1] > selectBoxY && linesData[i][0][1] < (selectBoxY + selectBoxHeight)) {
            activeLines[i] = checkToggleState(e, activeLines[i]);
            continue;
        }
        if (linesData[i][1][0] > selectBoxX && linesData[i][1][0] < (selectBoxX + selectBoxWidth) && linesData[i][1][1] > selectBoxY && linesData[i][1][1] < (selectBoxY + selectBoxHeight)) {
            activeLines[i] = checkToggleState(e, activeLines[i]);
            continue;
        }
        var xyValues = checkPointsForAngle(linesData[i]);
        var x1 = (selectBoxX + selectBoxWidth);
        var y1 = (selectBoxY + selectBoxHeight);
        // calculate the angle for the diffrent box points
        var angleDeg = Math.atan2((xyValues.y1 - xyValues.y0), (xyValues.x1 - xyValues.x0)) * (180 / Math.PI);
        var rightTop = Math.atan2((selectBoxY - xyValues.y0), (x1 - xyValues.x0)) * (180 / Math.PI);
        var rightBottom = Math.atan2((y1) - xyValues.y0, (x1) - xyValues.x0) * 180 / Math.PI;
        var leftBottom = Math.atan2((y1) - xyValues.y0, (selectBoxX) - xyValues.x0) * 180 / Math.PI;
        var leftTop = Math.atan2((selectBoxY) - xyValues.y0, (selectBoxX) - xyValues.x0) * 180 / Math.PI;
        // calculate the distance for the box points
        var dist_angleDeg = Math.sqrt(Math.pow(xyValues.x1 - xyValues.x0, 2) + Math.pow(xyValues.y1 - xyValues.y0, 2));
        var dist_rightTop = Math.sqrt(Math.pow(x1 - xyValues.x0, 2) + Math.pow(selectBoxY - xyValues.y0, 2));
        var dist_rightBottom = Math.sqrt(Math.pow(x1 - xyValues.x0, 2) + Math.pow(y1 - xyValues.y0, 2));
        var dist_leftBottom = Math.sqrt(Math.pow(selectBoxX - xyValues.x0, 2) + Math.pow(y1 - xyValues.y0, 2));
        var dist_leftTop = Math.sqrt(Math.pow(selectBoxX - xyValues.x0, 2) + Math.pow(selectBoxY - xyValues.y0, 2));
        // if x values of boxer are smaller as line x values
        if (x1 < xyValues.x0 && selectBoxX < xyValues.x0) {
        }
        else if (rightTop > angleDeg && rightBottom > angleDeg && leftBottom > angleDeg && leftTop > angleDeg) {
            console.log("angle check 1");
        }
        else if (rightTop < angleDeg && rightBottom < angleDeg && leftBottom < angleDeg && leftTop < angleDeg) {
            console.log("angle check 2");
        }
        else if (dist_rightTop > dist_angleDeg && dist_rightBottom > dist_angleDeg && dist_leftBottom > dist_angleDeg && dist_leftTop > dist_angleDeg) {
            console.log("distance check 1");
        }
        else {
            activeLines[i] = checkToggleState(e, activeLines[i]);
            selectedLines[i] = 1;
            if (deselect) {
                activeLines[i] = 0;
            }
        }
    }
    console.log("Akitve Linien toggle:");
    console.log(activeLines);
    if (techType == "canvas2d") {
        drawCanvasLines(linesData, 1, 1);
    }
    else if (techType == "svg") {
        selectSvgLines(activeLines);
    }
}
function checkToggleState(e, activeLine) {
    if (e.ctrlKey && activeLine == 1) {
        activeLine = 0;
    }
    else {
        activeLine = 1;
    }
    return activeLine;
}
function checkPointsForAngle(lineData) {
    var xRange0 = lineData[0][0];
    var xRange1 = lineData[1][0];
    var yRange0 = lineData[0][1];
    var yRange1 = lineData[1][1];
    // check if first x value is bigger
    if (lineData[0][0] > lineData[1][0]) {
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
    return ({ x0: xRange0, y0: yRange0, x1: xRange1, y1: yRange1 });
}
// create select Box
function createBox(e) {
    $('#chartWrapper').append("<div id='selectBox' class='selectBox'></div>");
    // get start positions of mouse in canvas
    selectBoxX = e.clientX - offsetX;
    selectBoxY = e.clientY - offsetY;
    var selectBoxXCalc = e.clientX - offsetX;
    var selectBoxYCalc = e.clientY - offsetY;
    $('#selectBox').css({ 'left': selectBoxXCalc, 'top': selectBoxYCalc, 'height': '0px', 'width': '0px' });
    $("#chartWrapper").mousemove(function (event) {
        // mousemove position
        var xPositionMouseMove = event.pageX - offsetX;
        var yPositionMouseMove = event.pageY - offsetY;
        // box grows right bottom
        if (xPositionMouseMove > selectBoxXCalc && yPositionMouseMove > selectBoxYCalc) {
            selectBoxWidth = xPositionMouseMove - selectBoxXCalc;
            selectBoxHeight = yPositionMouseMove - selectBoxYCalc;
            $('#selectBox').css({ 'left': selectBoxXCalc, 'top': selectBoxYCalc, 'height': selectBoxHeight, 'width': selectBoxWidth });
            selectBoxX = e.clientX - offsetX;
            selectBoxY = e.clientY - offsetY;
        }
        else if (xPositionMouseMove < selectBoxXCalc && yPositionMouseMove > selectBoxYCalc) {
            selectBoxWidth = selectBoxXCalc - xPositionMouseMove;
            selectBoxHeight = yPositionMouseMove - selectBoxYCalc;
            $('#selectBox').css({ 'left': xPositionMouseMove, 'top': selectBoxYCalc, 'height': selectBoxHeight, 'width': selectBoxWidth });
            selectBoxX = xPositionMouseMove;
            selectBoxY = yPositionMouseMove - selectBoxHeight;
        }
        else if (xPositionMouseMove < selectBoxXCalc && yPositionMouseMove < selectBoxYCalc) {
            selectBoxWidth = selectBoxXCalc - xPositionMouseMove;
            selectBoxHeight = selectBoxYCalc - yPositionMouseMove;
            $('#selectBox').css({ 'left': xPositionMouseMove, 'top': yPositionMouseMove, 'height': selectBoxHeight, 'width': selectBoxWidth });
            selectBoxX = selectBoxXCalc - selectBoxWidth;
            selectBoxY = selectBoxYCalc - selectBoxHeight;
        }
        else if (xPositionMouseMove > selectBoxXCalc && yPositionMouseMove < selectBoxYCalc) {
            selectBoxWidth = xPositionMouseMove - selectBoxXCalc;
            selectBoxHeight = selectBoxYCalc - yPositionMouseMove;
            $('#selectBox').css({ 'left': selectBoxXCalc, 'top': yPositionMouseMove, 'height': selectBoxHeight, 'width': selectBoxWidth });
            selectBoxX = selectBoxXCalc;
            selectBoxY = yPositionMouseMove;
        }
        selectBoxActive = 1;
        deselect = 0;
        if (e.shiftKey) {
        }
    });
}
function removeBox(e) {
    $('#chartWrapper #selectBox').remove();
    if (selectBoxActive) {
        selectBoxActive = 0;
        handleBoxSelect(e);
    }
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
function generateLines() {
    linesData = [];
    if (triangles) {
        webGLPoints = new Float32Array(linesCount * 7 * 6);
    }
    else {
        webGLPoints = new Float32Array(linesCount * 7 * 2);
    }
    var lastPointX = 0;
    var lastPointY = 0;
    var webglwidth = 20;
    for (var i = 0; i < linesCount; i++) {
        var x1 = Math.floor((Math.random() * canvasWidth) + 1);
        var y1 = Math.floor((Math.random() * canvasHeight) + 1);
        var x2 = Math.floor(Math.random() * (canvasWidth - x1 + 1) + x1);
        var y2 = Math.floor((Math.random() * canvasHeight) + 1);
        // web gl triangle points
        if (techType == "webgl") {
            var pTriangles = new Array();
            if (lastPointX == 0 && lastPointY == 0) {
                lastPointX = x1;
                lastPointY = y1;
            }
            pTriangles[0] = new Array(lastPointX, lastPointY);
            pTriangles[1] = new Array(lastPointX + 10, lastPointY);
            pTriangles[2] = new Array(lastPointX, lastPointY + 10);
            pTriangles[3] = new Array(lastPointX + 10, lastPointY);
            pTriangles[4] = new Array(lastPointX + 10, lastPointY + 10);
            pTriangles[5] = new Array(lastPointX, lastPointY + 10);
            //pTriangles[0] = new Array(5,5);
            //pTriangles[1] = new Array(10,5);
            //pTriangles[2] = new Array(5,10);
            //pTriangles[3] = new Array(10,5);
            //pTriangles[4] = new Array(10,10);
            //pTriangles[5] = new Array(5,10);
            for (var j = 0; j < pTriangles.length; j++) {
                linesData.push(new Array(new Array(pTriangles[j][0], pTriangles[j][1])));
            }
        }
        else {
            linesData.push(new Array(new Array(x1, y1), new Array(x2, y2)));
        }
    }
    console.log(linesData);
}
function initCanvasContext(desternation) {
    var c = document.getElementById(desternation);
    return new Array(c.getContext("2d"), c.width, c.height);
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
        //if(mouseX && lineX && activeLines[i]){
        if (lineX && activeLines[i]) {
            context.strokeStyle = '#FF0000';
        }
        context.stroke();
    }
}
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
    if (action == "click" && !e.shiftKey && !e.ctrlKey) {
        activeLines = [];
    }
    // check if mouse hits a bounding box
    possibleBoundingBoxes = [];
    for (var i in linesData) {
        var xyValues = checkPointsForAngle(linesData[i]);
        console.log("mouseX " + mouseX);
        console.log("mouseY " + mouseY);
        console.log("xyValues.x0 " + xyValues.x0);
        console.log("xyValues.x1 " + xyValues.x1);
        console.log("xyValues.y0 " + xyValues.y0);
        console.log("xyValues.y1 " + xyValues.y1);
        if (mouseX < xyValues.x0 || mouseX > xyValues.x1) {
            console.log("no hit for line" + i);
            boundingHit = 0;
            continue;
        }
        if (xyValues.y0 < xyValues.y1) {
            if (mouseY > xyValues.y1 || mouseY < xyValues.y0) {
                console.log("no hit for line" + i);
                boundingHit = 0;
                continue;
            }
        }
        else {
            if (mouseY > xyValues.y0 || mouseY < xyValues.y1) {
                console.log("no hit for line" + i);
                boundingHit = 0;
                continue;
            }
        }
        boundingHit = 1;
        possibleBoundingBoxes[i] = i;
    }
    if (!boundingHit) {
    }
    //console.log(possibleBoundingBoxes);
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
                if (e.ctrlKey && activeLines[nearestLineIndex] == 1) {
                    activeLines[nearestLineIndex] = 0;
                }
                else {
                    activeLines[nearestLineIndex] = 1;
                }
            }
            // check for controll key to toggle the states
            console.log(activeLines);
            //if(e.ctrlKey){
            //  for(var i in linesData){
            //  	if(i != nearestLineIndex){
            //      if(typeof activeLines[i] === 'undefined' || activeLines[i] == "0" || activeLines[i] == "-1"){
            //        activeLines[i] = 1;
            //      }else{
            //        activeLines[i] = 0;
            //      }
            //    }else{
            //     
            //    }
            //  }
            //}
            drawCanvasLines(linesData, linepoint.x, linepoint.y);
        }
    }
}
function drawSvgLines(linesData, target) {
    for (var i in linesData) {
        var x1 = linesData[i][0][0];
        var y1 = linesData[i][0][1];
        var x2 = linesData[i][1][0];
        var y2 = linesData[i][1][1];
        console.log(linesData[i]);
        var newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        newLine.setAttribute('id', 'line_' + i);
        newLine.setAttribute('x1', x1.toString());
        newLine.setAttribute('y1', y1.toString());
        newLine.setAttribute('x2', x2.toString());
        newLine.setAttribute('y2', y2.toString());
        newLine.setAttribute('stroke-width', linesWidth.toString());
        newLine.setAttribute('class', 'normal');
        target.append(newLine);
    }
}
function selectSvgLines(lineIds) {
    $.each(lineIds, function (i, lineId) {
        if (lineId != "-1") {
            $("#line_" + lineId).addClass('active');
        }
        else {
            console.log(i);
            $("#line_" + i).removeClass('active');
        }
    });
}
var canvas, points, linerange;
var pointsData, GL;
var webGLProgramObject, vertexAttribLoc, vVertices, vertexColorAttribute, vertexPosBufferObjekt; // The WebGL-buffer for the triangles
function webglStuff(destination) {
    canvas = document.getElementById(destination);
    try {
        GL = canvas.getContext("experimental-webgl");
    }
    catch (e) { }
    if (!GL) {
        window.alert("Fehler: WebGL-context not found");
    }
    var fragmentShader = getShader(GL, "shader-fs");
    var vertexShader = getShader(GL, "shader-vs");
    webGLProgramObject = GL.createProgram();
    GL.attachShader(webGLProgramObject, fragmentShader);
    GL.attachShader(webGLProgramObject, vertexShader);
    // Shader-program-object is complete and has to be linked
    GL.linkProgram(webGLProgramObject);
    // it is posible to use more than one shader program, so tell the program which one should be used
    GL.useProgram(webGLProgramObject);
    // background color
    GL.clearColor(255.0, 255.0, 255.0, 1.0);
    // delete background
    GL.clear(GL.COLOR_BUFFER_BIT);
    // Conntection between javascript and the shader-attribut
    vertexColorAttribute = GL.getAttribLocation(webGLProgramObject, "aVertexColor");
    vertexAttribLoc = GL.getAttribLocation(webGLProgramObject, "vPosition");
}
function drawWebGlLines(data) {
    vVertices = data;
    console.log(vVertices);
    // create buffer...GPU
    vertexPosBufferObjekt = GL.createBuffer();
    // ...and set as active object
    GL.bindBuffer(GL.ARRAY_BUFFER, vertexPosBufferObjekt);
    // give array data to active buffer
    GL.bufferData(GL.ARRAY_BUFFER, vVertices, GL.STATIC_DRAW);
    var itemSize = 7; // x,y,z + r,g,b,a
    var drawCount = vVertices.length / itemSize;
    var step = Float32Array.BYTES_PER_ELEMENT;
    var total = 3 + 4;
    var stride = step * total;
    GL.vertexAttribPointer(vertexAttribLoc, 3, GL.FLOAT, false, stride, 0);
    GL.vertexAttribPointer(vertexColorAttribute, 4, GL.FLOAT, false, stride, step * 3);
    GL.enableVertexAttribArray(vertexAttribLoc);
    GL.enableVertexAttribArray(vertexColorAttribute);
    if (triangles) {
        GL.drawArrays(GL.TRIANGLES, 0, drawCount);
    }
    else {
        GL.drawArrays(GL.LINES, 0, drawCount);
    }
}
function getShader(GL, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }
    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }
    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = GL.createShader(GL.FRAGMENT_SHADER);
    }
    else if (shaderScript.type == "x-shader/x-vertex") {
        shader = GL.createShader(GL.VERTEX_SHADER);
    }
    else {
        return null;
    }
    GL.shaderSource(shader, str);
    GL.compileShader(shader);
    if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
        alert(GL.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}
function generateWebGLLines() {
    var pixelPointRelation = 2 / canvasWidth; // 2 => wegbl coords from -1 to 1	
    for (var i in linesData) {
        var x0 = linesData[i][0][0];
        var y0 = linesData[i][0][1];
        var x1 = linesData[i][1][0];
        var y1 = linesData[i][1][1];
        // get webgl coordinates
        var x0PointCoordinate = pixelToPointCoordinate(pixelPointRelation, x0);
        var y0PointCoordinate = pixelToPointCoordinate(pixelPointRelation, y0);
        var x1PointCoordinate = pixelToPointCoordinate(pixelPointRelation, x1);
        var y1PointCoordinate = pixelToPointCoordinate(pixelPointRelation, y1);
        webGLLinesData[i] = new Array(new Array(x0PointCoordinate, y0PointCoordinate), new Array(x1PointCoordinate, y1PointCoordinate));
        // needed for index of points array	
        if (i == 0) {
            var firstIndex = 0;
            var secondIndex = 1;
        }
        else {
            var firstIndex = (parseInt(i) * 2);
            var secondIndex = (parseInt(i) * 2 + 1);
        }
        prepareWebGLData(webGLLinesData[i][0], firstIndex);
        prepareWebGLData(webGLLinesData[i][1], secondIndex);
    }
}
function generateWebGLTriangles() {
    var pixelPointRelation = 2 / canvasWidth; // 2 => wegbl coords from -1 to 1	
    for (var i in linesData) {
        var x0 = linesData[i][0][0];
        var y0 = linesData[i][0][1];
        // get webgl coordinates
        var x0PointCoordinate = pixelToPointCoordinate(pixelPointRelation, x0);
        var y0PointCoordinate = pixelToPointCoordinate(pixelPointRelation, y0);
        webGLLinesData[i] = new Array(new Array(x0PointCoordinate, y0PointCoordinate));
        prepareWebGLData(webGLLinesData[i][0], i);
    }
}
function prepareWebGLData(xyPoints, index) {
    webGLPoints[(index * 7)] = xyPoints[0];
    webGLPoints[(index * 7) + 1] = xyPoints[1];
    webGLPoints[(index * 7) + 2] = 0; // z
    webGLPoints[(index * 7) + 3] = 0; // r
    webGLPoints[(index * 7) + 4] = 1; // g
    webGLPoints[(index * 7) + 5] = 0; // b
    webGLPoints[(index * 7) + 6] = 1; // alpha
}
function pixelToPointCoordinate(pixelPointRelation, pixelPoint) {
    var point = pixelPointRelation * pixelPoint;
    // check if in the -1 or 1 area
    if (point < 1) {
        point = point * -1;
    }
    else {
        point = point - 1;
    }
    return point;
}
