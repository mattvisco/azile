// max will be set to whichever emotion is detected as dominant
var max;


/*********** setup of emotion detection *************/

var ctrack = new clm.tracker({useWebGL : true});
ctrack.init(pModel);

function startTracking() {
  // start tracking
  ctrack.start(video);
}

// Where the magic happens
function trackingLoop() {
  overlayCC.clearRect(0, 0, overlay.width, overlay.height);
  if (ctrack.getCurrentPosition()) {
    ctrack.draw(overlay, undefined, 'vertices'); // vertices mesh vs. contour
  }
  var cp = ctrack.getCurrentParameters();

  var er = ec.meanPredict(cp);
  // console.log(er);
  // console.log(er.length);

  // maxArr is used to rank the detectable emotions against each other
  var maxArr = [];
  if (er) {

    if (currentQuestion == 2) { // If q1 we are waiting for a smiling to complete the question loop
      smileValue = Math.max(smileValue, er[5].value);
      if (er[5].value > 0.8) {
        questionAnswered = true;
        clearTimeout(smileTimeout);
      }
    }

    for (var i = 0;i < er.length;i++) {
      // Push the numerical value of each detected emotion to maxArr
      maxArr.push(er[i].value);
    }
    // Set max to the index of the emotion with the maximum value within the array
    // 0 = anger
    // 1 = disgust
    // 2 = fear
    // 3 = sad
    // 4 = surprise
    // 5 = happy
    max = maxArr.indexOf(Math.max.apply(Math, maxArr));

    // Log max for testing which emotion is dominant
    // console.log(max);
  }

  var positions = ctrack.getCurrentPosition();
  if (positions) {
    foundFace = true;
    faceDistance = getDistance(positions[0][0],positions[0][1],positions[14][0],positions[14][1]);
  }

}

var ec = new emotionClassifier();
ec.init(emotionModel);
var emotionData = ec.getBlank();


// Emotion based photo trigger runs every 1s
// setInterval(function () {
//     takeSnapshot();
//   }, 1000);


function takeSnapshot() {
  var emotion = [
    anger,
    disgust,
    fear,
    sad,
    surprise,
    happy
  ];

  // Get IMG by ID based on which emotion is in the max var
  var j = emotion[max];
  console.log(j);

  var context;
  var width = video.offsetWidth
    , height = video.offsetHeight;

  canvas = canvas || document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  // TODO: If we use this fn we should give the canvas ids or class so we don't knock um out when we fadeOut static canvas

  context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, width, height);

  j.src = canvas.toDataURL('image/png');
  // document.body.appendChild(img);
}
