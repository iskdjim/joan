var data = [];
var dataIndex;
var g; // graph
var shownSamples = 25; //  data points per timeseries
var render = true; // flag for stopping rerender of chart
var timeInterval = 1000; // time interval for new data points
var timeseriesCount = 3; // counter for time series
var seriesHidder = []; // needed do hide single time series
var seriesColors = ["#00ff00", "#ff0000", "#0000ff"];
var seriesLabels = ['Time', 'Time Series 1', 'Time Series 2','Time Series 3'];
var minYAxis =  0.0;
var maxYAxis = 170;
var chartDestinationId = "myChartHolder"; // id of div element
var downloadImageElementId = "download"; // id of download element
var imageName = "graph.jpg";
var yAxisLabel = "Value";
var xAxisLabel = "Time";
var mainLabel = "Time Series Data";