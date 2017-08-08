$(function () {
    var timer;
    var fadeInBuffer = false;
    $(document).mousemove(function () {
        if (!fadeInBuffer) {
            if (timer) {
                //console.log("clearTimer");
                clearTimeout(timer);
                timer = 0;
            }

                //console.log("fadeIn");
            $('.fade-object').fadeIn();
            $('html').css({
                cursor: ''
            });
        } else {
            fadeInBuffer = false;
        }


        timer = setTimeout(function () {
            //console.log("fadeout");
            $('.fade-object').fadeOut()
            $('html').css({
                cursor: 'url(http://www.javascriptkit.com/dhtmltutors/cursor-hand.gif), auto'
            });
            fadeInBuffer = true;
        }, 5000)
    });
});



if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
 // document.getElementById('pl-mobile').style.display = 'block';

  setTimeout(function() {
   // window.location.replace('');
  }, 10000);
}
else {
  window.onYouTubeIframeAPIReady = function() {

   // lb.obj = new lb.player();

  }
}

	function  Q(id){
		return document.querySelector(id);
	}

	Q("#go").onload=function(){

		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
   			//window.location.replace('');
        Q("#pl-player").style.display='block';
  			lb.obj = new lb.player();
		}else{
			//Q("#step_one").style.display='none';
			Q("#pl-player").style.display='block';
			lb.obj = new lb.player();
		}
	}
