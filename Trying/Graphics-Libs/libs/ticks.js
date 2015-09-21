//code based on: https://r-forge.r-project.org/scm/viewvc.php/*checkout*/pkg/R/labeling.R?revision=2&root=labeling
//idea and explanations from: http://graphics.stanford.edu/vis/publications/2010/labeling-preprint.pdf
//input (dataMin, dataMax, ticks) has to be positive

var TickScale = (function () {
    function TickScale() {

    }
    
    TickScale.prototype.setMinMaxPointsTicks = function (dataMin, dataMax, ticks) {
        this.dataMin = dataMin;
        this.dataMax = dataMax;
        this.ticks = ticks;
        this.calculate();
    };

    TickScale.prototype.getTickSpacing = function () {
        return this.tickSpacing;
    };
    TickScale.prototype.getRoundedMin = function () {
        return this.labelMin;
    };
    TickScale.prototype.getRoundedMax = function () {
        return this.labelMax;
    };

    TickScale.prototype.calculate = function () {
        this.only_inside = false;
        this.labelMin;
        this.labelMax;
        this.steps = [1, 5, 2, 2.5, 4, 3];
        this.weight = [0.25, 0.25, 0.5, 0.0];
        this.tickSpacing = this.extended(this.dataMin, this.dataMax, this.ticks, this.only_inside, this.weight);
    };

    TickScale.prototype.log10 = function (val) {
        return Math.log(val) / Math.LN10;
    };

  //coverage = labelings that do not extend far beyond the range of the data, penalizing the bad whitespace cases that arise in Heckbert’s approach
    TickScale.prototype.coverage = function (dataMin, dataMax, labelMin, labelMax) {
        var range = dataMax - dataMin;
        return 1 - 0.5 * (Math.pow(dataMax - labelMax, 2) + Math.pow(dataMin - labelMin, 2)) / Math.pow(0.1 * range, 2);
    };
    TickScale.prototype.coverage_max = function (dataMin, dataMax, span) {
        var range = dataMax - dataMin;
        if (span > range) {
            var half = (span - range) / 2.0;
            return 1 - Math.pow(half, 2) / Math.pow(0.1 * range, 2);}
        else
            return 1;
    };

    //m = ticks = requested labels
    //k = possible labels (we use the fact that the k labels must at least fill the data range to compute a lower bound on z)
    //z = the power of ten that the step size should be multiplied by
    //roh_t = user-provided target label density; calculate with m divided by the physical space available for the axis 
  //density = returning roughly the number of labels that were requested
    //this implementation of density is the one which is used in the R code
    TickScale.prototype.density = function (k, m, dataMin, dataMax, labelMin, labelMax) {
        var roh = (k - 1.0) / (labelMax - labelMin);
        var roh_t = (m - 1.0) / (Math.max(labelMax, dataMax) - Math.min(labelMin, dataMin));
        return 2 - Math.max( roh/roh_t, roh_t/roh );
    };
    TickScale.prototype.density_max = function (k, m) {
        if (k >= m)
            return 2 - (k - 1.0)/(m - 1.0);
        else
            return 1;
    };

    //v = equals 1 if labeling includes 0, 0 otherwise
    //this.steps = Q = array of preference-ordered list of nice step sizes
    //q = element of Q
    //i = index of q  in Q; starting with 1
    //qIndex = index of q  in Q; starting with 0
    //lstep = tickStep
    //smallestNum = eps = "small enough to be insignificant"
  //simplicity = nicer labeling sequences by preferring step sizes that appear earlier in Q
    TickScale.prototype.simplicity = function (qIndex, j, labelMin, labelMax, tickStep){
        var smallestNum = 1 * Math.pow(10, -10);
        var i = qIndex + 1;
        if ((labelMin % tickStep < smallestNum || (tickStep - labelMin % tickStep) < smallestNum) && labelMin <= 0 && labelMax >= 0)
            var v = 1;
        else
            v = 0;
        return (this.steps.length - i) / (this.steps.length - 1.0) - j + v;
    };
    TickScale.prototype.simplicity_max = function (qIndex, j) {
        var i = qIndex + 1;
        return (this.steps.length - i) / (this.steps.length - 1.0) - j + 1;
    };

  //legibility just for completeness, but not used
    TickScale.prototype.legibility = function (labelMin, labelMax, tickStep) {
        return 1;
    };
    TickScale.prototype.legibility_max = function (labelMin, labelMax, tickStep) {
        return 1;
    };

    //w = this.weight
    TickScale.prototype.extended = function (dataMin, dataMax, m, only_inside, w) {
        var tickStep; //= result
        var best_score = -10.0;  //is -2 in paper, but our random numbers are very smal and so have a very "bad best_score"
        var j = 1.0;
    
        //producing the step sizes in descending oder of preference
        while (j < Infinity) {
  
            var q;
            for(qIndex=0; qIndex<=this.steps.length; qIndex++) {
                q = this.steps[qIndex];
                var sm = this.simplicity_max(qIndex, j);
                if (w[0] * sm + w[1] + w[2] + w[3] < best_score) {
                    j = Infinity;
                    break;
                }
                var k = 2.0;
                //the k labels must at least fill the data range to compute a lower bound on z(the power of ten that the step size should be multiplied by)
                while (k < Infinity) {
                    dm = this.density_max(k, m);
                    if (w[0] * sm + w[1] + w[2] * dm + w[3] < best_score) {
                        break;
                    }
                    var delta = (dataMax - dataMin) / (k + 1.0) / (j * q);
                    var z = Math.ceil(this.log10(delta));  //when delta=0 z=Infinity
                    while (z<Infinity) {
                        var stepSize = q * j * Math.pow(10, z);
                        var span = stepSize * (k - 1.0);
                        var cm = this.coverage_max(dataMin, dataMax, span);
                        if (w[0] * sm + w[1] * cm + w[2] * dm + w[3] < best_score){
                            break;
                        }
                        var min_start = Math.floor(dataMax / stepSize) * j - (k - 1.0) * j;
                        var max_start = Math.ceil(dataMin / stepSize) * j;
                        if (min_start > max_start) {
                            z = z + 1;
                            continue;
                        }
                        var minTemp;
                        var maxTemp;
                        //start = possible starting positions of the sequence, accounting for possible phase offsets
                        //iterate over possible starting positions of the sequence, accounting for possible phase offsets
                        for(var start=-100; start <= (max_start - min_start + 1); start++) {
                            minTemp = start * stepSize/j;
                            maxTemp = minTemp + span;
                            var s = this.simplicity(qIndex, j, minTemp, maxTemp, stepSize);
                            var c = this.coverage(dataMin, dataMax, minTemp, maxTemp);
                            var d = this.density(k, m, dataMin, dataMax, minTemp, maxTemp);
                            var l = this.legibility(minTemp, maxTemp, stepSize);
                            var score = w[0] * s + w[1] * c + w[2] * d + w[3] * l;
                            if (score > best_score && (!only_inside || (minTemp <= dataMin && maxTemp >= dataMax))) {
                                best_score = score;
                                tickStep = stepSize;
                                this.labelMin = minTemp;
                                this.labelMax = maxTemp;
                            }
                        }
                        z = z + 1;
                    }
                    k = k + 1;
                }
            }
            j = j + 1;
        }
    	console.log(this.labelMin);
    	console.log(this.labelMax);
    	console.log(tickStep);
        return tickStep;
    };
    return TickScale;
})();
