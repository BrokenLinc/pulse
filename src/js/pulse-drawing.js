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
		drawLines: function(){
			//Coming soon!
			return $(this);
		}
	};

})(jQuery);