
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
				$container.css({'display':'block'});
				
				var app = new CanvasView({
					el : $container
				});
			}
		};
	}
);
