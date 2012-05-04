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
				_.bindAll(this, 'bindEvents', 'render', 'updateIndex');
				
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
				this.$el.append(this.$template);
				
				return this;
			},
			updateIndex: function (indexes) {
				this.indexes = indexes;
			}
		});
	}
);
