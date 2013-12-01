#Notes For Future Development

###For pure css integration (future)
	<div class="mydiv click-to-toggle fancy-animation-class"></div>



###Dev Notes
	//$('.myclass').pulse().toggle('scale-and-rotate-90deg', 600, function(){

	//});

	//$('.myclass').pulse().animate('pulse-flip-up-and-explode', 600).remove('pulse-flip-up-and-explode', 600);

	//animationstart
	//animationend
	//animationiteration

	$('.my-class').one('webkitAnimationEnd oanimationend msAnimationEnd animationend',function(){
		$('.my-class').hide();
		$('.my-class').removeClass('flipOutX');
	});