function initCanvasContext(desternation){       
  var c = document.getElementById(desternation);
  return new Array(c.getContext("2d"),c.width, c.height);
}