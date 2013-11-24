(function($) {
	var parts, globalOptions = {
		micro_duration: 0.05,
		hidden_class: 'pulse-hidden',
		no_transition_class: 'pulse-no-transition',
		moving_class: 'pulse-moving'
	};

	$.fn.pulse = function (globalConfig) {
		$.extend(globalOptions, globalConfig);
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
				cache_display(this, 'pulse-moving-from');
			});

			// ***** predict new positions:
			// simulate removal
			$elements.addClass('pulse-removed');
			// cache new sizes/positions of container and siblings
			$all.each(function(index){
				cache_display(this, 'pulse-moving-to');
			});
			// undo sim
			$elements.removeClass('pulse-removed');

			// ***** prep for transition
			// shift container and siblings to absolute positioning at current position 
			$parents.each(function(index){
				uncache_size(this, 'pulse-moving-from');
				if($(this).css('position') == 'static') $(this).addClass('pulse-position-relative');
			});
			$children.each(function(index){
				uncache_size(this, 'pulse-moving-from');
				uncache_position(this, 'pulse-moving-from');
			}).addClass('pulse-position-absolute');

			// (transition delay hack)
			setTimeout(function(){
				// and mark as "moving"
				$all.addClass('pulse-moving');
				// hide item
				$elements.addClass('pulse-hidden');
				// and set new positions and sizes of container and siblings
				$parents.each(function(index){
					uncache_size(this, 'pulse-moving-to');
				});
				$siblings.each(function(index){
					uncache_position(this, 'pulse-moving-to');
				});

				// ***** after animation is complete (todo: get duration via css):
				setTimeout(function(){
					$elements.remove();
					//remove item and revert siblings and container to original display settings
					$all.removeClass('pulse-position-absolute pulse-position-relative pulse-moving').css({
						top: '',
						left: '',
						width: '',
						height: ''
					});
				}, 400);

				//and fire callback (todo)
			}, 10);

			return $(this);
		},

	};

	function toggle_element(element, doShow, doNow) {
		var $element = $(element);
		if(doNow == null) $element.removeClass(globalOptions.no_transition_class);
		else $element.toggleClass(globalOptions.no_transition_class, doNow);
		if(doShow == null) $element.toggleClass(globalOptions.hidden_class);
		else $element.toggleClass(globalOptions.hidden_class, !doShow);
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
			interval = setInterval(step, globalOptions.micro_duration * 1000);
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