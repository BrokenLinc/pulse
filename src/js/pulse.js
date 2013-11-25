(function($) {
	var parts, config = {
		class_hidden: 'pulse-hidden',
		class_transition_none: 'pulse-no-transition',
		class_moving: 'pulse-moving',
		class_moving_delayed: 'pulse-moving-delayed',
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

		remove: function(done_callback_fn){
			return list_manipulation(this, false, done_callback_fn);
		},

		prependTo: function(parents, done_callback_fn){
			return list_manipulation($(this).prependTo(parents), true, done_callback_fn);
		},

		appendTo: function(parents, done_callback_fn){
			return list_manipulation($(this).appendTo(parents), true, done_callback_fn);
		},

		insertAfter: function(precedents, done_callback_fn){
			return list_manipulation($(this).insertAfter(precedents), true, done_callback_fn);
		},

		random: function() {
			return $(this).get(Math.floor(Math.random()*$(this).length));
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
			interval = setInterval(step, config.duration_micro/2 * 1000);
		return $(elements);
	}

	function cache_display(elements, key) {
		$(elements).each(function(index){
			var $element = $(this),
				pos = $element.offset(),
				parent_pos = $element.parent().offset();
			$element.data(key, {
				width: $element.width(),
				height: $element.height(),
				top: pos.top - parent_pos.top - num($element.css('margin-top')),
				left: pos.left - parent_pos.left - num($element.css('margin-left'))
			});
		});
	}

	function uncache_size(elements, key) {
		$(elements).each(function(index){
			var $element = $(this),
				from = $element.data(key);
			$element.css({width: from.width, height: from.height});
		});
	}

	function uncache_position(elements, key) {
		$(elements).each(function(index){
			var $element = $(this),
				from = $element.data(key);
			$element.css({top: from.top, left: from.left});
		});
	}

	function list_manipulation(elements, isAdding, done_callback_fn) {
		var $elements = $(elements),
			$parents = $elements.parent(),
			$children = $parents.children(),
			$siblings = $elements.siblings(),
			$all = $parents.add($children);

		// cache current sizes/positions
		cache_display($all, isAdding? config.key_moving_to : config.key_moving_from);

		// ***** predict alternate positions:
		if(isAdding) {
			// element doesn't move
			cache_display($elements, config.key_moving_from);
			// simulate revert of other elements once element is removed
			$elements
				.addClass(config.class_removed)
				.addClass(config.class_hidden);
			// cache new sizes/positions of container and siblings
			cache_display($parents.add($siblings), config.key_moving_from);
		} else {
			// simulate removal
			$elements.addClass(config.class_removed);
			// cache new sizes/positions of container and siblings
			cache_display($all, config.key_moving_to);
		}
		// undo sim
		$elements.removeClass(config.class_removed);

		// ***** prep for transition
		// shift container and siblings to absolute positioning
		$parents.each(function(index){
			if($(this).css('position') == 'static') $(this).addClass(config.class_position_relative);
		});
		// at current position 
		uncache_size($all, config.key_moving_from);
		uncache_position($children, config.key_moving_from);
		$children.addClass(config.class_position_absolute);

		// (transition delay hack)
		setTimeout(function(){
			// and mark as "moving"
			$parents.add($siblings).addClass(isAdding? config.class_moving : config.class_moving_delayed);
			if(isAdding) {
				// show item
				$elements
					.addClass(config.class_moving_delayed)
					.removeClass(config.class_hidden);
			} else {
				// hide item
				$elements
					.addClass(config.class_moving)
					.addClass(config.class_hidden);
			}
			// and set new positions and sizes of container and siblings
			uncache_size(isAdding? $all : $parents, config.key_moving_to);
			uncache_position(isAdding? $children : $siblings, config.key_moving_to);

			// after transition is complete
			setTimeout(function(){
				// remove items
				if(!isAdding) $elements.remove();
				// revert siblings and container to original display settings
				$all.removeClass([
						config.class_position_absolute, 
						config.class_position_relative, 
						config.class_moving,
						config.class_moving_delayed
					].join(' ')).css({
						top: '',
						left: '',
						width: '',
						height: ''
				});
				// fire complete callback
				if(done_callback_fn) done_callback_fn();
			}, config.duration * 1000);
		}, 10);

		return $(this);
	}

	var num = function (value) {
		return parseInt(value, 10) || 0;
	};

})(jQuery);