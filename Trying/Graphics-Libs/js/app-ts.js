var interval;
var random=false;
var indexValue = 0;
var dataValues = [];
var lastYValue = 0;
var lastXValue = 0;
var rawData;
var dataCount;


// draw Polygon Lines with real or random data
function goDrawInterval(){
  interval = setInterval(function(){
    var newPoints = [[],[],[]];

    newPoints[0][0] = 0;
    if(random){
      newPoints[0][1] = Math.floor(Math.random() * (400 - 0 + 1)) + 0;
    }else{
      newPoints[0][1] = rawData[indexValue].chanels[0]['value']/100;  
    }
    newPoints[0][2] = indexValue;

    newPoints[1][0] = 0;
    if(random){
      newPoints[1][1] = Math.floor(Math.random() * (400 - 0 + 1)) + 0;
    }else{
      newPoints[1][1] = rawData[indexValue].chanels[1]['value']/100;
    }
    newPoints[1][2] = indexValue;

    newPoints[2][0] = 0;
    if(random){
      newPoints[2][1] = Math.floor(Math.random() * (400 - 0 + 1)) + 0;
    }else{
      newPoints[2][1] = rawData[indexValue].chanels[2]['value']/100;
    }
    newPoints[2][2] = indexValue;

    indexValue++;
    if(indexValue>=1){
      dataValues.push(newPoints);
      drawChart(dataValues, indexValue);
    }
  }, 750);
}