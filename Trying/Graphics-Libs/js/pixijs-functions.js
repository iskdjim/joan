var stage, renderer, lineElement;
var timeLinesLine = [];

function init(){
  renderer = new PIXI.WebGLRenderer(600, 400,{backgroundColor : 0xffffff});
  // The renderer will create a canvas element for you that you can then insert into the DOM.
  document.getElementById('myChartHolder').appendChild(renderer.view);

  // You need to create a root container that will hold the scene you want to draw.
  stage = new PIXI.Container();
}

function drawChart(data, index){
  stage.removeChildren();
  var colors = ['0xFF0000','0x0000FF','0x00FF00'];

  for(var i=0;i<data.length-1;i++){
	// generate x coordinate values
    var x0 = (600-((data.length-1)-data[i][0][2])*30)+0;
    var x1 = x0+30;
    timeLinesLine[i] = [];

    for(var j=0;j<3;j++){
      lineElement = new PIXI.Graphics();
      lineElement.interactive = true;
      lineElement.mouseover = function (e) {
        $('.lineData').html("Current Line Path: "+this.currentPath.points.join());
      }

      lineElement.lineStyle(3, colors[j]);
      // line from old value to new one
      if(index == "1"){
    	lineElement.drawPolygon([600,data[0][0][1], x1, data[i+1][j][1]]);
        //lineElement.moveTo(600,data[0][0][1]);
      }else{
        //lineElement.moveTo,data[i][j][1]);
    	lineElement.drawPolygon([x0,data[i][j][1], x1, data[i+1][j][1]]);
      }
      lineElement.hitArea = lineElement.getBounds();
      timeLinesLine[i][j] = lineElement;
	}

    // add childs to stage
    for(var g=0;g<timeLinesLine[i].length;g++){
      stage.addChild(timeLinesLine[i][g]);
    }
  }
  renderer.render(stage);
}