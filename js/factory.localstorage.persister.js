angular.module('localstorage', []).factory('persister', function() {
	"use strict";

	return {
		save : function(key, data) {
			localStorage.setItem(key, angular.toJson(data));
		},

		load : function(key) {
			return angular.fromJson(localStorage.getItem(key));
		}
	};

});