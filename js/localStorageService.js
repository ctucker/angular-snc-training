/* global angular */

"use strict";
angular.module('localStorageService', []).factory('taskPersister', function(localStorageKey) {

	return {
		retrieve : function() {
			return JSON.parse(localStorage.getItem(localStorageKey) || '[]');
		},

		store : function(taskList) {

			var jsonString = JSON.stringify(taskList || '[]', function(key, value) {
				// Strip the hashkey out so Angular doesn't get confused when it reads this back in
				if (key === '$$hashKey') {
					return undefined;
				}
				return value;
			});
			localStorage.setItem(localStorageKey, jsonString);
		}
	};

});