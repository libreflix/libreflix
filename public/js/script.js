

lb.player = function lbPlayer() {
  var self = this;

  this.upNextTimer;

  this.current;
  this.title;
  this.subtitle;
  this.video;
  this.videoID;
  this.imgbg;

  this.elPlayer = document.getElementById('pl-player');
  this.elVideo = document.getElementById('pl-video');
  this.elTitle = document.getElementById('pl-player-title').getElementsByTagName('h1')[0];
  this.elSubtitle = document.getElementById('pl-player-title').getElementsByTagName('h3')[0];
  this.elimgbg = document.getElementById('pl-imgbg');
  this.elSeek = document.getElementById('pl-playback-progress');
  this.elTime = document.getElementById('pl-playback-time');
  this.elRuntime = document.getElementById('pl-runtime');
  this.elLoaded = document.getElementById('pl-playback-loaded');
  this.elProgressBarWrap = document.getElementById('pl-playback-progress-wrap');
  this.elProgressPosition = document.getElementById('pl-playback-position');
  this.elInfoTitle = document.getElementById('pl-info-series');
  this.elInfoSubtitle = document.getElementById('pl-info-episode');
  //this.elPopup = document.getElementById('pl-next-popup');
  // this.elPopupImage = document.getElementById('pl-next-popup-image');
  // this.elPopupSubtitle = document.getElementById('pl-next-popup-subtitle');
  this.elUpNext = document.getElementById('pl-up-next');
  this.elUpNextWatchAgain = document.getElementById('pl-watch-again');
  this.elUpNextBg = document.getElementById('pl-up-next-bg');
  this.elUpNextImage = document.getElementById('pl-up-next-image');
  this.elUpNextTitle = document.getElementById('pl-up-next-title').getElementsByTagName('h1')[0];
  this.elUpNextSubtitle = document.getElementById('pl-up-next-title').getElementsByTagName('h3')[0];
  this.elUpNextCounter = document.getElementById('pl-up-next-timer');
  this.elUpNextGo = document.getElementById('pl-up-next-go');
  this.elControls = document.getElementById('pl-player-ctrl-wrap');
  this.elControlsPlayback = document.getElementById('pl-playback-ctrls-wrap');
  this.elControlsAudio = document.getElementById('pl-audio-ctrls-wrap');
  this.elControlPlay = document.getElementById('pl-playback-play');
  this.elControlPause = document.getElementById('pl-playback-pause');
  this.elControlVolume = document.getElementById('pl-audio-volume');
  this.elControlMute = document.getElementById('pl-audio-mute');
  this.elControlsNav = document.getElementById('pl-navigation-ctrls-wrap');
  this.elControlNext = document.getElementById('pl-next');
  this.finalScreen = document.getElementById('pl-final-screen');
  this.finalWatchAgain = document.getElementById('pl-final-watch-again');
  this.elVolumeWrap = document.getElementById('pl-volume-wrap');
  this.elVolume = document.getElementById('pl-volume');
  this.elVolumeBar = document.getElementById('pl-volume-bar');

  this.hookListeners();

  this.setCurrent(0);
};

lb.player.prototype.setTitle = function (value) {
  this.title = value;
  this.elTitle.innerHTML = this.elInfoTitle.innerHTML = value;
}

lb.player.prototype.setSubtitle = function (value) {
  this.subtitle = value;
  this.elSubtitle.innerHTML = this.elInfoSubtitle.innerHTML = value;
}

lb.player.prototype.setimgbg = function (value) {
  this.imgbg = value;
  this.elimgbg.style.backgroundImage = 'url("' + value + '")';
}

lb.player.prototype.setVideo = function (value) {
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
        iv_load_policy: 3,
        cc_load_policy: 1
      },
      events: {
        'onReady': self.onPlayerReady.bind(this),
        'onStateChange': self.onPlayerStateChange.bind(this)
      }
    });
  }
}

lb.player.prototype.changeInfo = function (title, subtitle, imgbg, video) {
  this.setTitle(title);
  this.setSubtitle(subtitle);
  this.setimgbg(imgbg);
  this.setVideo(video);
}

lb.player.prototype.showTime = function () {
  setInterval((function() {
    var remaining = this.video.getDuration() - this.video.getCurrentTime(),
        s = Math.floor(remaining) % 60,
        m = Math.floor(remaining / 60) % 60,
        h = Math.floor((remaining / 60) / 60) % 60;

    this.elTime.innerHTML = (h < 10 ? '' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
  }).bind(this), 100);
}

lb.player.prototype.showLoaded = function () {
  setInterval((function() {
    this.elLoaded.style.width = this.video.getVideoLoadedFraction() * 100 + '%';
  }).bind(this), 100);
}

lb.player.prototype.showProgressPosition = function () {
  setInterval((function() {
    if(this.isSeeking) return;

    this.elProgressPosition.style.width = (this.video.getCurrentTime() / this.video.getDuration()) * 100 + '%';
  }).bind(this), 100);
}

lb.player.prototype.setCurrent = function(current) {
  clearInterval(this.upNextTimer);
  this.elPlayer.classList.add('loading');

  this.current = current;

  this.changeInfo(
      lb.videos[current].title,
      lb.videos[current].subtitle,
      lb.videos[current].imgbg,
      lb.videos[current].video);

  this.elUpNext.style.display = 'none';

  this.finalWatchAgain.style.backgroundImage =
  this.elUpNextWatchAgain.style.backgroundImage = 'url("' + lb.videos[current].thumb480 + '")';
  this.setNext();

  if(this.current === lb.videos.length - 1) {
    this.finalWatchAgain.style.backgroundImage = 'url("' + lb.videos[0].thumb480 + '")';
  }
}

// lb.player.prototype.setNext = function () {
//   if(this.current === lb.videos.length - 1){
//     this.elPopupImage.style.backgroundImage = 'url("/img/obsabsorver.jpg")';
//     this.elPopupSubtitle.innerHTML = "Outros títulos";
//     return;
//   }
//
//   this.elUpNextBg.style.backgroundImage = 'url("' + lb.videos[this.current + 1].imgbg + '")';
//   this.elUpNextImage.style.backgroundImage = 'url("' + lb.videos[this.current + 1].thumb480 + '")';
//   this.elPopupImage.style.backgroundImage = 'url("' + lb.videos[this.current + 1].thumb130 + '")';
//
//   this.elPopupSubtitle.innerHTML = this.elUpNextSubtitle.innerHTML = lb.videos[this.current + 1].subtitle;
//   this.elUpNextTitle.innerHTML = lb.videos[this.current + 1].title;
//   this.elRuntime.innerHTML = lb.videos[this.current + 1].runtime;
// }

lb.player.prototype.hookListeners = function () {
  this.elPlayer.addEventListener('contextmenu', function(e){ e.preventDefault() });

  this.elControlPlay.addEventListener('click', this.onPlayClick.bind(this));
  this.elControlPause.addEventListener('click', this.onPauseClick.bind(this));

  this.elControlVolume.addEventListener('click', this.onVolumeClick.bind(this));
  this.elControlMute.addEventListener('click', this.onMuteClick.bind(this));

  // this.elPopup.getElementsByClassName('inner')[0].addEventListener('click', this.onNextClick.bind(this));
  //this.elControlNext.addEventListener('click', this.onNextClick.bind(this));
  this.elUpNextGo.addEventListener('click', this.onNextClick.bind(this));
  this.elUpNextWatchAgain.addEventListener('click', this.onWatchAgainClick.bind(this));
  this.finalWatchAgain.addEventListener('click', this.onWatchAgainClick.bind(this));

  this.elControlsAudio.addEventListener('mouseenter', this.onVolumeControlsHover.bind(this));
  this.elControlsAudio.addEventListener('mouseleave', this.onVolumeControlsLeave.bind(this));

  this.elControlsNav.addEventListener('mouseenter', this.onNextHover.bind(this));
  this.elControlsNav.addEventListener('mouseleave', this.onNextLeave.bind(this));

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

  //Bind keyboard events to make the playback controllable by the keyboard.
  window.addEventListener('keydown', (function(e) {
    var k = e.keyCode || e.which;

    //Volume Controls.
    if (k == '38') //Up Arrow
      this.changeVolumeDelta(+10);
    else if (k == '40') //Down Arrow
      this.changeVolumeDelta(-10);

    //Playback controls.
    else if (k == '37') //Left Arrow.
      this.seekTo(-10);
    else if (k == '39')  //Right Arrow.
       this.seekTo(+10);

  }).bind(this));

  document.getElementById('pl-fs').addEventListener('click', (function() {
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
    document.getElementById('pl-fs-wrap').classList.add('fs');
  }).bind(this));

  document.getElementById('pl-fs-ex').addEventListener('click', (function(){
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
    document.getElementById('pl-fs-wrap').classList.remove('fs');
  }).bind(this));
}

lb.player.prototype.onPlayerReady = function () {
  this.video.playVideo();
  this.showTime();
  this.showLoaded();
  this.showProgressPosition();
}

lb.player.prototype.onPlayerStateChange = function (e) {
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

lb.player.prototype.onPlay = function () {
  this.elPlayer.classList.remove('loading');
  this.elControlsPlayback.classList.add('pause');
  this.elControlsPlayback.classList.remove('play');
  this.elVolumeBar.style.height = this.video.getVolume() + '%';
  this.showControls();
}

lb.player.prototype.onPause = function () {
  this.elControlsPlayback.classList.add('play');
  this.elControlsPlayback.classList.remove('pause');
}

lb.player.prototype.onEnded = function () {
  if(this.current < lb.videos.length - 1) {
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

lb.player.prototype.onPlayClick = function () {
  this.video.playVideo();
}

lb.player.prototype.onPauseClick = function () {
  this.video.pauseVideo();
}

lb.player.prototype.onVolumeClick = function () {
  this.video.mute();

  this.elControlsAudio.classList.add('mute');
  this.elControlsAudio.classList.remove('volume');
}

lb.player.prototype.onMuteClick = function () {
  this.video.unMute();

  this.elControlsAudio.classList.add('volume');
  this.elControlsAudio.classList.remove('mute');
}

lb.player.prototype.onNextClick = function () {
  if(this.current < lb.videos.length - 1) {
    this.setCurrent(this.current + 1);
  } else {
    this.video.pauseVideo();
    this.finalScreen.style.display = 'block';
  }
}

lb.player.prototype.onWatchAgainClick = function () {
  this.finalScreen.style.display = 'none';
  if(this.current === lb.videos.length - 1) {
    this.setCurrent(0);
  } else {
    this.setCurrent(this.current);
  }
}

lb.player.prototype.hideVolumeWrap = function () {
  this.elVolumeWrap.style.display = 'none';
  this.elVolumeWrap.removeEventListener('transitionend', this.hideVolumeWrapBind)
}

lb.player.prototype.onVolumeControlsHover = function () {
  this.hideSeekBar();
  this.elVolumeWrap.removeEventListener('transitionend', this.hideVolumeWrapBind);
  this.elVolumeWrap.style.display = 'block';
  setTimeout((function(){
    this.elVolumeWrap.style.opacity = 1;
  }).bind(this), 10);
}

lb.player.prototype.onVolumeControlsLeave = function () {
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

lb.player.prototype.hideNext = function () {
  //this.elPopup.style.display = 'none';
  //this.elPopup.removeEventListener('transitionend', this.hideNextBind)
}

lb.player.prototype.onNextHover = function () {
  this.hideSeekBar();
  //this.elPopup.removeEventListener('transitionend', this.hideNextBind);
  //this.elPopup.style.display = 'block';
  setTimeout((function(){
    //this.elPopup.style.opacity = 1;
  }).bind(this),10);
}

lb.player.prototype.onNextLeave = function () {
  this.showSeekBar();
  this.hideNextBind = (function() {
    //this.elPopup.style.display = 'none';
    //this.elPopup.removeEventListener('transitionend', this.hideNextBind);
  }).bind(this);

  //this.elPopup.addEventListener('transitionend', this.hideNextBind);
  //this.elPopup.style.opacity = 0;
}


lb.player.prototype.startSeek = function (e) {
  this.isSeeking = true;
  this.bindSeek = this.seek.bind(this);
  this.bindSeek(e);
  this.elSeek.addEventListener('mousemove', this.bindSeek);
}

lb.player.prototype.stopSeek = function (e) {
  if(!this.isSeeking) return;

  var layerX = e.clientX - this.elSeek.getBoundingClientRect().left,
      seconds = (layerX / this.elSeek.clientWidth) * this.video.getDuration();

  seconds = (seconds < 0 ? 0 : seconds > this.video.getDuration()-1 ? this.video.getDuration()-1 : seconds);

  this.video.seekTo(seconds, true);

  this.isSeeking = false;

  this.elSeek.removeEventListener('mousemove', this.bindSeek);
}

lb.player.prototype.seek = function(e) {
  var layerX = e.clientX - this.elSeek.getBoundingClientRect().left,
      seconds = (layerX / this.elSeek.clientWidth) * this.video.getDuration(),
      progress = (seconds / this.video.getDuration()) * 100;

  progress = (progress < 0 ? 0 : progress > 100 ? 100 : progress);
  seconds = (seconds < 0 ? 0 : seconds > this.video.getDuration() ? this.video.getDuration() : seconds);

  this.video.seekTo(seconds, false);
  this.elProgressPosition.style.width = progress + '%';
}

lb.player.prototype.seekTo = function(deltaSeconds) {
    var currSeconds = this.video.getCurrentTime();
    this.video.seekTo(currSeconds + deltaSeconds, true);
}

lb.player.prototype.startVolumeChange = function(e) {
  this.isChangingVolume = true;
  this.bindVolumeChange = this.volumeChange.bind(this);
  this.bindVolumeChange(e);
  this.elVolume.addEventListener('mousemove', this.bindVolumeChange);
}

lb.player.prototype.stopVolumeChange = function(e) {
  if(!this.isChangingVolume) return;

  var layerY = e.clientY - this.elVolume.getBoundingClientRect().top,
      volume = 100 - (layerY / this.elVolume.clientHeight) * 100;

  this.isChangingVolume = false;

  this.elVolume.removeEventListener('mousemove', this.bindVolumeChange);
}

lb.player.prototype.volumeChange = function(e) {
  if(window.YT === undefined) return;

  var layerY = e.clientY - this.elVolume.getBoundingClientRect().top,
      volume = 100 - (layerY / this.elVolume.clientHeight) * 100,
      delta  = volume - this.video.getVolume();

  this.changeVolumeDelta(delta);
};

lb.player.prototype.changeVolumeDelta = function(deltaVolume) {
  var currVolume  = this.video.getVolume();
  var finalVolume = currVolume + deltaVolume;

  finalVolume = (finalVolume < 0 ? 0 : finalVolume > 100 ? 100 : finalVolume);

  this.video.setVolume(finalVolume);
  this.elVolumeBar.style.height = finalVolume + '%';
}

lb.player.prototype.hideSeekBar = function () {
  this.elProgressBarWrap.classList.add('hide');
}

lb.player.prototype.showSeekBar = function () {
  this.elProgressBarWrap.classList.remove('hide');
}

lb.player.prototype.hideControls = function () {
  this.controlsHideBind = (function(){
    document.getElementById('exit-button').style.display = 'none';
    document.getElementById('exit-button').addEventListener('transitionend', this.controlsHideBind);

    this.elControls.style.display = 'none';
    this.elControls.addEventListener('transitionend', this.controlsHideBind);
  }).bind(this);

  document.getElementById('exit-button').addEventListener('transitionend', this.controlsHideBind);
  document.getElementById('exit-button').classList.add('hide');

  this.elControls.addEventListener('transitionend', this.controlsHideBind);
  this.elControls.classList.add('hide');
}

lb.player.prototype.showControls = function () {
  clearTimeout(this.controlsTimer);

  document.getElementById('exit-button').style.display = 'block';
  document.getElementById('exit-button').removeEventListener('transitionend', this.controlsHideBind);
  document.getElementById('exit-button').classList.remove('hide');

  this.elControls.style.display = 'block';
  this.elControls.removeEventListener('transitionend', this.controlsHideBind);
  this.elControls.classList.remove('hide');

  this.controlsTimer = setTimeout(this.hideControls.bind(this), 3000);
}
