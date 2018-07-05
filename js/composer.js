function setup () {
	initVariables();
	initStatic();
	startTracking();
	initializeEscToReset();
}

function askQuestion(question, timeout, timeoutAmt) {
	if(timeout) {
		setTimeout(question,timeoutAmt);
	} else {
		question();
	}
	questionAnswered = false;
	currentQuestion++;
}

function draw () {
	requestAnimFrame(draw);
	trackingLoop();
	if(experienceBegin) {
		if (questionAnswered) {
			if(currentQuestion == 0) {
				askQuestion(intro, true, 2000);
			} else if (currentQuestion == 1) {
				askQuestion(smileForMe, false);
			} else if (currentQuestion == 2) {
				// set some timeout for no smile
				askQuestion(smileScore, false);
			}
		}
	} else {
		animateStatic();
	}
}

$(function() {
	setup();
	draw();
});
