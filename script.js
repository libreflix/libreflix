$(document).ready(function() {


    var idleMouseTimer;
    var forceMouseHide = false;

    $("body").css('cursor', 'none');

    $("#wrapper").mousemove(function(ev) {
            if(!forceMouseHide) {
                    $("body").css('cursor', '');

                    clearTimeout(idleMouseTimer);

                    idleMouseTimer = setTimeout(function() {
                            $("body").css('cursor', 'none');

                            forceMouseHide = true;
                            setTimeout(function() {
                                    forceMouseHide = false;
                            }, 200);
                    }, 1000);
            }
    });
});

nf.player = function nfPlayer() {
  var self = this;

  this.upNextTimer;

  this.current;
  this.title;
  this.subtitle;
  this.video;
  this.videoID;
  this.placeholder;

  this.elPlayer = document.getElementById('nf-player');
  this.elVideo = document.getElementById('nf-video');
  this.elTitle = document.getElementById('nf-player-title').getElementsByTagName('h1')[0];
  this.elSubtitle = document.getElementById('nf-player-title').getElementsByTagName('h3')[0];
  this.elPlaceholder = document.getElementById('nf-placeholder');
  this.elSeek = document.getElementById('nf-playback-progress');
  this.elTime = document.getElementById('nf-playback-time');
  this.elRuntime = document.getElementById('nf-runtime');
  this.elLoaded = document.getElementById('nf-playback-loaded');
  this.elProgressBarWrap = document.getElementById('nf-playback-progress-wrap');
  this.elProgressPosition = document.getElementById('nf-playback-position');
  this.elInfoTitle = document.getElementById('nf-info-series');
  this.elInfoSubtitle = document.getElementById('nf-info-episode');
  this.elPopup = document.getElementById('nf-next-popup');
  this.elPopupImage = document.getElementById('nf-next-popup-image');
  this.elPopupSubtitle = document.getElementById('nf-next-popup-subtitle');
  this.elUpNext = document.getElementById('nf-up-next');
  this.elUpNextWatchAgain = document.getElementById('nf-watch-again');
  this.elUpNextBg = document.getElementById('nf-up-next-bg');
  this.elUpNextImage = document.getElementById('nf-up-next-image');
  this.elUpNextTitle = document.getElementById('nf-up-next-title').getElementsByTagName('h1')[0];
  this.elUpNextSubtitle = document.getElementById('nf-up-next-title').getElementsByTagName('h3')[0];
  this.elUpNextCounter = document.getElementById('nf-up-next-timer');
  this.elUpNextGo = document.getElementById('nf-up-next-go');
  this.elControls = document.getElementById('nf-player-ctrl-wrap');
  this.elControlsPlayback = document.getElementById('nf-playback-ctrls-wrap');
  this.elControlsAudio = document.getElementById('nf-audio-ctrls-wrap');
  this.elControlPlay = document.getElementById('nf-playback-play');
  this.elControlPause = document.getElementById('nf-playback-pause');
  this.elControlVolume = document.getElementById('nf-audio-volume');
  this.elControlMute = document.getElementById('nf-audio-mute');
  this.elControlsNav = document.getElementById('nf-navigation-ctrls-wrap');
  this.elControlNext = document.getElementById('nf-next');
  this.finalScreen = document.getElementById('nf-final-screen');
  this.finalWatchAgain = document.getElementById('nf-final-watch-again');
  this.elVolumeWrap = document.getElementById('nf-volume-wrap');
  this.elVolume = document.getElementById('nf-volume');
  this.elVolumeBar = document.getElementById('nf-volume-bar');

  this.hookListeners();

  this.setCurrent(0);
};

nf.player.prototype.setTitle = function (value) {
  this.title = value;
  this.elTitle.innerHTML = this.elInfoTitle.innerHTML = value;
}

nf.player.prototype.setSubtitle = function (value) {
  this.subtitle = value;
  this.elSubtitle.innerHTML = this.elInfoSubtitle.innerHTML = value;
}

nf.player.prototype.setPlaceholder = function (value) {
  this.placeholder = value;
  this.elPlaceholder.style.backgroundImage = 'url("' + value + '")';
}

nf.player.prototype.setVideo = function (value) {
  var self = this;

  this.videoID = value;

  if(this.video) {
    this.video.loadVideoById(value);
  } else {
    this.video = new YT.Player(this.elVideo, {
      height: '768',
      width: '1366',
      videoId: value,
      playerVars: {
        controls: 0,
        disablekb: 1,
        enablejsapi: 1,
        loop: 0,
        modestbranding: 1,
        rel: 0,
        start: 0,
        showinfo: 0,
        iv_load_policy: 3
      },
      events: {
        'onReady': self.onPlayerReady.bind(this),
        'onStateChange': self.onPlayerStateChange.bind(this)
      }
    });
  }
}

nf.player.prototype.changeInfo = function (title, subtitle, placeholder, video) {
  this.setTitle(title);
  this.setSubtitle(subtitle);
  this.setPlaceholder(placeholder);
  this.setVideo(video);
}

nf.player.prototype.showTime = function () {
  setInterval((function() {
    var remaining = this.video.getDuration() - this.video.getCurrentTime(),
        s = Math.floor(remaining) % 60,
        m = Math.floor(remaining / 60) % 60,
        h = Math.floor((remaining / 60) / 60) % 60;

    this.elTime.innerHTML = (h < 10 ? '' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
  }).bind(this), 100);
}

nf.player.prototype.showLoaded = function () {
  setInterval((function() {
    this.elLoaded.style.width = this.video.getVideoLoadedFraction() * 100 + '%';
  }).bind(this), 100);
}

nf.player.prototype.showProgressPosition = function () {
  setInterval((function() {
    if(this.isSeeking) return;

    this.elProgressPosition.style.width = (this.video.getCurrentTime() / this.video.getDuration()) * 100 + '%';
  }).bind(this), 100);
}

nf.player.prototype.setCurrent = function(current) {
  clearInterval(this.upNextTimer);
  this.elPlayer.classList.add('loading');

  this.current = current;

  this.changeInfo(
      nf.videos[current].title,
      nf.videos[current].subtitle,
      nf.videos[current].placeholder,
      nf.videos[current].video);

  this.elUpNext.style.display = 'none';

  this.finalWatchAgain.style.backgroundImage =
  this.elUpNextWatchAgain.style.backgroundImage = 'url("' + nf.videos[current].thumb480 + '")';
  this.setNext();

  if(this.current === nf.videos.length - 1) {
    this.finalWatchAgain.style.backgroundImage = 'url("' + nf.videos[0].thumb480 + '")';
  }
}

nf.player.prototype.setNext = function () {
  if(this.current === nf.videos.length - 1){
    this.elPopupImage.style.backgroundImage = 'url("imgs/obsabsorver.jpg")';
    this.elPopupSubtitle.innerHTML = "Outros títulos";
    return;
  }

  this.elUpNextBg.style.backgroundImage = 'url("' + nf.videos[this.current + 1].placeholder + '")';
  this.elUpNextImage.style.backgroundImage = 'url("' + nf.videos[this.current + 1].thumb480 + '")';
  this.elPopupImage.style.backgroundImage = 'url("' + nf.videos[this.current + 1].thumb130 + '")';

  this.elPopupSubtitle.innerHTML = this.elUpNextSubtitle.innerHTML = nf.videos[this.current + 1].subtitle;
  this.elUpNextTitle.innerHTML = nf.videos[this.current + 1].title;
  this.elRuntime.innerHTML = nf.videos[this.current + 1].runtime;
}

nf.player.prototype.hookListeners = function () {
  this.elPlayer.addEventListener('contextmenu', function(e){ e.preventDefault() });

  this.elControlPlay.addEventListener('click', this.onPlayClick.bind(this));
  this.elControlPause.addEventListener('click', this.onPauseClick.bind(this));

  this.elControlVolume.addEventListener('click', this.onVolumeClick.bind(this));
  this.elControlMute.addEventListener('click', this.onMuteClick.bind(this));

  this.elPopup.getElementsByClassName('inner')[0].addEventListener('click', this.onNextClick.bind(this));
  //this.elControlNext.addEventListener('click', this.onNextClick.bind(this));
  this.elUpNextGo.addEventListener('click', this.onNextClick.bind(this));
  this.elUpNextWatchAgain.addEventListener('click', this.onWatchAgainClick.bind(this));
  this.finalWatchAgain.addEventListener('click', this.onWatchAgainClick.bind(this));

  this.elControlsAudio.addEventListener('mouseenter', this.onVolumeControlsHover.bind(this));
  this.elControlsAudio.addEventListener('mouseleave', this.onVolumeControlsLeave.bind(this));

  //this.elControlsNav.addEventListener('mouseenter', this.onNextHover.bind(this));
  //this.elControlsNav.addEventListener('mouseleave', this.onNextLeave.bind(this));

  this.elSeek.addEventListener('mousedown', this.startSeek.bind(this));
  document.addEventListener('mouseup', this.stopSeek.bind(this));

  this.elVolume.addEventListener('mousedown', this.startVolumeChange.bind(this));
  document.addEventListener('mouseup', this.stopVolumeChange.bind(this));

  this.elPlayer.addEventListener('mousemove', this.showControls.bind(this));

  window.addEventListener('keypress', (function(e) {
    var k = e.keyCode || e.which;

    if(k === 0 || k === 32) {
      if(this.video.getPlayerState() <= 0) return;

      if(this.video.getPlayerState() === 1) {
        this.onPauseClick();
      } else {
        this.onPlayClick();
      }
    }
  }).bind(this));

  document.getElementById('nf-fs').addEventListener('click', (function() {
    var elem = this.elPlayer;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
    document.getElementById('nf-fs-wrap').classList.add('fs');
  }).bind(this));

  document.getElementById('nf-fs-ex').addEventListener('click', (function(){
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
    document.getElementById('nf-fs-wrap').classList.remove('fs');
  }).bind(this));
}

nf.player.prototype.onPlayerReady = function () {
  this.video.playVideo();
  this.showTime();
  this.showLoaded();
  this.showProgressPosition();
}

nf.player.prototype.onPlayerStateChange = function (e) {
  switch(e.data) {
    case -1: // Not initialized
      break;
    case 0: // Ended
      this.onPause.call(this);
      this.onEnded.call(this);
      break;
    case 1: // Playing
      this.onPlay.call(this);
      break;
    case 2: // Paused
      this.onPause.call(this);
      break;
    case 3: // Buffering
      break;
    case 5: // Cued
      break;
  }
}

nf.player.prototype.onPlay = function () {
  this.elPlayer.classList.remove('loading');
  this.elControlsPlayback.classList.add('pause');
  this.elControlsPlayback.classList.remove('play');
  this.elVolumeBar.style.height = this.video.getVolume() + '%';
  this.showControls();
}

nf.player.prototype.onPause = function () {
  this.elControlsPlayback.classList.add('play');
  this.elControlsPlayback.classList.remove('pause');
}

nf.player.prototype.onEnded = function () {
  if(this.current < nf.videos.length - 1) {
    this.elUpNext.style.display = 'block';

    var time = 15;
    this.upNextTimer = setInterval((function() {
      if(time > 0) {
        time--;
        this.elUpNextCounter.innerHTML = time + ' segundos';
      } else {
        this.onNextClick(this);
        this.elUpNextCounter.innerHTML = '15 segundos';
      }
    }).bind(this), 333);
  } else {
    this.finalScreen.style.display = 'block';
  }
}

nf.player.prototype.onPlayClick = function () {
  this.video.playVideo();
}

nf.player.prototype.onPauseClick = function () {
  this.video.pauseVideo();
}

nf.player.prototype.onVolumeClick = function () {
  this.video.mute();

  this.elControlsAudio.classList.add('mute');
  this.elControlsAudio.classList.remove('volume');
}

nf.player.prototype.onMuteClick = function () {
  this.video.unMute();

  this.elControlsAudio.classList.add('volume');
  this.elControlsAudio.classList.remove('mute');
}

nf.player.prototype.onNextClick = function () {
  if(this.current < nf.videos.length - 1) {
    this.setCurrent(this.current + 1);
  } else {
    this.video.pauseVideo();
    this.finalScreen.style.display = 'block';
  }
}

nf.player.prototype.onWatchAgainClick = function () {
  this.finalScreen.style.display = 'none';
  if(this.current === nf.videos.length - 1) {
    this.setCurrent(0);
  } else {
    this.setCurrent(this.current);
  }
}

nf.player.prototype.hideVolumeWrap = function () {
  this.elVolumeWrap.style.display = 'none';
  this.elVolumeWrap.removeEventListener('transitionend', this.hideVolumeWrapBind)
}

nf.player.prototype.onVolumeControlsHover = function () {
  this.hideSeekBar();
  this.elVolumeWrap.removeEventListener('transitionend', this.hideVolumeWrapBind);
  this.elVolumeWrap.style.display = 'block';
  setTimeout((function(){
    this.elVolumeWrap.style.opacity = 1;
  }).bind(this), 10);
}

nf.player.prototype.onVolumeControlsLeave = function () {
  this.showSeekBar();
  this.hideVolumeWrapBind = (function() {
    this.elVolumeWrap.style.display = 'none';
    this.elVolumeWrap.removeEventListener('transitionend', this.hideVolumeWrapBind);
  }).bind(this);

  this.elVolumeWrap.addEventListener('transitionend', this.hideVolumeWrapBind);

  var timer = setInterval((function() {
    if(this.isChangingVolume) {
      return;
    }

    this.elVolumeWrap.style.opacity = 0;
    clearInterval(timer);
  }).bind(this),10);
}

nf.player.prototype.hideNext = function () {
  this.elPopup.style.display = 'none';
  this.elPopup.removeEventListener('transitionend', this.hideNextBind)
}

nf.player.prototype.onNextHover = function () {
  this.hideSeekBar();
  this.elPopup.removeEventListener('transitionend', this.hideNextBind);
  this.elPopup.style.display = 'block';
  setTimeout((function(){
    this.elPopup.style.opacity = 1;
  }).bind(this),10);
}

nf.player.prototype.onNextLeave = function () {
  this.showSeekBar();
  this.hideNextBind = (function() {
    this.elPopup.style.display = 'none';
    this.elPopup.removeEventListener('transitionend', this.hideNextBind);
  }).bind(this);

  this.elPopup.addEventListener('transitionend', this.hideNextBind);
  this.elPopup.style.opacity = 0;
}


nf.player.prototype.startSeek = function (e) {
  this.isSeeking = true;
  this.bindSeek = this.seek.bind(this);
  this.bindSeek(e);
  this.elSeek.addEventListener('mousemove', this.bindSeek);
}

nf.player.prototype.stopSeek = function (e) {
  if(!this.isSeeking) return;

  var layerX = e.clientX - this.elSeek.getBoundingClientRect().left,
      seconds = (layerX / this.elSeek.clientWidth) * this.video.getDuration();

  seconds = (seconds < 0 ? 0 : seconds > this.video.getDuration()-1 ? this.video.getDuration()-1 : seconds);

  this.video.seekTo(seconds, true);

  this.isSeeking = false;

  this.elSeek.removeEventListener('mousemove', this.bindSeek);
}

nf.player.prototype.seek = function(e) {
  var layerX = e.clientX - this.elSeek.getBoundingClientRect().left,
      seconds = (layerX / this.elSeek.clientWidth) * this.video.getDuration(),
      progress = (seconds / this.video.getDuration()) * 100;

  progress = (progress < 0 ? 0 : progress > 100 ? 100 : progress);
  seconds = (seconds < 0 ? 0 : seconds > this.video.getDuration() ? this.video.getDuration() : seconds);

  this.video.seekTo(seconds, false);
  this.elProgressPosition.style.width = progress + '%';
}


nf.player.prototype.startVolumeChange = function(e) {
  this.isChangingVolume = true;
  this.bindVolumeChange = this.volumeChange.bind(this);
  this.bindVolumeChange(e);
  this.elVolume.addEventListener('mousemove', this.bindVolumeChange);
}

nf.player.prototype.stopVolumeChange = function(e) {
  if(!this.isChangingVolume) return;

  var layerY = e.clientY - this.elVolume.getBoundingClientRect().top,
      volume = 100 - (layerY / this.elVolume.clientHeight) * 100;

  this.isChangingVolume = false;

  this.elVolume.removeEventListener('mousemove', this.bindVolumeChange);
}

nf.player.prototype.volumeChange = function(e) {
  if(window.YT === undefined) return;

  var layerY = e.clientY - this.elVolume.getBoundingClientRect().top,
      volume = 100 - (layerY / this.elVolume.clientHeight) * 100;

  volume = (volume < 0 ? 0 : volume > 100 ? 100 : volume);
  this.video.setVolume(volume);

  this.elVolumeBar.style.height = volume + '%';
};

nf.player.prototype.hideSeekBar = function () {
  this.elProgressBarWrap.classList.add('hide');
}

nf.player.prototype.showSeekBar = function () {
  this.elProgressBarWrap.classList.remove('hide');
}

nf.player.prototype.hideControls = function () {
  this.controlsHideBind = (function(){
    this.elControls.style.display = 'none';
    this.elControls.addEventListener('transitionend', this.controlsHideBind);
  }).bind(this);

  this.elControls.addEventListener('transitionend', this.controlsHideBind);
  this.elControls.classList.add('hide');
}

nf.player.prototype.showControls = function () {
  clearTimeout(this.controlsTimer);

  this.elControls.style.display = 'block';
  this.elControls.removeEventListener('transitionend', this.controlsHideBind);
  this.elControls.classList.remove('hide');
  this.controlsTimer = setTimeout(this.hideControls.bind(this), 3000);
}
