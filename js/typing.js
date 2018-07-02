var intro_sentence = ">  Hello user, my name is Ernest Alize. I am learning how to read emotions, can you help me?";
var yOrN = "> [Type y/n to continue]";

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
	setInterval(function(){
		$('.block').toggle();
	},400);
}



function intro() {
	$( "canvas" ).fadeOut(3000);
	$('#intro').append('<p>');
	typeSentence(intro_sentence, $('#intro'), 0, userType);
}

function userType() {
	displaySentence(yOrN, $('#intro'));
}