function setup () {
	initVariables();
	initStatic();
	startTracking();
	// initializeEscToReset();
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
	console.log(currentQuestion);
}

function tempFunctionUsedForPrintingOutDatBaseFace() {
	var baseline = calculateBaslineFace();
	console.log('your resting face is ' + baseline[0] + 'with ' + baseline[1] + ' certainty.');
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
				askQuestion(happyThoughts, false);
			} else if (currentQuestion == 2) {
				askQuestion(gifTown, false);
			} else if (currentQuestion == 3) {
				askQuestion(emotionScore, false);
			} else if (currentQuestion == 4) {
				askQuestion(showAnalytics, false);
				console.log(guessCorrect);
			} else if (currentQuestion == 5) {
				askQuestion(oneMore, false);
				tempFunctionUsedForPrintingOutDatBaseFace();
			} else if (currentQuestion == 6) {
				resetAlize();
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
