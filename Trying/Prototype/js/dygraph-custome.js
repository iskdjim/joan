
function init(){
  dataIndex = 0;

  data.push([new Date(parseInt(1347927197173)), 144, 40, 54]);
  $(document).ready(function () {
    // use time series counter to fill seriesHidder
    for(var i=0;i<timeseriesCount;i++){
      seriesHidder[i] = true;
      $('.serieslegenHolder').append('<input type="checkbox" class="timeseries" name="series_'+i+'" value="" id="series_'+i+'" checked><p class="legenColor" style="color:'+seriesColors[i]+'">'+seriesLabels[i+1]+'</p><div class="clearer"></div>')
    }
	    
    startInterval();
   
    // create graph
    g = new Dygraph(document.getElementById(chartDestinationId), data,{
      drawPoints: true,
      showRoller: true,
      title: mainLabel,
      titleHeight: 32,
      ylabel: yAxisLabel,
      xlabel: xAxisLabel,
      valueRange: [minYAxis,maxYAxis],
      visibility: seriesHidder,
      labels: seriesLabels,
      colors: seriesColors,
      pointSize : 4,
      strokeWidth: 3,
        highlightSeriesOpts: {
          /*strokeWidth: 3,
          strokeBorderWidth: 1,*/
          highlightCircleSize: 6
        }
    });
      
    // play and stop button definition
    $('#stop').click(function(){ render = false; });
    $('#play').click(function(){ render = true; });
      
    // create event listener for a download button
    // used for download image of chart
    document.getElementById(downloadImageElementId).addEventListener('click', function() {
      Dygraph.Export.asPNG(g,imgExport);

      // create canvas element, and create an image element. Draw image into new canvas element to download it.
      var canvas = document.createElement("canvas");
      canvas.setAttribute('id', "saveIMG");
      canvas.setAttribute('class', "download-canvas");
  	  
      $('body').append(canvas);
  	  	
      var image=document.createElement("img");
      image.setAttribute('src', $(imgExport).attr("src"));
      canvas.width = image.width;
      canvas.height = image.height;
      canvas.getContext("2d").drawImage(image, 0, 0);
      downloadCanvas(this, 'canvas', imageName);
    });    
      

    $('.seriesLegend input').change(function(){
      var hiddenId = $(this).attr('id').replace("series_","");
      if(seriesHidder[hiddenId]){
        seriesHidder[hiddenId] = false;
      }else{
        seriesHidder[hiddenId] = true;
      }
    });
  });
}

// function for getting new data point 
function startInterval(){
  interval = setInterval(function(){
    if(render){
      var nextDataPoint = getNextPoints(dataIndex);
      dataIndex++;
      if(dataIndex > shownSamples){ 
        //data.shift();
      }
     }
  }, timeInterval);	
}

function getNextPoints(index){
  var x = jsonData[0]['values'][index]['time'];
  var y_values = [];
  for(var i=0;i<timeseriesCount;i++){
	  y_values.push(jsonData[i]['values'][index]['y']);
  }
  // refactor => find a way to used auto generated y data array
  data.push([new Date(parseInt(x)), y_values[0],y_values[1],y_values[2]]);
  g.updateOptions( { 'file': data } );
}

// download image and remove fake canvas element
function downloadCanvas(link, canvasId, filename) {
   var canElement = document.getElementsByClassName("download-canvas");
   link.href =  canElement[0].toDataURL();
   link.download = filename;
   $('#saveIMG').remove();
}