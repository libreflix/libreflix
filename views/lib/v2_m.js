const player = new Plyr('#player', {
  // debug: false,
  // quality: [1080, 720, 576, 480, 360, 240],
  invertTime: false,
  quality: {
    default: 480
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

player.on('canplay', event => {
  player.play();
});

player.on('loadeddata', event => {
  player.currentTime = player.currentTime;
});

player.on('loadedmetadata', event => {
  player.currentTime = player.currentTime;
});


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
  document.getElementById("pl-up-next-image").style.backgroundImage = 'url("{{ w_eps.thumb480 or w.thumb480 }}")';


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
