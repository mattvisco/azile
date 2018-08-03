var video
var overlay;
var overlayCC;

var foundFace = false;
var faceDistance = 0;
var faceLow = 1.2;
var faceHigh = 1.7;
var faceDetectionIsCurrent = false;
var faceTimestamp;

var experienceBegin = false;

var maxEmotion = {
	emotion: 'unsure',
	value: 0
}
var emotions = {
	anger: 0,
	disgust: 0,
	fear: 0,
	sad: 0,
	surprise: 0,
	happy: 0
};
var totalEmotionsRead = 0;
var smileTimeout;

var listeningForAnswer = false;

var currentQuestion = 0;
var questionAnswered = true;

var guessCorrect;
var maxEmotionVal;

var typingTimeout;



function initVariables() {
  // Face contour overlay
	overlay = document.getElementById('overlay');
	overlayCC = overlay.getContext('2d');
	$( '#overlay' ).hide();
	$( '#analytics' ).hide();
	$( '#gif' ).hide();
	gifSrc();
	createVideo();
}

function activateStaticCanvas() {
	$( "canvas" ).each(function(){
		if(!this.id) {
			$(this).fadeIn(3000);
		}
	})
}

// Reset all flags here
// TODO: this reset should prolly have some window of time until face search restarts (setTimeout around some variable reset, gotta think more to decide)
function resetAlize() {
	clearTimeout(typingTimeout);
	foundFace = false;
	faceDistance = 0;
	faceDetectionIsCurrent = false;
	experienceBegin = false;
	currentQuestion = 0;
	questionAnswered = true;
	listeningForAnswer = false;
	smileValue = 0.0;
	emotions = {
		anger: 0,
		disgust: 0,
		fear: 0,
		sad: 0,
		surprise: 0,
		happy: 0
	};
	totalEmotionsRead = 0;
	$('#text-container').empty();
	$('#text-container').css({
		top: 0
	});
	$( '#overlay' ).hide();
	$( '#analytics' ).hide();
	$( '#gif' ).hide();
	gifSrc();
	activateStaticCanvas();
}

document.onkeydown = function(evt) {
    evt = evt || window.event;
    var isEscape = false;
    if ("key" in evt) {
        isEscape = (evt.key == "Escape" || evt.key == "Esc");
    } else {
        isEscape = (evt.keyCode == 27);
    }
    if (isEscape) {
        resetAlize();
    }
};

//  GIF Randomizer
function gifSrc() {
  var img = document.getElementsByClassName('gifSrc');
  console.log(img);

  // Giphy tag query
  q = "cute";

  // Giphy API call
  var gif = $.get('https://api.giphy.com/v1/gifs/random?api_key=d4eZba5M86PHdo7wJuURZ3yCB3WHEEvF&tag=' + q );

  gif.done ( function(data) {
      data = JSON.parse(gif.responseText).data.image_url;
      console.log('gif');
	  for (var i = 0;i < img.length;i++) {
	  	img[i].src = data;
	  }
  });
}

function createVideo() {
	//Use webcam
	video = document.getElementById('videoel');
	video.width = 320;
	video.height = 240;
	video.autoplay = true;
	video.loop = true;
	video.volume  = 0;
	//Webcam video
	window.URL = window.URL || window.webkitURL;
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	//get webcam
	navigator.getUserMedia({
		video: true
	}, function(stream) {
		//on webcam enabled
		video.src = window.URL.createObjectURL(stream);
	}, function(error) {
		prompt.innerHTML = 'Unable to capture WebCam. Please reload the page.';
	});
};


function getDistance(lat1,lon1,lat2,lon2) {
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return c;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function map_range(value, low1, high1, low2, high2) {
	value = Math.max(low1, Math.min(high1,value));
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}
