var intro_sentence = "Hello user, my name is Ernest Alize. I am learning how to read emotions, can you help me?";
var y_or_n = "To agree type [y/n]";

function typeSentence(sentence,div,index) {
	div.append(sentence.charAt(index));
	index += 1;
	if (index < sentence.length) {
		setTimeout(function(){
		    typeSentence(sentence, div, index);
		}, 200);
	}
}



function intro() {
	typeSentence(intro_sentence, $('#intro'), 0);
}