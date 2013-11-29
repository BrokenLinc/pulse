(function($) {
	var parts, 
		old = $.fn.pulse, 
		config = {
			class_hidden: 'pulse-hidden',
			class_duration: 'pulse-duration',
			class_duration_micro: 'pulse-duration-micro'
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

	var old = $.fn.pulse;

	$.fn.pulse = function (custom_config) {
		$.extend(config, custom_config);
		var that = old? old.apply(this, arguments) : this;
		$.extend(that, parts);
		return that;
	};

	parts = {

		toggle: function(){;
			return toggle_element(this);
		},
		show: function(){;
			return toggle_element(this, true);
		},
		hide: function(){;
			return toggle_element(this, false);
		},

		toggleNow: function(){
			return toggle_element(this, null, true);
		},
		showNow: function(){;
			return toggle_element(this, true, true);
		},
		hideNow: function(){;
			return toggle_element(this, false, true);
		},

		toggleList: function(iteration_delay){
			return iterate_over_items(this, function(element){
				toggle_element(element);
			}, iteration_delay);
		},
		showList: function(iteration_delay){
			return iterate_over_items(this, function(element){
				toggle_element(element, true);
			}, iteration_delay);
		},
		hideList: function(iteration_delay){
			return iterate_over_items(this, function(element){
				toggle_element(element, false);
			}, iteration_delay);
		},

		random: function() {
			return $(this).get(Math.floor(Math.random()*$(this).length));
		}

	};

	function toggle_element(element, doShow, doNow) {
		var $element = $(element);
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