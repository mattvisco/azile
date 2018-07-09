function setup () {
	initVariables();
	initStatic();
	startTracking();
	initializeEscToReset();
	initKeyListener();
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
				// askQuestion(smileForMe, false);
				askQuestion(thinkOfFriend, false);
			} else if (currentQuestion == 2) {
				askQuestion(emotionScore, false);
			} else if (currentQuestion == 3) {
				// Example question, remove when ready to put real question in
				askQuestion(nextQueastion, false);
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
