function setup () {
	initVariables();
	initStatic();
	startTracking();
}

function draw () {
	requestAnimFrame(draw);
	trackingLoop();
	if(experienceBegin) {
		if(!introComplete) {
			intro();
			introComplete = true;
		}
	} else {
		animateStatic();
	}
}

$(function() {
	setup();
	draw();
});