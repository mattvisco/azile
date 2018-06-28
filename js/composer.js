function setup () {
	initVariables();
	initStatic();
	startTracking();
}

function draw () {
	requestAnimFrame(draw);
	trackingLoop();
	animateStatic();
}

$(function() {
	setup();
	draw();
});