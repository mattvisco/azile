function setup () {
	initVariables();
	initStatic();
	startTracking();
	$( '#overlay' ).fadeOut(1); // enables fadeIn/Out vs. setting opacity in CSS
}

function draw () {
	requestAnimFrame(draw);
	trackingLoop();
	if(experienceBegin) {
		if(!introComplete) { // would be great to have an inactivity reset function here, for when people just walk away
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