if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
 // document.getElementById('nf-mobile').style.display = 'block';

  setTimeout(function() {
   // window.location.replace('https://www.youtube.com/watch?v=4dMfXlE1puI&list=PLIbm83EJqrLaPOpVX6FxJWSVR6PMby1Us');
  }, 10000);
}
else {
  window.onYouTubeIframeAPIReady = function() {

   // nf.obj = new nf.player();

  }
}

	function  Q(id){
		return document.querySelector(id);
	}

	Q("#go").onload=function(){

		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
   			//window.location.replace('https://www.youtube.com/watch?v=JaFVr_cJJIY');
        Q("#nf-player").style.display='block';
  			nf.obj = new nf.player();
		}else{
			//Q("#step_one").style.display='none';
			Q("#nf-player").style.display='block';
			nf.obj = new nf.player();
		}
	}

	Q("#go").onload=function(){

		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
   			//window.location.replace('https://www.youtube.com/watch?v=JaFVr_cJJIY');
        Q("#nf-player").style.display='block';
  			nf.obj = new nf.player();        
		}else{
			//Q("#step_one").style.display='none';
			Q("#nf-player").style.display='block';
			nf.obj = new nf.player();
		}
	}
