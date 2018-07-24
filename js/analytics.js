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


function showAnalytics() {
  $( '#analytics' ).show();
  analyticsTimeout = setTimeout(function() {
    resetAlize();
  }, 7000);
}


