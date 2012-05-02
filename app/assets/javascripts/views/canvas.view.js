define([
		'jquery',
		'underscore',
		'backbone',
		'text!templates/canvas.tmpl.html'
	],
	function($, _, Backbone, CanvasTemplate) {
		"use strict";

		return Backbone.View.extend({
			template : _.template(CanvasTemplate),
			
			initialize : function() {
				this.render();
			},
			
			render : function() {
				this.$el.append(this.template());
				
				return this;
			}
		});
	}
);
