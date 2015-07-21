var elem, params, two, techType;

function init(){
  elem = document.getElementById('myChartHolder');
  $('#myChartHolder').empty();
  params = { width: 600, height: 400 , type : Two.Types[techType]};
  two = new Two(params).appendTo(elem);	
}

function drawChart(data){
  two.clear();
  var colors = ['red','green', 'blue'];
  for(var i=0;i<data.length-1;i++){
	  var x0 = (600-((data.length-1)-data[i][0][2])*30)+0;
	  var x1 = x0+30;

	  //console.log(x0); console.log(x1);
	  for(var j=0;j<3;j++){
	    var line = two.makeLine(x0, data[i][j][1], x1 , data[i+1][j][1]);
	    line.stroke = colors[j]; // Accepts all valid css color
	    line.linewidth = 5;
	    if(j==2){
	    	//console.log(data[i][j][1]);
	    }
	  }
  }
  two.render();
}