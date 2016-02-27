var FastInterval = function(onFastInterval, freqMicroseconds, onInterval) {
	onInterval = typeof onInterval == 'undefined' ? function(){return true;} : onInterval;

	var minInterval = 16000;
	var intervalFreq = Math.max(minInterval, freqMicroseconds);

	var burstSize = 1;
	if(freqMicroseconds < minInterval) {
		burstSize = freqMicroseconds ? (minInterval / freqMicroseconds) : minInterval * 10;
		burstSize =  Math.max(1, burstSize);
	}

	var stop = false; //default

	var interval = setInterval(function() {
		if(!stop) {
			onInterval();
		}
		if(stop) {
			clearInterval(interval);
		} else {
			for(var i = 0; i < burstSize; i++) {
				onFastInterval();
				if(stop) {
					break;
				};
			}
		}
	}, intervalFreq/1000);

	this.clear = this.stop = function(){
		stop = true;
	}
};

//to make it a drop-in replacement for setInterval() and clearInterva()
var setFastInterval = function(onFastInterval, freqMilliseconds, onInterval) {
	var freqMicroseconds = freqMilliseconds * 1000;
	var fastInterval = new FastInterval(onFastInterval, freqMicroseconds, onInterval);
	return fastInterval;
}

var clearFastInterval = function(fastInterval) {
	fastInterval.stop();
}