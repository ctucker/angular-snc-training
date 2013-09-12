/* global angular */

"use strict";
angular.module('localStorageService', []).factory('taskPersister', function(localStorageKey) {

	return {
		retrieve : function() {
			return JSON.parse(localStorage.getItem(localStorageKey) || '[]');
		},

		store : function(taskList) {
			localStorage.setItem(localStorageKey, JSON.stringify(taskList || '[]'));
		}
	};

});