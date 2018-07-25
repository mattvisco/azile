function showAnalytics() {
  $( '#analytics' ).show();
  smileTimeout = setTimeout(function() {
    questionAnswered = true;
  $( '#analytics' ).hide();
  }, 5000); // Wait 7s to determine emotion
}

function takeSnapshot() {
  var video = document.getElementById('videoel')
      , canvas;
  var img = document.getElementById('emo1');
  var context;
  var width = video.offsetWidth
    , height = video.offsetHeight;

  canvas = canvas || document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, width, height);

  img.src = canvas.toDataURL('image/png');
}

function guessUpdate() {
  var guess = document.getElementById('guess');
  var guessResult = document.getElementById('guessResult');

  guess.textContent = maxEmotionVal + "% confidence: " + maxEmotion.emotion;

  if (guessCorrect == true) {
    guessResult.textContent = "Great, glad to hear my model is working!";
  } else {
    guessResult.textContent = "Sorry I didn't get it right, I'm still learning :-{";
  }

}
