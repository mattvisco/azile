var introSentence = "\n >  Hello,\n my name is Ernest. I am learning how to read emotions, can you help me?";
var smileSentence = "> Thank you for helping. Please can you smile for me."
var friendSentence = "> Thank you for helping. Can you think of a time with a friend that was particularly memorable."
var yOrN = "> [Type y/n to continue] ";
var blockInterval;
var ellipseIntervals = [];
var exitExperienceTimeout;

var textContainer = $('#text-container');
var textWrapper = $('#text-wrapper');

var TIMETILLRESET = 15000; // Upon a period of requiring user input, this will determine how long we wait until the experience auto reset

// Initilize one time listener to listen for y/n type if we need that to move chat flow foward
function initKeyListener () {
	$('body').keypress(function(event){
		if (listeningForAnswer) {
			if(event.key == 'y') {
				textContainer.append('y</p>');
					if (currentQuestion == 4) {
						guessCorrect = true;
						guessUpdate();
					} else if (currentQuestion == 6) { // If no means reset than include in this conditional
						currentQuestion = 2;
						gifSrc();
					}
				moveToNextStep();
			} else if (event.key == 'n') {
			textContainer.append('n</p>');
				if (currentQuestion == 1) { // If no means reset than include in this conditional
					resetAlize();
				} else if ( currentQuestion == 4) {
					guessCorrect = false;
					guessUpdate();
					moveToNextStep();
				} else if (currentQuestion == 6) {
					$( '#reportCard' ).show();
					reportTimeout = setTimeout(function() {
						resetAlize();
					}, 15000);
				} else {
					moveToNextStep();
				}
			}
		}
	})
}


// Scrolls the text container to be stay visible as text gets appended onto it
function scroll() {
	if (textContainer.height() + textContainer.position().top >= textWrapper.height() - 100) {
		textContainer.css({
	    top: "-=50",
	  });
	}
}

// Recursively calls typeSentence to produce the typing flow
// This function is asyncronous so requires the use of a callback to allow for sequential typing to work
function typeSentence(sentence, index, callback) {
	scroll();
	textContainer.append(sentence.charAt(index));
	index += 1;
	if (index < sentence.length) {
		typingTimeout = setTimeout(function(){
		    typeSentence(sentence, index, callback);
		}, 1);
	} else if (callback) {
		textContainer.append('</p>');
		typingTimeout = setTimeout(function(){
			callback();
		}, 400);
	} else {
		textContainer.append('</p>');
	}
}

// A simple function to pass into the <typeSentence> function if the question flow should end directly after a question has been asked
function questionAnswered() {
	console.log('qa');
	questionAnswered = true;
}

// Instant display of sentence
function displaySentence(sentence) {
	scroll();
	textContainer.append('<p>');
	textContainer.append(sentence);
}

// Generates the animating block that functions as a tip for the user to type
function animateBlock() {
	textContainer.append('<span class="block">&block;</span>');
	blockInterval = setInterval(function(){
		$('.block').toggle();
	},1000);
}

// First question, asks user if they would like to help the machine
function intro() {
	textContainer.append('<p>');
	typeSentence(introSentence, 0, yesOrNo);
}

// Prompt to get user to think of an important memory
function thinkOfFriend() {
	textContainer.append('<p>');
	typeSentence(friendSentence, 0);
	smileTimeout = setTimeout(function() {
		questionAnswered = true;
	}, 7000); // Wait 7s to determine emotion
}

function happyThoughts() {
	var nextSentence = "> Great! Let's get started:";
	textContainer.append('<p>');
	typeSentence(nextSentence, 0);
	smileTimeout = setTimeout(function() {
		questionAnswered = true;
	}, 2500); // Wait 4s to determine emotion
}

function gifTown() {
	$( '#gif' ).show();
	analyticsTimeout = setTimeout(function() {
		$( '#gif' ).hide();
		questionAnswered = true;
	}, 5000);
}
// First time machine analyzes human emotion and displays to user
// Question moves into emotionJudge and the user will have to input y/n
function emotionScore() {
	maxEmotionVal = Math.round(maxEmotion.value * 100); // convert emotion value into a percentage
	var calculatedEmotion = "> I am " + maxEmotionVal + "% confident that made you " + maxEmotion.emotion + ". Does that sound right?";
	typeSentence(calculatedEmotion, 0, yesOrNo);
}

// Converts emotion percentage value into a human readable analysis i.e. 80% happy = ecstatic, would need to do some work to
// QUESTION:  This could be a good spot to do a follow-up emotion track — I assume that what ever the computer judges will trigger some reaction?
// QUESTION: Branch begins after this, where does it go? How does agreeing or disagreeing effect the next question? What do we do with the emotional reaction this comment may generate?
function emotionJudge() {
	var emotionRating;
	if (maxEmotion.value > .8) {
		emotionRating = "> I've determined this made you very " + maxEmotion.emotion + "! Is that correct?";
	} else if (maxEmotion.value > .5) {
		emotionRating = "> I've determined this made you " + maxEmotion.emotion + ". Is that correct?";
	} else {
		emotionRating = "> I've determined this didn't have much of an effect. Is that correct?";
	}
	typeSentence(emotionRating, 0, yesOrNo);
}

// Example question
function nextQuestion() {
	var nextSentence = "whats up";
	textContainer.append('<p>');
	typeSentence(nextSentence, 0, questionAnswered);
}

// Example question
function monkeys() {
	var nextSentence = "> Now think of a time when the monkeys entered Uulanbataar.";
	textContainer.append('<p>');
	typeSentence(nextSentence, 0);
	smileTimeout = setTimeout(function() {
		questionAnswered = true;
	}, 7000); // Wait 7s to determine emotion
}

// Example Final Question
function end() {
	var nextSentence = "> I feel like I learned a lot from you! Have a great day.";
	textContainer.append('<p>');
	typeSentence(nextSentence, 0);
	smileTimeout = setTimeout(function() {
		questionAnswered = true;
	}, 4000); // Wait 7s to determine emotion
}

// Example Final Question
function oneMore() {
	var nextSentence = "> Thanks for helping me :) Can we try another?";
	textContainer.append('<p>');
	typeSentence(nextSentence, 0, yesOrNo);
}

// This function displays the y/n prompt
// Chat doesn't move forward until a user answers the question
function yesOrNo() {
	displaySentence(yOrN);
	animateBlock();
	listeningForAnswer = true; // This will allow the type listener to notify us if y/n has been typed
	exitExperienceTimeout = setTimeout(resetAlize, TIMETILLRESET); // On periods of waiting if it is too long reset experience
}

// This clears the question waiting setup and completes the question answer flow
function moveToNextStep() {
	clearInterval(blockInterval);
	$('.block').remove();
	clearTimeout(exitExperienceTimeout);
	listeningForAnswer = false;
	nextStep = setTimeout(function() {
		questionAnswered = true;
	}, 1000);
}
