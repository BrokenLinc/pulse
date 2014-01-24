(function($) {
	var parts, 
		old = $.fn.pulse, 
		duration_classes = [],
		config = {
			class_hidden: 'pulse-hidden',
			class_duration: 'pulse-duration',
			class_duration_micro: 'pulse-duration-micro',
			class_no_transition: 'pulse-transition-none',
			key_pulse_timing: 'pulse-timing',
			key_pulse_duration: 'pulse-duration'
		};

	$(function(){
		//grab durations from css
		var $e = $('<div><div style="display:none;" class="'+config.class_duration+'"/><div style="display:none;" class="'+config.class_duration_micro+'"/></div>').appendTo(document.body);
		var d = $('.'+config.class_duration, $e).css('transition-duration');
		var d_m = $('.'+config.class_duration_micro, $e).css('transition-duration');
		$e.remove();
		config.duration = Number(d.substr(0,d.length-1));
		config.duration_micro = Number(d_m.substr(0,d_m.length-1));
	});

	$.fn.pulse = function (custom_config) {
		$.extend(config, custom_config);
		var that = old? old.apply(this, arguments) : this;
		$.extend(that, parts);
		return that;
	};

	parts = {

		toggle: function(timing, duration){
			return toggle_element(this, timing, duration);
		},
		show: function(timing, duration){;
			return toggle_element(this, timing, duration, true);
		},
		hide: function(timing, duration){;
			return toggle_element(this, timing, duration, false);
		},

		toggleNow: function(timing, duration){
			return toggle_element(this, timing, duration, null, true);
		},
		showNow: function(timing, duration){;
			return toggle_element(this, timing, duration, true, true);
		},
		hideNow: function(timing, duration){;
			return toggle_element(this, timing, duration, false, true);
		},

		toggleList: function(iteration_delay, timing, duration){
			return iterate_over_items(this, function(element){
				toggle_element(element, timing, duration);
			}, iteration_delay);
		},
		showList: function(iteration_delay, timing, duration){
			return iterate_over_items(this, function(element){
				toggle_element(element, timing, duration, true);
			}, iteration_delay);
		},
		hideList: function(iteration_delay, timing, duration){
			return iterate_over_items(this, function(element){
				toggle_element(element, timing, duration, false);
			}, iteration_delay);
		},

		random: function() {
			return $(this).get(Math.floor(Math.random()*$(this).length));
		}

	};

	function set_timing(element, className) {
		var $element = $(element),
			old = $element.data(config.key_pulse_timing);
		old && $element.removeClass(old);
		className && $element.addClass(className);
		$element.data(config.key_pulse_timing, className);
	}

	function duration_class(duration) {
		var className = duration? 'pulse-duration-'+duration : config.class_duration;
		if(!duration_classes[duration]) {
			$('<style type="text/css">.'+className+'{-webkit-transition-duration:'+duration+'ms;transition-duration:'+duration+'ms;}</style>').appendTo("head");
			duration_classes[duration] = className;
		}
		return className;
	}

	function set_duration(element, className) {
		var $element = $(element),
			old = $element.data(config.key_pulse_duration);
		old && $element.removeClass(old);
		className && $element.addClass(className);
		$element.data(config.key_pulse_duration, className);
	}

	function toggle_element(element, timing, duration, doShow, doNow) {
		var $element = $(element);
		set_timing($element, timing);
		set_duration($element, duration_class(duration));
		if(doNow == null) $element.removeClass(config.class_no_transition);
		else $element.toggleClass(config.class_no_transition, doNow);
		if(doShow == null) $element.toggleClass(config.class_hidden);
		else $element.toggleClass(config.class_hidden, !doShow);
		return $element;
	}

	function iterate_over_items(elements, fn, iteration_delay) {
		var index = 0,
			step = function() {
				if(index < elements.length) fn(elements[index]);
				else done();
				index++;
			},
			done = function() {
				clearInterval(interval);
			},
			interval = setInterval(step, (iteration_delay || config.duration_micro/8) * 1000);
		return $(elements);
	}

})(jQuery);