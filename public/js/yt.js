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
                cursor: 'url(), auto'
            });
            fadeInBuffer = true;
        }, 5000)
    });
});



function Q(id)
{
    return document.querySelector(id);
}

Q("#go").onload=function()
{
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) 
    {
	//window.location.replace('');
	console.log("celular3");
	Q("#pl-player").style.display='block';
	lb.obj = new lb.player();
    }
    else
    {
	Q("#pl-player").style.display='block';
	lb.obj = new lb.player();
    }
}
