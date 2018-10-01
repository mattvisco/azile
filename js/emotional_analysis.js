        // set eigenvector 9 and 11 to not be regularized. This is to better detect motion of the eyebrows
        pModel.shapeModel.nonRegularizedVectors.push(9);
        pModel.shapeModel.nonRegularizedVectors.push(11);

/*********** setup of emotion detection *************/
var ctrack = new clm.tracker({useWebGL : true});
ctrack.init(pModel);
var ec = new emotionClassifier();
ec.init(emotionModel);
var emotionData = ec.getBlank();

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

  // emotionValues is used to rank the detectable emotions against each other
  var emotionValues = [];
  if (er) {
    if (currentQuestion == 3) {
      updateData(er);
    }
    for (var i = 0;i < er.length;i++) {
      emotionValues.push(er[i].value);
    }
    updateMaxEmotion(er, emotionValues);
    updateEmotionsAverage(emotionValues);
  }
  calculateFaceDistance();
}

function updateMaxEmotion(er, emotionValues) {
  // Set max to the index of the emotion with the maximum value within the array
  // 0 = anger
  // 1 = disgust
  // 2 = fear
  // 3 = sad
  // 4 = surprise
  // 5 = happy
  var max = emotionValues.indexOf(Math.max.apply(Math, emotionValues));


  // If q3 we are looking for strongest emotion during that period of question asked
  if (currentQuestion == 3) {
    if (er[max].value > maxEmotion.value) {
      maxEmotion = er[max];
      takeSnapshot();
      // console.log(maxEmotion);
    }
  } else if (currentQuestion != 4) {
      maxEmotion = {
        emotion: 'happy',
        value: 0
      }
  }

  // Log max for testing which emotion is dominant
  // console.log(max);
}

function calculateFaceDistance() {
  if(!dontLook){
    var positions = ctrack.getCurrentPosition();
    if (positions) {
      foundFace = true;
      faceDistance = getDistance(positions[0][0],positions[0][1],positions[14][0],positions[14][1]);
    } else {
      faceDistance = faceLow;
    }
  }
}

function updateEmotionsAverage(emotionValues) {
  var index = 0;
  for (var key in emotions) {
      emotions[key] += emotionValues[index];
      index++;
  }
  totalEmotionsRead++;
}

/*
Call this function when displaying final analytics page.
It calculates the strongest read emotion across the entire experience.
It returns and array in the form:
[emotionType, emotionValue]
*/
function calculateBaslineFace() {
  var baselineFace = [];
  var maxEmValue = 0;
  for (var key in emotions) {
      if(emotions[key] > maxEmValue) {
        baselineFace[0] = key;
        baselineFace[1] = emotions[key] / totalEmotionsRead;
        maxEmValue = emotions[key];
      }
  }
  return baselineFace;
}
