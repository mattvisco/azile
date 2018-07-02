function setup () {
	initVariables();
	initStatic();
	startTracking();
}

function draw () {
	requestAnimFrame(draw);
	trackingLoop();
	if(experienceBegin) {
		if(!introComplete) { // would be great to have an inactivity reset function here, for when people just walk away
			setTimeout(intro,2000);
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