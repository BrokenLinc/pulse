(function($) {
	var parts, 
		old = $.fn.pulse, 
		config = {
		};

	$.fn.pulse = function (custom_config) {
		$.extend(config, custom_config);
		var that = old? old.apply(this, arguments) : this;
		$.extend(that, parts);
		return that;
	};

	parts = {
		drawLines: function(drawDuration){
			$(this).each(function(){
				var pathLength=this.getTotalLength();
				$(this).stop().css({
					'stroke-dasharray':pathLength+'px,'+pathLength+'px',
					'stroke-dashoffset':pathLength+'px'})
				.delay(10)
				.animate({'stroke-dashoffset':0},drawDuration*1000);
			});

			return $(this);
		}
	};

})(jQuery);