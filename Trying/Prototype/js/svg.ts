function drawSvgLines(prepare_data, target){
  var shift_counter = 0;	
  var line_points = new Array(new Array(0,0));
  
  var data = prepare_data;
  for(var i in data) {     
    shift_counter++;
    line_points.push(new Array( data[i].x, data[i].y));
    if(shift_counter > 1){
     line_points.shift();
    }
							
    var x1 = line_points[0][0];
    var y1 = line_points[0][1];
    var x2 = line_points[1][0];
    var y2 = line_points[1][1];

    var newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
    newLine.setAttribute('id','time_'+data[i].time);
    newLine.setAttribute('x1',x1.toString());
    newLine.setAttribute('y1',y1.toString());
    newLine.setAttribute('x2',x2.toString());
    newLine.setAttribute('y2',y2.toString());
    newLine.setAttribute('style','stroke:rgb(0,0,0)');

    target.append(newLine);	
  					  
  }

}

function drawSvgPath(prepare_data, target){
  var line_points = "M0 0";
  var x_range = 0; // some day its the time value  
  
  var data = prepare_data;
  for(var i in data) {    
    line_points += " L"+data[i].x+" "+(data[i].y);    
  }
  var newpath = document.createElementNS('http://www.w3.org/2000/svg','path');
  newpath.setAttributeNS(null, "id", "pathIdD");  
  newpath.setAttributeNS(null, "d", line_points);  
  newpath.setAttributeNS(null, "stroke", "black");
  newpath.setAttributeNS(null, "fill", "none");
            
  target.append(newpath);	 

}