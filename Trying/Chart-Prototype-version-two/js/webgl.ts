var canvas, points,linerange;
var pointsData,GL;
var webGLProgramObject, // "GPU-program", for calucation of the graphics
  vertexAttribLoc,  // connection between javascript and vertex-shader
  vVertices,        // Array for triangle coordinats
  vertexColorAttribute,
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
  vertexColorAttribute = GL.getAttribLocation(webGLProgramObject, "aVertexColor");

  vertexAttribLoc = GL.getAttribLocation(webGLProgramObject, "vPosition");
}

function drawWebGlLines(data){
  vVertices = data;
  //console.log(data);
  // create buffer...GPU
  vertexPosBufferObjekt = GL.createBuffer();
  // ...and set as active object
  GL.bindBuffer(GL.ARRAY_BUFFER, vertexPosBufferObjekt);
		        
  // give array data to active buffer
  GL.bufferData(GL.ARRAY_BUFFER, vVertices, GL.STATIC_DRAW);
  
    
  var itemSize = 7; // x,y,z + r,g,b,a

  var drawCount = vVertices.length/itemSize;

  var step = Float32Array.BYTES_PER_ELEMENT;
  var total = 3+4;
  var stride = step * total;

  GL.vertexAttribPointer(vertexAttribLoc, 3, GL.FLOAT, false, stride, 0);
  GL.vertexAttribPointer(vertexColorAttribute, 4, GL.FLOAT, false, stride, step * 3);

  GL.enableVertexAttribArray(vertexAttribLoc);
  GL.enableVertexAttribArray(vertexColorAttribute);

  if(triangles){
    GL.drawArrays(GL.TRIANGLES, 0, drawCount);
  }else{
    GL.drawArrays(GL.LINES, 0, drawCount);
  }

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

function generateWebGLLines(){
  var pixelPointRelationX = 2/canvasWidth;  // 2 => wegbl coords from -1 to 1	
  var pixelPointRelationY = 2/canvasHeight;  // 2 => wegbl coords from -1 to 1	

  for(var i in linesData){
 	var x0 = linesData[i][0][0];
 	var y0 = linesData[i][0][1];
 	var x1 = linesData[i][1][0];
 	var y1 = linesData[i][1][1];
 	
 	// get webgl coordinates
 	var x0PointCoordinate = pixelToPointCoordinateX(pixelPointRelationX,x0);
 	var y0PointCoordinate = pixelToPointCoordinateY(pixelPointRelationY,y0);
 	var x1PointCoordinate = pixelToPointCoordinateX(pixelPointRelationX,x1);
 	var y1PointCoordinate = pixelToPointCoordinateY(pixelPointRelationY,y1);
 	 	
 	webGLLinesData[i] = new Array(new Array(x0PointCoordinate,y0PointCoordinate),new Array(x1PointCoordinate,y1PointCoordinate));
 	
 	// needed for index of points array	
 	if(i==0){
      var firstIndex = 0;
 	  var secondIndex = 1;
 	}else{
 	  var firstIndex = (parseInt(i)*2);
 	  var secondIndex = (parseInt(i)*2+1);
 	}
 	prepareWebGLData(webGLLinesData[i][0],firstIndex);
 	prepareWebGLData(webGLLinesData[i][1],secondIndex);
  }
}

function generateWebGLTriangles(){
  var pixelPointRelationX = 2/canvasWidth;  // 2 => wegbl coords from -1 to 1	
  var pixelPointRelationY = 2/canvasHeight;  // 2 => wegbl coords from -1 to 1	

  for(var i in linesDataDraw){
 	var x0 = linesDataDraw[i][0][0];
 	var y0 = linesDataDraw[i][0][1];
 	
 	// get webgl coordinates
 	var x0PointCoordinate = pixelToPointCoordinateX(pixelPointRelationX,x0);
 	var y0PointCoordinate = pixelToPointCoordinateY(pixelPointRelationY,y0);

 	 	
 	webGLLinesData[i] = new Array(new Array(x0PointCoordinate,y0PointCoordinate));
 	prepareWebGLData(webGLLinesData[i][0],i);
  }
}

function prepareWebGLData(xyPoints, index){
  webGLPoints[(index*7)] = xyPoints[0];
  webGLPoints[(index*7)+1] = xyPoints[1];
  webGLPoints[(index*7)+2] = 0; // z
  webGLPoints[(index*7)+3] = 0; // r
  webGLPoints[(index*7)+4] = 0; // g
  webGLPoints[(index*7)+5] = 0; // b
  webGLPoints[(index*7)+6] = 1;  // alpha
}

function pixelToPointCoordinateX(pixelPointRelation,pixelPoint){
	var point = pixelPointRelation*pixelPoint;
	//console.log("X: Pixel:"+pixelPoint+" - pixelPointRelation:"+pixelPointRelation+" point:"+point);

	// check if in the -1 or 1 area
	if(point >= 1){
	  point=point-1;
	}else{
	  point=point-1;
	}
	//console.log(point);
	return point;
}

function pixelToPointCoordinateY(pixelPointRelation,pixelPoint){
	var point = pixelPointRelation*pixelPoint;
	//console.log("Y: Pixel:"+pixelPoint+" - pixelPointRelation:"+pixelPointRelation+" point:"+point);
	// check if in the -1 or 1 area
	if(point >= 1){
	  point=(1-point);
	}else{
	  point = (1-point); // pixel width is from top...web gl coordinates for y starts bottom with -1
	}
	//console.log(point);
	return point;
}
