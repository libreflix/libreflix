const player = new Plyr('#player', {
  // debug: false,
  // quality: [1080, 720, 576, 480, 360, 240],
  // settings: ['captions', 'quality', 'speed', 'loop', 'controls']
});

player.on('loadstart', event => {
  document.getElementById("player").style.height = "100vh"
});
player.on('play', event => {
//  setTimeout(function(){ document.getElementById("exit-button").style.opacity = "0"; }, 2000);
});
player.on('playing', event => {
  document.getElementById("pl-imgbg").style.visibility = "hidden";
  document.getElementById("pl-player-title").style.visibility = "hidden";
  document.getElementById("logo_libre").style.opacity = "0";
  setTimeout(function(){ document.getElementById("exit-button").style.opacity = "0"; }, 2000);
});

player.on('pause', event => {
  document.getElementById("exit-button").style.opacity = "0.9";
  document.getElementById("pl-player-title").style.visibility = "visible";
  document.getElementById("logo_libre").style.opacity = "1";
});

player.on('loadeddata', event => {
  player.currentTime = player.currentTime
});
