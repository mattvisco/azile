var intro_sentence = ">  Hello user, my name is Ernest Alize. I am learning how to read emotions, can you help me?";
var yOrN = "> [Type y/n to continue]";
var blockInterval;
var exitExperienceTimeout;

function typeSentence(sentence,div,index, callback) {
	div.append(sentence.charAt(index));
	index += 1;
	if (index < sentence.length) {
		setTimeout(function(){
		    typeSentence(sentence, div, index, callback);
		}, 33);
	} else if (callback) {
		div.append('</p>');
		setTimeout(function(){
			callback();
		}, 400);
	} else {
		div.append('</p>');
	}
}

function displaySentence(sentence,div) {
	div.append('<p>');
	div.append(sentence);
	div.append('<span class="block">&block;</span>');
	blockInterval = setInterval(function(){
		$('.block').toggle();
	},1000);
}



function intro() {
	$('#text-container').append('<p>');
	typeSentence(intro_sentence, $('#text-container'), 0, userType);
}

function moveToNextStep() {
	clearInterval(blockInterval);
	$('.block').remove();
	clearTimeout(exitExperienceTimeout);
	listeningForAnswer = false;
}

function userType() {
	displaySentence(yOrN, $('#text-container'));
	listeningForAnswer = true;
	// TODO: add something to clear this listener
	$('body').keypress(function(event){
		if (listeningForAnswer) {
			if(event.key == 'y') {
				$('#text-container').append('y</p>');
				moveToNextStep();
			} else if (event.key == 'n') {
				$('#text-container').append('n</p>');
				moveToNextStep();
				resetAlize(); // TODO: this reset is glitchy, will prolly need some window of time until face search restarts
			}
		}
	})
	exitExperienceTimeout = setTimeout(resetAlize, 10000);
}