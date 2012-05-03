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
				_.bindAll(this, 'render', 'createImageMashup', 'getImageData', 'manipulateImage');
				this.render();
			},
			render : function() {
				this.$el.append(this.template());
				
				this.canvas = this.$el.find('#feedCanvas')[0];
				if (this.canvas !== undefined) {
					this.ctx = this.canvas.getContext('2d');

					this.feed1ImgIndex = 0;
					this.feed2ImgIndex = 0;
					
					var model = new UserModel();
					var that = this;
					model.fetch({
						success: function (rModel) {
							that.createImageMashup(rModel);
							
							that.$el.append('<p><a href="#" id="prevImage">< Prev</a> | <a href="#" id="nextImage">Next ></a></p>');
							that.$el.find('#nextImage').bind('click', function(e) {
								e.preventDefault();
								
								that.feed1ImgIndex++;
								that.feed2ImgIndex++;
								
								that.createImageMashup(rModel);
							});
							
							that.$el.find('#prevImage').bind('click', function(e) {
								e.preventDefault();
								
								that.feed1ImgIndex--;
								that.feed2ImgIndex--;
								
								that.createImageMashup(rModel);
							});
						}
					});
				}
				return this;
			},
			createImageMashup: function(data) {
				if (this.feed1ImgIndex >= data.get('user').feed.length) {
					this.feed1ImgIndex = 0;
				} else if (this.feed1ImgIndex <= 0) {
					this.feed1ImgIndex = data.get('user').feed.length - 1;
				}
				
				if (this.feed2ImgIndex >= data.get('yi').feed.length) {
					this.feed2ImgIndex = 0;
				} else if (this.feed2ImgIndex <= 0) {
					this.feed2ImgIndex = data.get('yi').feed.length - 1;
				}
				
				var img1_src = 'data:image/jpg;base64,' + data.get('user').feed[this.feed1ImgIndex];
				var img2_src = 'data:image/jpg;base64,' + data.get('yi').feed[this.feed2ImgIndex];
				var user = data.get('user');
				
				this.getImageData(img1_src, img2_src, this.manipulateImage, user);
			},
			getImageData: function(image1Src, image2Src, callback, user) {
				var height = 615,
					width = 615,
					img1Loaded = false,
					img2Loaded = false,
					img1Data = null,
					img2Data = null;
				
				this.username = user.username;

				this.canvas.height = height;
				this.canvas.width = width;
				this.ctx.clearRect(0, 0, width, height);

				var img1 = new Image();
				var that = this;
				img1.onload = function () {
					that.ctx.drawImage(img1, 0, 0, width, height);
					img1Data = that.ctx.getImageData(0, 0, width, height);
					that.ctx.clearRect(0, 0, that.canvas.width, that.canvas.height);
					img1Loaded = true;
					if (img1Loaded && img2Loaded) {
						callback(img1Data, img2Data);	
					}
				}
				img1.src = image1Src;

				var img2 = new Image();
				img2.onload = function () {
					that.ctx.drawImage(img2, 0, 0, width, height);
					img2Data = that.ctx.getImageData(0, 0, width, height);
					that.ctx.clearRect(0, 0, that.canvas.width, that.canvas.height);
					img2Loaded = true;
					if (img1Loaded && img2Loaded) {
						callback(img1Data, img2Data);	
					}
				}
				img2.src = image2Src;
			},
			manipulateImage: function(image1Data, image2Data) {

				var pixels = 4 * this.canvas.width * this.canvas.height;
				var tmp = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
				while (pixels--) {
					tmp.data[pixels] = (image1Data.data[pixels] * 0.3) + (image2Data.data[pixels] * 0.7);
				}

				this.ctx.putImageData(tmp, 0, 0);
				var image3Data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

				pixels = 4 * this.canvas.width * this.canvas.height;
				var finalImage = image3Data;
				var pixel = this.canvas.width * this.canvas.height;
				var row = this.canvas.height;
				var column = this.canvas.width;
				var colPos1 = Math.round((this.canvas.width/100)*40);
				var colPos2 = Math.round((this.canvas.width/100)*70);

				var freq = this.username.length;
				var thisFreq = freq;
				
				for (var x = pixels; x >= 0; x = x-4) {
					if (column <= 0) {
						column = this.canvas.width;
						row--;
						freq--;
						if (freq <= 0) {
							colPos1--;
							colPos2--;
							freq = thisFreq;
						}
					}
					
					if (column < colPos1) {
						finalImage.data[x] = image1Data.data[x];
						finalImage.data[x-1] = image1Data.data[x-1];
						finalImage.data[x-2] = image1Data.data[x-2];
						finalImage.data[x-3] = image1Data.data[x-3];
					}

					if (column > colPos2) {
						finalImage.data[x] = image2Data.data[x];
						finalImage.data[x-1] = image2Data.data[x-1];
						finalImage.data[x-2] = image2Data.data[x-2];
						finalImage.data[x-3] = image2Data.data[x-3];
					}
					
					

					column--;
				}

				this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
				this.ctx.putImageData(finalImage, 0, 0);

				var finalImageUrl = this.canvas.toDataURL("image/png");
				var $imageDownload = this.$el.find('#imageDownload');
				if ($imageDownload.length > 0) {
					$imageDownload.attr({'href': finalImageUrl });
				} else {
					this.$el.append('<p><a href="' + finalImageUrl + '" id="imageDownload">save image</a></p>');
					
					
					var that = this;
					this.$el.find('#imageDownload').bind('click', function(e) {
						e.preventDefault();
						
						var data = {
							user: {
								username: that.username,
								imagedata: that.canvas.toDataURL("image/png")
							}
						}
						
						$.ajax({
							type: 'POST',
							url: '/save-art',
							data: data,
							success: function() {
								alert('SAVED');
							},
							dataType: 'json'
						})
					});
				}

			}
		});
	}
);
