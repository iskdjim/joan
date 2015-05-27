/// <reference path="../libs/jquery.d.ts" />
var iteration_counter, stats_data_fps, stats_data_ms, raw_data, webgl_points, line_type;
function init(typ) {
    iteration_counter = 0;
    stats_data_fps = new Array();
    stats_data_ms = new Array();
    drawChart(typ);
    showStats(stats_data_fps, stats_data_ms);
}
;
function drawChart(typ) {
    var iterations = $('#iterations').val();
    var simplify_options = new Array();
    if ($('#tolerance').val() != "0") {
        var simplify_options = new Array(true, $('#tolerance').val());
    }
    // create Data for draw actions
    var prepared_data = prepareData(raw_data, typ, $('#limit_lines').val(), simplify_options);
    $('#counter_simply').html((prepared_data.length - 1).toString());
    // iteractions for drawing        
    while (iterations > iteration_counter) {
        var t0 = performance.now();
        var line_points = new Array(new Array(0, 0));
        iteration_counter++;
        $("#container").empty();
        if (typ == "svg") {
            if ($('#draw_type').val() == "lines") {
                drawSvgLines(prepared_data, $("#container"));
            }
            else {
                drawSvgPath(prepared_data, $("#container"));
            }
        }
        else if (typ == "canvas") {
            var context = initCanvasContext('myCanvas');
            drawCanvasPath(prepared_data, context);
        }
        else {
            drawWebGlLines(prepared_data);
        }
        // stats stuff     
        var t1 = performance.now();
        var fps_value = requestAnimFrame();
        stats_data_fps.push(fps_value);
        stats_data_ms.push(t1 - t0);
    }
}
;
function prepareData(data, typ, range, simplify_options) {
    var ranged_points = new Array();
    var range_counter = 0;
    var x_range = 0; // some day its the time value  
    var x_range_value = 0.02;
    var index = 0;
    var high_quality = false;
    var points_string = "-1.0, 0.0,0.0";
    var last_point_x = 0;
    var last_point_y = 0;
    var line_width = 3;
    webgl_points = new Float32Array(data.length * 3);
    if (typ == "webgl" && line_type != "line") {
        webgl_points = new Float32Array(data.length * 3 * 6);
    }
    for (var i in data) {
        if (range < range_counter) {
            break;
        }
        if (typ == "webgl") {
            if (range_counter > 0 && line_type != "line") {
                var p_triangles = new Array();
                p_triangles[0] = new Array(last_point_x, last_point_y);
                p_triangles[1] = new Array(x_range + line_width, (data[i].chanels[0].value / 50) + line_width);
                p_triangles[2] = new Array(x_range, (data[i].chanels[0].value / 50));
                p_triangles[3] = new Array(last_point_x, last_point_y);
                p_triangles[4] = new Array(last_point_x + line_width, (data[i].chanels[0].value / 50) + line_width);
                p_triangles[5] = new Array(x_range + line_width, (data[i].chanels[0].value / 50) + line_width);
                for (var j = 0; j < p_triangles.length; j++) {
                    points_string += "," + pixelToPoints(index, new Array(p_triangles[j][0], p_triangles[j][1]));
                    index++;
                }
            }
            else {
                points_string += "," + pixelToPoints(i, new Array(x_range, (data[i].chanels[0].value / 50)));
            }
            last_point_x = x_range;
            last_point_y = (data[i].chanels[0].value / 50);
        }
        else {
            ranged_points.push({ x: x_range, y: (data[i].chanels[0].value / 50), time: data[i].time });
        }
        range_counter++;
        x_range += x_range_value;
    }
    if (typ == "webgl") {
        return webgl_points;
    }
    if (simplify_options[0]) {
        data = simplify(ranged_points, simplify_options[1], high_quality);
    }
    else {
        data = ranged_points;
    }
    return data;
}
var outputUpdate = function (val) {
    $('#limit_lines').val(val);
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
function showStats(stats_data_fps, stats_data_ms) {
    var fps = 0;
    var ms = 0;
    var data = stats_data_fps;
    for (var i in data) {
        if (i > 0) {
            fps = fps + data[i];
            ms = ms + stats_data_ms[i];
        }
    }
    var fps_av = fps / ($('#iterations').val() - 1);
    var ms_av = ms / ($('#iterations').val() - 1);
    $('#average_fps').html(fps_av.toString());
    $('#average_ms').html(ms_av.toString());
    var sum_ms = ms_av * $('#iterations').val();
    $('#sum_ms').html(sum_ms.toString());
}
function initCanvasContext(desternation) {
    var c = document.getElementById(desternation);
    return new Array(c.getContext("2d"), c.width, c.height);
}
function drawCanvasPath(prepared_data, context_data) {
    var context = context_data[0];
    context.clearRect(0, 0, context_data[1], context_data[2]);
    context.beginPath();
    context.moveTo(0, 0);
    var x_range = 0; // some day its the time value    
    var data = prepared_data;
    for (var i in data) {
        var x1 = data[i].x;
        var y1 = data[i].y;
        context.lineTo(x1, y1);
    }
    context.stroke();
}
function drawSvgLines(prepare_data, target) {
    var shift_counter = 0;
    var line_points = new Array(new Array(0, 0));
    var data = prepare_data;
    for (var i in data) {
        shift_counter++;
        line_points.push(new Array(data[i].x, data[i].y));
        if (shift_counter > 1) {
            line_points.shift();
        }
        var x1 = line_points[0][0];
        var y1 = line_points[0][1];
        var x2 = line_points[1][0];
        var y2 = line_points[1][1];
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
function drawSvgPath(prepare_data, target) {
    var line_points = "M0 0";
    var x_range = 0; // some day its the time value  
    var data = prepare_data;
    for (var i in data) {
        line_points += " L" + data[i].x + " " + (data[i].y);
    }
    var newpath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    newpath.setAttributeNS(null, "id", "pathIdD");
    newpath.setAttributeNS(null, "d", line_points);
    newpath.setAttributeNS(null, "stroke", "black");
    newpath.setAttributeNS(null, "fill", "none");
    target.append(newpath);
}
var canvas, points, linerange;
var points_data, formated_points, gl;
var webGLProgramObject, vertexAttribLoc, vVertices, vertexPosBufferObjekt; // Der WebGL-Buffer, der die Dreieckskoordinaten aufnimmt
function webglStuff(desternation) {
    canvas = document.getElementById(desternation);
    try {
        gl = canvas.getContext("experimental-webgl");
    }
    catch (e) { }
    if (!gl) {
        window.alert("Fehler: WebGL-Context nicht gefunden");
    }
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");
    webGLProgramObject = gl.createProgram();
    gl.attachShader(webGLProgramObject, fragmentShader);
    gl.attachShader(webGLProgramObject, vertexShader);
    // Das Shader-Program-Objekt ist vollstaendig und muss
    // gelinkt werden.
    gl.linkProgram(webGLProgramObject);
    // Da theoretisch mehrere Shader-Program-Objekte moeglich  
    // sind, muss angegeben werden, welches benutzt werden soll.
    gl.useProgram(webGLProgramObject);
    // RGB-Alpha Farbe zum loeschen des Hintergrundes:
    gl.clearColor(255.0, 255.0, 255.0, 1.0);
    // Hintergrund loeschen
    gl.clear(gl.COLOR_BUFFER_BIT);
    // Die Verknuepfung zwischen JavaScript und dem 
    // Shader-Attribut
    vertexAttribLoc = gl.getAttribLocation(webGLProgramObject, "vPosition");
}
function drawWebGlLines(data) {
    vVertices = data;
    console.log(vVertices.length);
    //  vVertices = new_vertices;      
    // Buffer wird erstellt...GPU   
    vertexPosBufferObjekt = gl.createBuffer();
    // ...und als aktives Objekt gesetzt:
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBufferObjekt);
    // die Arraydaten werden an den aktiven Puffer uebergeben:
    gl.bufferData(gl.ARRAY_BUFFER, vVertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(vertexAttribLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexAttribLoc);
    var draw_count;
    if ($('#limit_lines').val() < vVertices.length / 3) {
        draw_count = $('#limit_lines').val();
    }
    else {
        draw_count = vVertices.length / 3;
    }
    if (line_type != "line") {
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, draw_count * 6);
    }
    else {
        gl.drawArrays(gl.LINE_STRIP, 0, draw_count);
    }
}
function pixelToPoints(index, point) {
    var x = 0;
    var y = 0;
    var range_value = 100;
    if (point[0] < canvas.width / 2) {
        if (point[0] > 0) {
            x = (range_value - (((range_value / (canvas.width / 2)) * point[0]))) * -0.01;
        }
        else {
            x = -1;
        }
    }
    else if (point[0] > canvas.width / 2) {
        x = ((((range_value / (canvas.width / 2)) * point[0]))) * 0.01;
    }
    if (point[1] < canvas.height / 2) {
        if (point[1] > 0) {
            y = (range_value - (((range_value / (canvas.height / 2)) * point[1]))) * 0.01;
        }
        else {
            y = -1;
        }
    }
    else if (point[1] > canvas.height / 2) {
        y = (range_value - (((range_value / (canvas.height / 2)) * point[1]))) * 0.01;
    }
    webgl_points[(index * 3)] = x + linerange;
    webgl_points[(index * 3) + 1] = y + linerange;
    //webgl_points[(index*3)+2] = 0.0;
}
function getShader(gl, id) {
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
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    }
    else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    }
    else {
        return null;
    }
    gl.shaderSource(shader, str);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}
