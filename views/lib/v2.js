var client = new WebTorrent();

client.on('error', function (err) {
  console.error('ERROR: ' + err.message)
})

var torrentId = '{{ w.magnet.sd | safe }}';

const player = new Plyr('#player', {
  debug: false,
  hideControls: true,
  quality: [1080, 720, 576, 480, 360, 240],
  settings: ['captions', 'quality', 'speed', 'loop']
});
document.getElementById("player").style.height = "100vh"

client.add(torrentId, onTorrent)

function onTorrent (torrent) {
  log('Got torrent metadata!')
  log(
    'Torrent info hash: ' + torrent.infoHash + ' ' +
    '<a href="' + torrent.magnetURI + '" target="_blank">[Magnet URI]</a> ' +
    '<a href="' + torrent.torrentFileBlobURL + '" target="_blank" download="' + torrent.name + '.torrent">[Download .torrent]</a>'
  )

  var file = torrent.files.find(function(file) {
    return file.name.endsWith('.mp4')
  });

  log("Adicionei o WebSeed. Peers:" + torrent.numPeers);
  torrent.addWebSeed('{{w.webseed.sd}}')

  file.renderTo('video', {
    autoplay: true,
    muted: true
  }, function callback() {
    log("ready to play!");
    document.getElementById("player").style.height = "100vh";
    setTimeout(function(){ player.play(); }, 2000);
  });

  // Print out progress every 5 seconds
  var interval = setInterval(function () {
    log('Progress: ' + (torrent.progress * 100).toFixed(1) + '%')
    if (torrent.downloadSpeed == 0){
      log("Adicionei o WebSeed. Peers:" + torrent.numPeers);
      torrent.addWebSeed('{{w.webseed.sd}}')
    }
  }, 1000)

  // Function that add webseed if download to slow
  var addWs = true
  var removeWs = false
  var initialWs = true

  torrent.on('download', function (bytes) {
    // log('just downloaded: ' + bytes)
    // log('total downloaded: ' + torrent.downloaded)

    log('download speed: ' + torrent.downloadSpeed)

    if ((torrent.progress * 100) > 5 && initialWs){
      log("Removi o WebSeed. Peers:" + torrent.numPeers);
      torrent.removePeer('{{w.webseed.sd}}')
      addWs = true
      removeWs = false
      initialWs = false
    }
    if (torrent.downloadSpeed < 200000 && addWs) {
      log("Adicionei o WebSeed. Peers:" + torrent.numPeers);
      torrent.addWebSeed('{{w.webseed.sd}}')
      addWs = false
      removeWs = true
    }
    if (torrent.downloadSpeed >= 500000 && removeWs) {
      log("Removi o WebSeed. Peers:" + torrent.numPeers);
      torrent.removePeer('{{w.webseed.sd}}')
      addWs = true
      removeWs = false
    }
    // log('progress: ' + torrent.progress)
  })
}

function log (str) {
  {% if user.mod or user.adm %}
  console.log(str);
  {% endif %}
}

player.on('play', event => {
  setTimeout(function(){ document.getElementById("exit-button").style.opacity = "0"; }, 2000);
});
player.on('playing', event => {
  document.getElementById("pl-imgbg").style.visibility = "hidden";
  document.getElementById("pl-player-title").style.visibility = "hidden";
});

player.on('controlsshown', event => {
  document.getElementById("exit-button").style.opacity = "0.9";
});

player.on('pause', event => {
  document.getElementById("exit-button").style.opacity = "0.9";
  document.getElementById("pl-player-title").style.visibility = "visible";
});