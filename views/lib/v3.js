const player = new Plyr('#player', {
  // debug: false,
  // quality: [1080, 720, 576, 480, 360, 240],
  invertTime: false,
  quality: {
    default: 480,
    options: [480, 720, 1080]
  },
  // previewThumbnails: {
  //   enabled: true,
  //   src: ''
  // },
  settings: ['captions', 'quality', 'speed', 'controls'],
  controls: [
    'play-large',
    // 'restart',
    'rewind',
    'play',
    'fast-forward',
    'progress',
    'current-time',
    // 'duration',
    'mute',
    'volume',
    'captions',
    'settings',
    'pip',
    'airplay',
    // 'download',
    'fullscreen',
  ],
  // Localisation
  i18n: {
    restart: 'Recomeçar',
    rewind: 'Voltar {seektime}s',
    play: 'Reproduzir',
    pause: 'Pausar',
    fastForward: 'Avançar {seektime}s',
    seek: 'Seek',
    seekLabel: '{currentTime} de {duration}',
    played: 'Played',
    buffered: 'Buffered',
    currentTime: 'Current time',
    duration: 'Duration',
    volume: 'Volume',
    mute: 'Desabilitar Som',
    unmute: 'Habilitar Som',
    enableCaptions: 'Habilitar legendas',
    disableCaptions: 'Desabilitar legendas',
    download: 'Download',
    enterFullscreen: 'Tela cheia',
    exitFullscreen: 'Sair da tela cheia',
    frameTitle: 'Player for {title}',
    captions: 'Legendas',
    settings: 'Opções',
    menuBack: 'Go back to previous menu',
    speed: 'Velocidade',
    normal: 'Normal',
    quality: 'Qualidade',
    loop: 'Loop',
    start: 'Começo',
    end: 'Fim',
    all: 'Tudo',
    reset: 'Reset',
    disabled: 'Disabled',
    enabled: 'Enabled',
    advertisement: 'Ad',
    qualityBadge: {
      2160: '4K',
      1440: 'HD',
      1080: 'HD',
      720: 'HD',
      576: 'SD',
      480: 'SD',
    },
  },
  tooltips: {
    controls: true,
    seek: true,
  },
});

{#
player.source = {
  sources: [
    {% if w.webseed.sd %}
    {
      src: '{{ w.webseed.sd | safe }}',
      type: 'video/mp4',
      size: 480,
    },
    {% endif %}
    {% if w.webseed.hd %}
    {
      src: '{{ w.webseed.hd | safe }}',
      type: 'video/mp4',
      size: 720,
    },
    {% endif %}
    {% if w.webseed.fhd %}
    {
      src: '{{ w.webseed.fhd | safe }}',
      type: 'video/mp4',
      size: 1080,
    },
    {% endif %}
  ],
  // previewThumbnails: {
  //   src: '/path/to/thumbnails.vtt',
  // },
  // tracks: [
  //   {
  //     kind: 'captions',
  //     label: 'English',
  //     srclang: 'en',
  //     src: '/path/to/captions.en.vtt',
  //     default: true,
  //   },
  //   {
  //     kind: 'captions',
  //     label: 'French',
  //     srclang: 'fr',
  //     src: '/path/to/captions.fr.vtt',
  //   },
  // ],
};
#}

document.getElementById("player").style.height = "100vh"

player.on('canplay', event => {
  player.play();
});

player.on('loadeddata', event => {
  player.currentTime = player.currentTime;
});

player.on('loadedmetadata', event => {
  player.currentTime = player.currentTime;
});


window.onload = function() {
  document.getElementById("pl-final-screen").style.display = "none";
};


player.on('loadstart', event => {
  document.getElementById("player").style.height = "100vh";
  player.currentTime = player.currentTime;
  document.getElementById("pl-final-screen").style.display = "none";
  document.getElementById("pl-up-next").style.display = "none";
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
  document.getElementById("exit-button").style.opacity = "1";
  document.getElementById("pl-player-title").style.visibility = "visible";
  document.getElementById("logo_libre").style.opacity = "1";
});

player.on('ended', event => {
  player.destroy();
  document.getElementById('player').style.visibility = "hidden";

   //é aqui {{w_eps.last}}
   //é aqui {{ not w_eps.last}}

  {% if w.layout == "filme" or w_eps.last %}
  document.getElementById("pl-final-screen").style.display = "block";
  document.getElementById("pl-final-watch-again").style.backgroundImage = 'url("{{w.thumb480}}")';
  {% endif %}

  {% if w.layout == "serie" and not w_eps.last %}
  document.getElementById("pl-up-next").style.display = "block";
  document.getElementById("pl-up-next-bg").style.backgroundImage = 'url("{{w.imgbg}}")';
  document.getElementById("pl-watch-again").style.backgroundImage = 'url("{{w.thumb480}}")';
  document.getElementById("pl-up-next-image").style.backgroundImage = 'url("{{w.thumb480}}")';

  var time = 15;
  this.timerToNext = setInterval((function() {
    if(time > 0) {
      time--;
      document.getElementById('pl-up-next-timer').innerHTML = time + ' segundos';
    } else {
      this.onNextClick(this);
      document.getElementById('pl-up-next-timer').innerHTML = '15 segundos';
    }
    if(time < 1){
      nextEpisode()
    }
  }).bind(this), 1000);
  {% endif %}

});


var exitButton = document.getElementById("exit-button");

exitButton.addEventListener("mouseover", function() {
    exitButton.style.opacity = 1;

});

exitButton.addEventListener("mouseout", function() {
    if (player.playing){
      exitButton.style.opacity = 0;
    }
});

function nextEpisode() {
  window.location = "/assistir/{{w.permalink}}/ep/{{next_episode}}"
}

var client = new WebTorrent();

client.on('error', function (err) {
  console.error('ERROR: ' + err.message)
})

var mediatype = ".mp4"
var film_id = "{cyz6RWU>/r(tz^s"

{% if w.magnet.hd %}
var torrentId_hd = '{{ w.magnet.hd | safe }}'; var webseedId_hd = '{{ w.webseed.hd | safe | replace(".mp4","{cyz6RWU>/r(tz^s")}}'.replace(film_id,mediatype);
{% endif %}
{% if w.magnet.sd %}
var torrentId_sd = '{{ w.magnet.sd | safe }}'; var webseedId_sd = '{{ w.webseed.sd | safe | replace(".mp4","{cyz6RWU>/r(tz^s")}}'.replace(film_id,mediatype);
{% endif %}
{% if w.magnet.fhd %}
var torrentId_fhd = '{{ w.magnet.fhd | safe }}'; var webseedId_fhd = '{{ w.webseed.fhd | safe | replace(".mp4","{cyz6RWU>/r(tz^s")}}'.replace(film_id,mediatype);
{% endif %}

{% if w.magnet.sd %}
var torrentId = torrentId_sd;
var webseedId = webseedId_sd;
{% elif w.magnet.hd %}
var torrentId = torrentId_hd;
var webseedId = torrentId_hd;
{% elif w.magnet.fhd %}
var torrentId = torrentId_fhd;
var webseedId = torrentId_fhd;
{% endif %}



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
  torrent.addWebSeed(webseedId)

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
      torrent.addWebSeed(webseedId)
    }
  }, 1000)

  {# Function that add webseed if download to slow #}
  var addWs = true
  var removeWs = false
  var initialWs = true

  torrent.on('download', function (bytes) {
    // log('just downloaded: ' + bytes)
    // log('total downloaded: ' + torrent.downloaded)

    log('download speed: ' + torrent.downloadSpeed)

    if ((torrent.progress * 100) > 5 && initialWs){
      log("Removi o WebSeed. Peers:" + torrent.numPeers);
      torrent.removePeer(webseedId)
      addWs = true
      removeWs = false
      initialWs = false
    }
    else if (torrent.downloadSpeed < 200000 && addWs) {
      log("Adicionei o WebSeed. Peers:" + torrent.numPeers);
      torrent.addWebSeed(webseedId)
      addWs = false
      removeWs = true
    }
    else if (torrent.downloadSpeed >= 500000 && removeWs) {
      log("Removi o WebSeed. Peers:" + torrent.numPeers);
      torrent.removePeer(webseedId)
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

player.on('loadeddata', event => {
  player.currentTime = player.currentTime;
});

player.on('qualitychange', event => {
  console.log('oi ' + player.quality);
  if (player.quality == '480') {
    client.remove(torrentId)
    torrentId = torrentId_sd
    webseedId = webseedId_sd
    client.add(torrentId, onTorrent)
  }
  else if (player.quality == '720') {
    client.remove(torrentId)
    torrentId = torrentId_hd
    webseedId = webseedId_hd
    client.add(torrentId, onTorrent)
  }
  else if (player.quality == '1080') {
    client.remove(torrentId)
    torrentId = torrentId_fhd
    webseedId = webseedId_fhd
    client.add(torrentId, onTorrent)
  }
});
