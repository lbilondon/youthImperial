
define([
        'jquery',
        'underscore',
        'backbone',
		'assets/models/user.model.js',
		'views/canvas.view',
		'views/gallery.view'
	],
	function($, _, Backbone, UserModel, CanvasView, GalleryView) {
		"use strict";
		
		return {
			initialize : function() {
				var $container = $('#feedContainer');
				$container.empty();
				$container.css({'display':'block'});
				
				var model = new UserModel();
				model.fetch({
					success: function (rModel) {
						var canvas = new CanvasView({
							el : $container,
							model: rModel
						});
					
						var galleryLeft = new GalleryView({
							el : $container,
							model: rModel,
							feed: rModel.getFeed1(),
							feedName: 'user'
						});
						
						var galleryRight = new GalleryView({
							el: $container,
							model: rModel,
							feed: rModel.getFeed2(),
							feedName: 'yi'
						})
					}
				});
				
			}
		};
	}
);
