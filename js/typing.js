var introSentence = ">  Hello user, my name is Ernest Alize. I am learning how to read emotions, can you help me?";
var smileSentence = "> Thank you for helping. Please can you smile for me."
var friendSentence = "> Thank you for helping. Can you think of a time with a friend that was particularly memorable."
var yOrN = "> [Type y/n to continue]";
var blockInterval;
var ellipseIntervals = [];
var exitExperienceTimeout;

var textContainer = $('#text-container');
var textWrapper = $('#text-wrapper');

function scroll() {
	if (textContainer.height() + textContainer.position().top >= textWrapper.height() - 100) {
		textContainer.css({
	    top: "-=50",
	  });
	}
}

function typeSentence(sentence, index, callback) {
	scroll();
	textContainer.append(sentence.charAt(index));
	index += 1;
	if (index < sentence.length) {
		setTimeout(function(){
		    typeSentence(sentence, index, callback);
		}, 33);
	} else if (callback) {
		textContainer.append('</p>');
		setTimeout(function(){
			callback();
		}, 400);
	} else {
		textContainer.append('</p>');
	}
}

function displaySentence(sentence) {
	scroll();
	textContainer.append('<p>');
	textContainer.append(sentence);
}

function animateBlock() {
	textContainer.append('<span class="block">&block;</span>');
	blockInterval = setInterval(function(){
		$('.block').toggle();
	},1000);
}

// Not working, needs more thought
function animateEllipse() {
	textContainer.append('<span class="ellipse" id="e1">.</span>');
	textContainer.append('<span class="ellipse" id="e2">.</span>');
	textContainer.append('<span class="ellipse" id="e3">.</span>');
	ellipseIntervals.push(setInterval(function(){
		$('#e1').toggle();
	},3000));
	ellipseIntervals.push(setInterval(function(){
		$('#e2').toggle();
	},1500));
	ellipseIntervals.push(setInterval(function(){
		$('#e3').toggle();
	},750));
}


function intro() {
	textContainer.append('<p>');
	typeSentence(introSentence, 0, userType);
}

function smileForMe() {
	textContainer.append('<p>');
	typeSentence(smileSentence, 0);
	smileTimeout = setTimeout(function() {
		questionAnswered = true;
	}, 5000); // If it takes more than 5s to smile than trigger end of question

	// TODO: some progress element
	// displaySentence("> Calculating", false);
	// animateEllipse();
	// textContainer.append('</p>');
}

function thinkOfFriend() {
	textContainer.append('<p>');
	typeSentence(friendSentence, 0);
	smileTimeout = setTimeout(function() {
		questionAnswered = true;
	}, 10000); // Wait 10s to determine emotion
}

function smileScore() {
	smileValue = Math.round(smileValue * 100);
	var calculatedHappiness = "> Based on my calculation you are " + smileValue + "% happy.";
	typeSentence(calculatedHappiness, 0, happyRating);
}

function happyRating() {
	var happyRating;
	if (smileValue > 80) {
		happyRating = "> I've determined you are happy. Is this correct?";
	} else {
		happyRating = "> I've determined you are unhappy. Is this correct?";
	}
	typeSentence(happyRating, 0, userType);
}

function emotionScore() {
	var maxEmotionVal = Math.round(maxEmotion.value * 100);
	var calculatedEmotion = "> I have been attempting to understand your emotions. I've found you to be " + maxEmotionVal + "% " + maxEmotion.emotion + ".";
	typeSentence(calculatedEmotion, 0, emotionJudge);
}

// This could be a good spot to do a follow-up emotion track — I assume that what ever the computer judges will trigger some reaction?
function emotionJudge() {
	var emotionRating;
	if (maxEmotion.value > .8) {
		emotionRating = "> I've determined this memory made you very " + maxEmotion.emotion + ". Is this correct?";
	} else if (maxEmotion.value > .5) {
		emotionRating = "> I've determined this memory made you " + maxEmotion.emotion + ". Is this correct?";
	} else {
		emotionRating = "> I've determined this memory made you a little " + maxEmotion.emotion + ". Is this correct?";
	}
	typeSentence(emotionRating, 0, userType);
}

function userType() {
	displaySentence(yOrN);
	animateBlock();
	listeningForAnswer = true;
	$('body').keypress(function(event){
		if (listeningForAnswer) {
			if(event.key == 'y') {
				textContainer.append('y</p>');
				moveToNextStep();
			} else if (event.key == 'n') {
				textContainer.append('n</p>');
				moveToNextStep();
				if (currentQuestion == 1) {
					resetAlize(); // TODO: this reset is glitchy, will prolly need some window of time until face search restarts
				}
			}
		}
	})
	exitExperienceTimeout = setTimeout(resetAlize, 10000);
}

function moveToNextStep() {
	clearInterval(blockInterval);
	$('.block').remove();
	clearTimeout(exitExperienceTimeout);
	listeningForAnswer = false;
	questionAnswered = true;
}
