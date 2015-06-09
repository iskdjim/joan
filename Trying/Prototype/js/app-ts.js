/// <reference path="../libs/jquery.d.ts" />
var iterationCounter, statsDataFps, statsDataMs, rawData, webGLPoints, linetype, lineWidth, mouseEvent;
var polygoneLinePoints = new Array();
function doDrawing(type) {
    iterationCounter = 0;
    statsDataFps = new Array();
    statsDataMs = new Array();
    drawChart(type);
    showStats(statsDataFps, statsDataMs);
}
;
function drawChart(type) {
    var iterations = $('#iterations').val();
    var simplifyOptions = new Array();
    if ($('#tolerance').val() != "0") {
        var simplifyOptions = new Array(true, $('#tolerance').val());
    }
    // create Data for draw actions
    var preparedData = prepareData(rawData, type, $('#limitLines').val(), simplifyOptions);
    $('#counterSimply').html((preparedData.length - 1).toString());
    // iteractions for drawing
    while (iterations > iterationCounter) {
        var t0 = performance.now();
        var linePoints = new Array(new Array(0, 0));
        iterationCounter++;
        $("#container").empty();
        if (type == "svg") {
            if ($('#drawType').val() == "lines") {
                drawSvgLines(preparedData, $("#container"));
            }
            else {
                drawSvgPath(preparedData, $("#container"));
            }
        }
        else if (type == "canvas") {
            var context = initCanvasContext('myCanvas');
            drawCanvasPath(preparedData, context);
        }
        else {
            drawWebGlLines(preparedData);
        }
        // stats stuff
        var t1 = performance.now();
        var fpsValue = requestAnimFrame();
        statsDataFps.push(fpsValue);
        statsDataMs.push(t1 - t0);
    }
}
function prepareData(data, type, range, simplifyOptions) {
    var rangedPoints = new Array();
    var rangeCounter = 0;
    var xRange = 0; // some day its the time value
    var xRangeValue = 25;
    polygoneLinePoints = new Array();
    var index = 0;
    var highQuality = false;
    var pointsString = "-1.0, 0.0, 0.0";
    var lastPointX = 0;
    var lastPointY = 0;
    webGLPoints = new Float32Array(data.length * 7);
    if (type == "webgl" && linetype != "line") {
        webGLPoints = new Float32Array(data.length * 7 * 6);
    }
    for (var i in data) {
        if (range < rangeCounter) {
            break;
        }
        if (type == "webgl") {
            if (rangeCounter > 0 && linetype != "line") {
                var pTriangles = new Array();
                pTriangles[0] = new Array(lastPointX, lastPointY - lineWidth);
                pTriangles[1] = new Array(xRange, (data[i].chanels[0].value / 50));
                pTriangles[2] = new Array(xRange, (data[i].chanels[0].value / 50) - lineWidth);
                pTriangles[3] = new Array(lastPointX, lastPointY - lineWidth);
                pTriangles[4] = new Array(xRange, (data[i].chanels[0].value / 50));
                pTriangles[5] = new Array(lastPointX, (data[i].chanels[0].value / 50));
                //pTriangles[5] = new Array(xRange,(data[i].chanels[0].value/50)); why is this wrong? and -lineWidth not right?
                //polygoneLinePoints.push(new Array(pTriangles[0],pTriangles[2],pTriangles[1],pTriangles[4]));
                polygoneLinePoints.push(new Array(pTriangles[0], pTriangles[1], pTriangles[2], pTriangles[3], pTriangles[4], pTriangles[5], index));
                for (var j = 0; j < pTriangles.length; j++) {
                    pointsString += "," + pixelToPoints(index, new Array(pTriangles[j][0], pTriangles[j][1]));
                    index++;
                }
            }
            else {
            }
            lastPointX = xRange;
            lastPointY = (data[i].chanels[0].value / 50);
        }
        else {
            rangedPoints.push({ x: xRange, y: (data[i].chanels[0].value / 50), time: data[i].time });
        }
        rangeCounter++;
        xRange += xRangeValue;
    }
    if (type == "webgl") {
        return webGLPoints;
    }
    if (simplifyOptions[0]) {
        data = simplify(rangedPoints, simplifyOptions[1], highQuality);
    }
    else {
        data = rangedPoints;
    }
    return data;
}
var outputUpdate = function (val) {
    $('#limitLines').val(val);
};
var fps;
var lastCalledTime;
// fps stats stuff
function requestAnimFrame() {
    if (!lastCalledTime) {
        lastCalledTime = Date.now();
        fps = 0;
        return 66;
    }
    var delta = (new Date().getTime() - lastCalledTime) / 1000;
    lastCalledTime = Date.now();
    fps = 1 / delta;
    if (fps == "Infinity") {
        fps = 66;
    }
    else if (fps > 66) {
        fps = 66;
    }
    return fps;
}
function showStats(statsDataFps, statsDataMs) {
    var fps = 0;
    var ms = 0;
    var data = statsDataFps;
    for (var i in data) {
        if (i > 0) {
            fps = fps + data[i];
            ms = ms + statsDataMs[i];
        }
    }
    var fpsAv = fps / ($('#iterations').val() - 1);
    var msAv = ms / ($('#iterations').val() - 1);
    $('#averageFps').html((Math.round(fpsAv * 100) / 100).toString());
    $('#averageMs').html((Math.round(msAv * 100) / 100).toString());
    //var sumMs = msAv*$('#iterations').val();
    //$('#sumMs').html(sumMs.toString());
}
function checkMouseHit(target, e) {
    var offset = target.offset();
    var mouse_x = e.pageX - offset.left;
    var mouse_y = e.pageY - offset.top;
    //console.log("x:"+mouse_x+" y:"+mouse_y);
    //console.log(polygoneLinePoints[0]);
    $.each(polygoneLinePoints, function (i, val) {
        if (mouse_x > val[0][0] && mouse_x < val[2][0] && mouse_y > val[0][1] && mouse_y < val[5][1]) {
            var index = (i * 6);
            $.each(val, function (j, points) {
                if (j < 6) {
                    webGLPoints[((index + j) * 7) + 3] = 1;
                    webGLPoints[((index + j) * 7) + 4] = 0;
                    webGLPoints[((index + j) * 7) + 5] = 0;
                    webGLPoints[((index + j) * 7) + 6] = 1;
                }
            });
        }
        else {
        }
    });
}
function initCanvasContext(desternation) {
    var c = document.getElementById(desternation);
    return new Array(c.getContext("2d"), c.width, c.height);
}
function drawCanvasPath(preparedData, contextData) {
    var context = contextData[0];
    context.clearRect(0, 0, contextData[1], contextData[2]);
    context.beginPath();
    context.moveTo(0, 0);
    var xRange = 0; // some day its the time value
    var data = preparedData;
    for (var i in data) {
        var x1 = data[i].x;
        var y1 = data[i].y;
        context.lineTo(x1, y1);
    }
    context.stroke();
}
function drawSvgLines(prepareData, target) {
    var shiftCounter = 0;
    var linePoints = new Array(new Array(0, 0));
    var data = prepareData;
    for (var i in data) {
        shiftCounter++;
        linePoints.push(new Array(data[i].x, data[i].y));
        if (shiftCounter > 1) {
            linePoints.shift();
        }
        var x1 = linePoints[0][0];
        var y1 = linePoints[0][1];
        var x2 = linePoints[1][0];
        var y2 = linePoints[1][1];
        var newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        newLine.setAttribute('id', 'time_' + data[i].time);
        newLine.setAttribute('x1', x1.toString());
        newLine.setAttribute('y1', y1.toString());
        newLine.setAttribute('x2', x2.toString());
        newLine.setAttribute('y2', y2.toString());
        newLine.setAttribute('style', 'stroke:rgb(0,0,0)');
        target.append(newLine);
    }
}
function drawSvgPath(prepareData, target) {
    var linePoints = "M0 0";
    var xRange = 0; // some day its the time value
    var data = prepareData;
    for (var i in data) {
        linePoints += " L" + data[i].x + " " + (data[i].y);
    }
    var newpath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    newpath.setAttributeNS(null, "id", "pathIdD");
    newpath.setAttributeNS(null, "d", linePoints);
    newpath.setAttributeNS(null, "stroke", "black");
    newpath.setAttributeNS(null, "fill", "none");
    target.append(newpath);
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
    // create buffer...GPU
    vertexPosBufferObjekt = GL.createBuffer();
    // ...and set as active object
    GL.bindBuffer(GL.ARRAY_BUFFER, vertexPosBufferObjekt);
    // give array data to active buffer
    GL.bufferData(GL.ARRAY_BUFFER, vVertices, GL.STATIC_DRAW);
    var itemSize = 7; // x,y,z + r,g,b,a
    var drawCount;
    if ($('#limitLines').val() < vVertices.length / itemSize) {
        drawCount = $('#limitLines').val();
    }
    else {
        drawCount = vVertices.length / itemSize;
    }
    var step = Float32Array.BYTES_PER_ELEMENT;
    var total = 3 + 4;
    var stride = step * total;
    GL.vertexAttribPointer(vertexAttribLoc, 3, GL.FLOAT, false, stride, 0);
    GL.vertexAttribPointer(vertexColorAttribute, 4, GL.FLOAT, false, stride, step * 3);
    GL.enableVertexAttribArray(vertexColorAttribute);
    GL.enableVertexAttribArray(vertexAttribLoc);
    if (linetype != "line") {
        GL.drawArrays(GL.TRIANGLES, 0, drawCount * 6);
    }
    else {
        GL.drawArrays(GL.LINE_STRIP, 0, drawCount);
    }
}
function pixelToPoints(index, point) {
    var x = 0;
    var y = 0;
    var rangeValue = 100;
    if (point[0] < canvas.width / 2) {
        if (point[0] > 0) {
            x = (rangeValue - (((rangeValue / (canvas.width / 2)) * point[0]))) * -0.01;
        }
        else {
            x = -1;
        }
    }
    else if (point[0] > canvas.width / 2) {
        x = ((((rangeValue / (canvas.width / 2)) * point[0]))) * 0.01;
    }
    if (point[1] < canvas.height / 2) {
        if (point[1] > 0) {
            y = (rangeValue - (((rangeValue / (canvas.height / 2)) * point[1]))) * 0.01;
        }
        else {
            y = -1;
        }
    }
    else if (point[1] > canvas.height / 2) {
        y = (rangeValue - (((rangeValue / (canvas.height / 2)) * point[1]))) * 0.01;
    }
    webGLPoints[(index * 7)] = x;
    webGLPoints[(index * 7) + 1] = y;
    webGLPoints[(index * 7) + 2] = 0;
    webGLPoints[(index * 7) + 3] = 0;
    webGLPoints[(index * 7) + 4] = 0;
    webGLPoints[(index * 7) + 5] = 0;
    webGLPoints[(index * 7) + 6] = 1;
    if (mouseEvent) {
        checkMouseHit($('#webGLCanvas'), mouseEvent);
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
