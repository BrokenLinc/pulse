// Examples
// pulse.animation.removeFromList(selector[, method]).done(function(){});
// pulse.animation.addToList(selector, parentSelector[, method, afterSelector]).done(function(){});
// pulse.animation.showList(selector[, method, isStaggered]).done(function(){});
// pulse.animation.pingPong(selector, class);

(function($) {
	var parts, globalOptions = {};

	$.fn.pulse = function (globalConfig) {
		$.extend(globalOptions, globalConfig);
		$.extend(this, parts);
		return this;
	};

	parts = {

		toggle: function(prop, notAnimated){
			return $(this).toggleClass('pulse-transition', !notAnimated).toggleClass(prefix('pulse-hide-', prop));
		},

		toggleNow: function(prop){
			return $(this).removeClass('pulse-transition').toggleClass(prefix('pulse-hide-', prop));
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

	function prefix(pre, strings) {
		var a = [], props = (strings.indexOf(' ') >= 0)? strings.split(' ') : [strings];

		for(var i = 0; i < props.length; i++) {
			if(props[i].length > 0) a.push(pre+props[i]);
		}

		return a.join(' ');
	}

})(jQuery);