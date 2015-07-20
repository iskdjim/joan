var elem, params, two, techType;

function init(){
  elem = document.getElementById('myChartHolder');
  $('#myChartHolder').empty();
  params = { width: 600, height: 400 , type : Two.Types[techType]};
  two = new Two(params).appendTo(elem);	
}

function drawChart(data){
  two.clear();
  for(var i=0;i<data.length-1;i++){
	  var x0 = (600-((data.length-1)-data[i][2])*30)+0;
	  var x1 = x0+30;
	  //console.log(x0); console.log(x1);
	  var line = two.makeLine(x0, data[i][1], x1 , data[i+1][1]);
	  line.stroke = 'black'; // Accepts all valid css color
	  line.linewidth = 5;
  }
  two.render();
}