define([
		'backbone',
		'underscore'
	],
	function(Backbone) {
		"use strict";
		
		return Backbone.Model.extend({
			urlRoot: '/feed.json',
			events: {},
			initialize: function () {
				_.bindAll(this, 'getFeed1', 'getFeed2', 'updateIndex', 'getIndexes');
				_.extend(this.events, Backbone.Events);
				
				this.indexes = {
						'userFeed': 0,
						'yiFeed': 0
				}
				
				this.events.bind('updateIndex', this.updateIndex);
			},
			getFeed1: function() {
				return this.get('user').feed;
			},
			getFeed2: function() {
				return this.get('yi').feed;
			},
			updateIndex: function (down) {
				if (down) {
					this.indexes['userFeed']--;
					this.indexes['yiFeed']--;
				} else {
					this.indexes['userFeed']++;
					this.indexes['yiFeed']++;
				}
				
				if (this.indexes['userFeed'] >= this.get('user').feed.length) {
					this.indexes['userFeed'] = 0;
				} else if (this.indexes['userFeed'] <= 0) {
					this.indexes['userFeed'] = this.get('user').feed.length - 1;
				}
				
				if (this.indexes['yiFeed'] >= this.get('yi').feed.length) {
					this.indexes['yiFeed'] = 0;
				} else if (this.indexes['yiFeed'] <= 0) {
					this.indexes['yiFeed'] = this.get('yi').feed.length - 1;
				}
				
				this.events.trigger('indexUpdated', this.indexes);
				return this.indexes;
			},
			getIndexes: function() {
				return this.indexes;
			}
		});
	}
);
