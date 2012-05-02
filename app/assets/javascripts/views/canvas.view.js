define([
		'jquery',
		'underscore',
		'backbone',
		'text!templates/canvas.tmpl.html',
		'assets/models/user.model.js'
	],
	function($, _, Backbone, CanvasTemplate, UserModel) {
		"use strict";

		return Backbone.View.extend({
			template : _.template(CanvasTemplate),
			
			initialize : function() {
				_.bindAll(this, 'render', 'getImageData');
				this.render();
			},
			
			render : function() {
				this.$el.append(this.template());
				
				this.canvas = this.$el.find('#feedCanvas')[0];
				this.ctx = this.canvas.getContext('2d');
				
				var model = new UserModel();
				
				var that = this;
				model.fetch({
					success: function (rModel) {
						
						function downloadCallback(imageData) {
//							var finalImage = that.canvas.toDataURL("image/png");
//							that.$el.append('<a href="' + finalImage + '">download image</a>');
							console.log(imageData.data[4]);
						}
						
						var img1_src = 'data:image/jpg;base64,' + rModel.get('user').feed[0];
						var img2_src = 'data:image/jpg;base64,' + rModel.get('yi').feed[0];
						
						that.getImageData(img1_src, downloadCallback);
						that.getImageData(img2_src, downloadCallback);

					}
				});

				return this;
			},
			
			getImageData: function(imageSrc, callback) {
				var imageHeight = 615,
					imageWidth = 615;
				
				this.canvas.height = imageHeight;
				this.canvas.width = imageWidth;
				this.ctx.clearRect(0, 0, imageWidth, imageHeight);

				var img = new Image();
				var that = this;
				img.onload = function () {
					that.ctx.drawImage(img, 0, 0, imageWidth, imageHeight);
					var imageData = that.ctx.getImageData(0, 0, imageWidth, imageHeight);
					that.ctx.clearRect(0, 0, imageHeight, imageWidth);
					callback(imageData);
				}
				img.src = imageSrc;
			}
		});
	}
);
