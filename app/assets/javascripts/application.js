
define([
        'jquery',
		'views/canvas.view'
	],
	function($, CanvasView) {
		"use strict";
		
		return {
			initialize : function() {
				var $container = $('#feedContainer');
				$container.empty();
				
				var app = new CanvasView({
					el : $container
				});
			}
		};
	}
);
