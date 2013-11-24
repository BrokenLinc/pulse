(function($) {
	var parts, config = {
		class_hidden: 'pulse-hidden',
		class_transition_none: 'pulse-no-transition',
		class_moving: 'pulse-moving',
		class_position_absolute: 'pulse-position-absolute',
		class_position_relative: 'pulse-position-relative',
		class_removed: 'pulse-removed',
		class_duration: 'pulse-duration',
		class_duration_micro: 'pulse-duration-micro',
		key_moving_from: 'pulse-moving-from',
		key_moving_to: 'pulse-moving-to'
	};

	$(function(){
		var $e = $('<div><div style="display:none;" class="'+config.class_duration+'"/><div style="display:none;" class="'+config.class_duration_micro+'"/></div>').appendTo(document.body);
		var d = $('.'+config.class_duration, $e).css('transition-duration');
		var d_m = $('.'+config.class_duration_micro, $e).css('transition-duration');
		$e.remove();
		config.duration = Number(d.substr(0,d.length-1));
		config.duration_micro = Number(d_m.substr(0,d_m.length-1));
	});

	$.fn.pulse = function (custom_config) {
		$.extend(config, custom_config);
		$.extend(this, parts);
		return this;
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

		toggleList: function(){
			return iterate_over_items(this, function(element){
				toggle_element(element);
			});
		},
		showList: function(){
			return iterate_over_items(this, function(element){
				toggle_element(element, true);
			});
		},
		hideList: function(){
			return iterate_over_items(this, function(element){
				toggle_element(element, false);
			});
		},

		//Work in Progress
		remove: function(){
			var $elements = $(this);
			var $parents = $elements.parent();
			var $children = $parents.children();
			var $siblings = $elements.siblings();
			var $all = $parents.add($children);

			// cache current sizes/positions of container and siblings
			$all.each(function(index){
				cache_display(this, config.key_moving_from);
			});

			// ***** predict new positions:
			// simulate removal
			$elements.addClass(config.class_removed);
			// cache new sizes/positions of container and siblings
			$all.each(function(index){
				cache_display(this, config.key_moving_to);
			});
			// undo sim
			$elements.removeClass(config.class_removed);

			// ***** prep for transition
			// shift container and siblings to absolute positioning at current position 
			$parents.each(function(index){
				uncache_size(this, config.key_moving_from);
				if($(this).css('position') == 'static') $(this).addClass(config.class_position_relative);
			});
			$children.each(function(index){
				uncache_size(this, config.key_moving_from);
				uncache_position(this, config.key_moving_from);
			}).addClass(config.class_position_absolute);

			// (transition delay hack)
			setTimeout(function(){
				// and mark as "moving"
				$all.addClass(config.class_moving);
				// hide item
				$elements.addClass(config.class_hidden);
				// and set new positions and sizes of container and siblings
				$parents.each(function(index){
					uncache_size(this, config.key_moving_to);
				});
				$siblings.each(function(index){
					uncache_position(this, config.key_moving_to);
				});

				// ***** after animation is complete (todo: get duration via css):
				setTimeout(function(){
					$elements.remove();
					//remove item and revert siblings and container to original display settings
					$all.removeClass([config.class_position_absolute, config.class_position_relative, config.class_moving].join(' ')).css({
						top: '',
						left: '',
						width: '',
						height: ''
					});
				}, config.duration * 1000);

				//and fire callback (todo)
			}, 10);

			return $(this);
		},

	};

	function toggle_element(element, doShow, doNow) {
		var $element = $(element);
		if(doNow == null) $element.removeClass(config.class_no_transition);
		else $element.toggleClass(config.class_no_transition, doNow);
		if(doShow == null) $element.toggleClass(config.class_hidden);
		else $element.toggleClass(config.class_hidden, !doShow);
		return $element;
	}

	function iterate_over_items(elements, fn) {
		var index = 0,
			step = function() {
				if(index < elements.length) fn(elements[index]);
				else done();
				index++;
			},
			done = function() {
				clearInterval(interval);
			},
			interval = setInterval(step, config.duration_micro * 1000);
		return $(elements);
	}

	function cache_display(element, key) {
		var $element = $(element);
		var pos = $element.offset();
		var parent_pos = $element.parent().offset();
		$element.data(key, {
			width: $element.width(),
			height: $element.height(),
			top: pos.top - parent_pos.top - num($element.css('margin-top')),
			left: pos.left - parent_pos.left - num($element.css('margin-left'))
		});
	}

	function uncache_size(element, key) {
		var $element = $(element);
		var from = $element.data(key);
		$element.css('width', from.width);
		$element.css('height', from.height);
	}

	function uncache_position(element, key) {
		var $element = $(element);
		var from = $element.data(key);
		$element.css('top', from.top);
		$element.css('left', from.left);
	}

	var num = function (value) {
		return parseInt(value, 10) || 0;
	};

})(jQuery);