var canvas, points,linerange;
var pointsData,GL;
var webGLProgramObject, // "GPU-program", for calucation of the graphics
  vertexAttribLoc,  // connection between javascript and vertex-shader
  vVertices,        // Array for triangle coordinats
  vertexPosBufferObjekt; // The WebGL-buffer for the triangles

function webglStuff(destination){
  canvas = document.getElementById(destination);
  try {
    GL = canvas.getContext("experimental-webgl");
  } catch (e) {}

  if (!GL) {
    window.alert("Fehler: WebGL-context not found");
  }

  var fragmentShader = getShader(GL,"shader-fs");
  var vertexShader = getShader(GL,"shader-vs");

  webGLProgramObject = GL.createProgram();

  GL.attachShader(webGLProgramObject, fragmentShader);
  GL.attachShader(webGLProgramObject, vertexShader);

  // Shader-program-object is complete and has to be linked
  GL.linkProgram(webGLProgramObject);
  
  
  // it is posible to use more than one shader program, so tell the program which one should be used
  GL.useProgram(webGLProgramObject);

  // background color
  GL.clearColor(255.0, 255.0,255.0, 1.0);
  // delete background
  GL.clear(GL.COLOR_BUFFER_BIT);
	
  // Conntection between javascript and the shader-attribut
  vertexAttribLoc = GL.getAttribLocation(webGLProgramObject, "vPosition");
}

function drawWebGlLines(data){
  vVertices = data;
  
  // create buffer...GPU   
  vertexPosBufferObjekt = GL.createBuffer();
  // ...and set as active object
  GL.bindBuffer(GL.ARRAY_BUFFER, vertexPosBufferObjekt);
		        
  // give array data to active buffer
  GL.bufferData(GL.ARRAY_BUFFER, vVertices, GL.STATIC_DRAW);
  GL.vertexAttribPointer(vertexAttribLoc, 3, GL.FLOAT, false, 0, 0);
  GL.enableVertexAttribArray(vertexAttribLoc);

  var drawCount;
  if($('#limitLines').val() < vVertices.length/3){
    drawCount = $('#limitLines').val();
  }else{
    drawCount = vVertices.length/3;
  }

  if(linetype != "line"){
    GL.drawArrays(GL.TRIANGLE_STRIP, 0, drawCount*6);
  }else{
    GL.drawArrays(GL.LINE_STRIP, 0, drawCount);
  }
}

function pixelToPoints(index,point){
  var x = 0;
  var y = 0;

  var rangeValue = 100;
  if(point[0] < canvas.width/2){
    if(point[0] > 0){
      x = (rangeValue-(((rangeValue/(canvas.width/2))*point[0])))*-0.01;
    }else{
      x = -1;
    }
  }else if(point[0] > canvas.width/2){
    x = ((((rangeValue/(canvas.width/2))*point[0])))*0.01;
  }

  if(point[1] < canvas.height/2){
    if(point[1] > 0){
      y = (rangeValue-(((rangeValue/(canvas.height/2))*point[1])))*0.01;
    }else{
      y = -1;
    }
  }else if(point[1] > canvas.height/2){
    y = (rangeValue-(((rangeValue/(canvas.height/2))*point[1])))*0.01;
  }

  webGLPoints[(index*3)] = x+linerange;
  webGLPoints[(index*3)+1] = y+linerange;
  //webgl_points[(index*3)+2] = 0.0;
}

function getShader(GL, id) {
  var shaderScript : any = document.getElementById(id);
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
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = GL.createShader(GL.VERTEX_SHADER);
  } else {
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