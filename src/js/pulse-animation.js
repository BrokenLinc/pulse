// Examples
// pulse.animation.removeFromList(selector[, method]).done(function(){});
// pulse.animation.addToList(selector, parentSelector[, method, afterSelector]).done(function(){});
// pulse.animation.pingPong(selector, class);

(function($) {
	var parts, globalOptions = {};

	$.fn.pulse = function (globalConfig) {
		$.extend(globalOptions, globalConfig);
		$.extend(this, parts);
		return this;
	};

	parts = {

		toggle: function(){;
			return $(this).removeClass('pulse-no-transition').toggleClass('pulse-hidden');
		},

		toggleNow: function(){
			return $(this).addClass('pulse-no-transition').toggleClass('pulse-hidden');
		},

		toggleList: function(prop){
			var elements = this,
				index = 0,
				step = function() {
					if(index < elements.length) {
						$(elements[index]).addClass('pulse-transition-duration-micro').toggleClass(prefix('pulse-hide-', prop));
					} else {
						done();
					}
					index++;
				},
				done = function() {
					clearInterval(interval);
				},
				interval = setInterval(step, 0.05 * 1000);

			return $(this);
		},

	};

})(jQuery);