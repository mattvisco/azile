var introSentence = ">  Hello user, my name is Ernest Alize. I am learning how to read emotions, can you help me?";
var smileSentence = "> Thank you for helping. Please can you smile for me."
var friendSentence = "> Thank you for helping. Can you think of a time with a friend that was particularly memorable."
var yOrN = "> [Type y/n to continue]";
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
				moveToNextStep();
			} else if (event.key == 'n') {
				textContainer.append('n</p>');
				moveToNextStep();
				if (currentQuestion == 1) { // If no means reset than include in this conditional
					resetAlize();
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
		setTimeout(function(){
		    typeSentence(sentence, index, callback);
		}, 1);
	} else if (callback) {
		textContainer.append('</p>');
		setTimeout(function(){
			callback();
		}, 400);
	} else {
		textContainer.append('</p>');
	}
}

// A simple function to pass into the <typeSentence> function if the question flow should end directly after a question has been asked
function questionAnswered() {
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
	var nextSentence = "Today I'm exploring how people react to certain stimuli. Let's start:";
	textContainer.append('<p>');
	typeSentence(nextSentence, 0);
	smileTimeout = setTimeout(function() {
		questionAnswered = true;
	}, 4000); // Wait 4s to determine emotion
}

function gifTown() {
	$( '#gif' ).show();
	analyticsTimeout = setTimeout(function() {
		$( '#gif' ).hide();
		takeSnapshot();
		questionAnswered = true;
	}, 5000);	
}
// First time machine analyzes human emotion and displays to user
// Question moves into emotionJudge and the user will have to input y/n
function emotionScore() {
	var maxEmotionVal = Math.round(maxEmotion.value * 100); // convert emotion value into a percentage
	var calculatedEmotion = "> I have been attempting to understand your emotions. I've found you to be " + maxEmotionVal + "% " + maxEmotion.emotion + ".";
	typeSentence(calculatedEmotion, 0, emotionJudge);
}

// Converts emotion percentage value into a human readable analysis i.e. 80% happy = ecstatic, would need to do some work to
// QUESTION:  This could be a good spot to do a follow-up emotion track — I assume that what ever the computer judges will trigger some reaction?
// QUESTION: Branch begins after this, where does it go? How does agreeing or disagreeing effect the next question? What do we do with the emotional reaction this comment may generate? 
function emotionJudge() {
	var emotionRating;
	if (maxEmotion.value > .8) {
		emotionRating = "> I've determined this memory made you very " + maxEmotion.emotion + ". Is this correct?";
	} else if (maxEmotion.value > .5) {
		emotionRating = "> I've determined this memory made you " + maxEmotion.emotion + ". Is this correct?";
	} else {
		emotionRating = "> I've determined this memory made you a little " + maxEmotion.emotion + ". Is this correct?";
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
	var nextSentence = "Now think of a time when the monkeys entered Uulanbataar.";
	textContainer.append('<p>');
	typeSentence(nextSentence, 0);
	smileTimeout = setTimeout(function() {
		questionAnswered = true;
	}, 7000); // Wait 7s to determine emotion
}

// Example Final Question
function end() {
	var nextSentence = "Thanks for your input. By learning to understand people my creators will soon be able to make our interactions more human.";
	textContainer.append('<p>');
	typeSentence(nextSentence, 0);
	smileTimeout = setTimeout(function() {
		questionAnswered = true;
	}, 5000); // Wait 7s to determine emotion
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
	questionAnswered = true;
}

