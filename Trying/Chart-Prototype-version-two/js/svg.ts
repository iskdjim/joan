function drawSvgLines(linesData, target){
  for(var i in linesData) {
    var x1 = linesData[i][0][0];
    var y1 = linesData[i][0][1];
    var x2 = linesData[i][1][0];
    var y2 = linesData[i][1][1];

    var newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
    newLine.setAttribute('id','line_'+i);
    newLine.setAttribute('x1',x1.toString());
    newLine.setAttribute('y1',y1.toString());
    newLine.setAttribute('x2',x2.toString());
    newLine.setAttribute('y2',y2.toString());

    newLine.setAttribute('stroke-width', linesWidth.toString());
    newLine.setAttribute('class','normal');

    target.append(newLine);
  }
}

function selectSvgLines(lineIds){
  $.each($('.svgHolder line'), function(i, element){
    $(element).removeClass('active');
  });

  $.each(lineIds, function(lineId, lineIdValue){
  	if(lineIdValue){
      $("#line_"+lineId).addClass('active');
    }
  });
}