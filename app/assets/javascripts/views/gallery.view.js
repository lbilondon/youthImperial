define([
		'jquery',	//Included by default, but needed in less instances now that views have cached '$el'
		'underscore',
		'backbone',
		'text!templates/gallery.tmpl.html'
	],
	function($, _, Backbone, GalleryTemplate) {
		"use strict";

		return Backbone.View.extend({
			template : _.template(GalleryTemplate),
			
			initialize : function() {
				_.bindAll(this, 'bindEvents', 'render', 'updateIndex', 'placeCurrentItemForward', 'placeCurrentItemBackward');
				this.$el = $(this.el);
				this.feed = this.options.feed;
				this.feedName = this.options.feedName;
				
				this.indexes = this.model.getIndexes();
				
				this.render();
				this.bindEvents();
			},
			bindEvents: function () {
				this.model.events.on('indexUpdated', this.updateIndex);
			},
			unbindEvents: function () {
				this.model.events.off('indexUpdated', this.updateIndex);
			},
			render : function() {
				this.$template = $(this.template());
				this.$gallery = this.$template.find('.gallery');
				
				this.$el.append(this.$template);
			
				this.$template.addClass('gallery_' + this.feedName);
				
				var str = '';
				var thisClass = '';
				
				for (var i = 0; i < this.feed.length; i++) {
					thisClass = '';
					if (this.indexes[this.feedName + 'Feed'] === i) {
						str += '<li class="current">';
					} else {
						str += '<li>';
					}
					str += '<img src="data:image/jpg;base64,' + this.feed[i] + '" />';
				}
				
				this.$gallery.append(str);
				this.placeCurrentItemForward(this.$template.find('.current'));
				
				return this;
			},
			updateIndex: function (rtnObj) {
				this.$gallery.find('li').removeClass('current');
				var $currentItem = this.$gallery.find('li:first-child');
				if (!rtnObj.isDown) {
					this.placeCurrentItemForward($currentItem);
				} else {
					$currentItem = this.$gallery.find('li:last-child'); 
					this.placeCurrentItemBackward($currentItem);
				}
			},
			placeCurrentItemForward: function ($currentItem) {
				var that = this;

				if (this.feedName === 'yi') {
					this.$gallery.animate({
						'margin-left': '-210px'
					}, {
						duration: 1000,
						complete: function () {
							$currentItem.detach();
							that.$gallery.css({ 'margin-left': '0' });
							that.$gallery.append($currentItem);
							$currentItem.addClass('current');
						}
					});
				} else {
					this.$gallery.animate({
						'margin-right': '-210px'
					}, {
						duration: 1000,
						complete: function () {
							$currentItem.detach();
							that.$gallery.css({ 'margin-right': '0' });

							that.$gallery.append($currentItem);
							$currentItem.addClass('current');
						}
					});
				}
			},
			placeCurrentItemBackward: function ($currentItem) {
				var that = this;
				
				if (this.feedName === 'yi') {
					this.$gallery.css({ 'margin-left': '-210px' });
					$currentItem.detach();
					this.$gallery.prepend($currentItem);
					this.$gallery.find('li:last-child').addClass('current');
					
					this.$gallery.animate({
						'margin-left': '0'
					}, {
						duration: 1000
					});
				} else {
					this.$gallery.css({ 'margin-right': '-210px'});
					$currentItem.detach();
					this.$gallery.prepend($currentItem);
					this.$gallery.find('li:last-child').addClass('current');
					
					this.$gallery.animate({
						'margin-right': '0'
					}, {
						duration: 1000
					});
				}
			}
		});
	}
);
