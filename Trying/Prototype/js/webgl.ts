var canvas, points,linerange;
var points_data,formated_points,gl;
var webGLProgramObject, // "GPU-Programm", das zur Berechnung der Grafik verwendet wird
  vertexAttribLoc,  // Verknüpfung zwischen JavaScript und Vertex-Shader
  vVertices,        // Array der Dreieckskoordinaten
  vertexPosBufferObjekt; // Der WebGL-Buffer, der die Dreieckskoordinaten aufnimmt
    
function webglStuff(desternation){
	
  canvas = document.getElementById(desternation);
  try {
    gl = canvas.getContext("experimental-webgl");
  } catch (e) {}
  
  if (!gl) {
    window.alert("Fehler: WebGL-Context nicht gefunden");
  }
      
  var fragmentShader = getShader(gl,"shader-fs");   
  var vertexShader = getShader(gl,"shader-vs");   
	        
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
  gl.clearColor(255.0, 255.0,255.0, 1.0);
  // Hintergrund loeschen
  gl.clear(gl.COLOR_BUFFER_BIT);
	
  // Die Verknuepfung zwischen JavaScript und dem 
  // Shader-Attribut
  vertexAttribLoc = gl.getAttribLocation(webGLProgramObject, "vPosition");		
}

function drawWebGlLines(data){
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
  if($('#limit_lines').val() < vVertices.length/3){
    draw_count = $('#limit_lines').val();
  }else{
    draw_count = vVertices.length/3;
  }
  
  if(line_type != "line"){
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, draw_count*6);
  }else{
    gl.drawArrays(gl.LINE_STRIP, 0, draw_count);
  }
  
}

function pixelToPoints(index,point){
  var x = 0;
  var y = 0;
  
  var range_value = 100;
  if(point[0] < canvas.width/2){
    if(point[0] > 0){
      x = (range_value-(((range_value/(canvas.width/2))*point[0])))*-0.01;
    }else{
      x = -1;
    }	
  }else if(point[0] > canvas.width/2){
    x = ((((range_value/(canvas.width/2))*point[0])))*0.01;
  }
        
  if(point[1] < canvas.height/2){
    if(point[1] > 0){
      y = (range_value-(((range_value/(canvas.height/2))*point[1])))*0.01;
    }else{
      y = -1;
    }	
  }else if(point[1] > canvas.height/2){
    y = (range_value-(((range_value/(canvas.height/2))*point[1])))*0.01;
  }

  webgl_points[(index*3)] = x+linerange;
  webgl_points[(index*3)+1] = y+linerange;
  //webgl_points[(index*3)+2] = 0.0;
}

function getShader(gl, id) {
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
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
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