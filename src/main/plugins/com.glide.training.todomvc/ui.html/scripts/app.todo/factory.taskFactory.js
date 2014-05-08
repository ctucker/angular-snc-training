angular.module('todo').factory('taskFactory', function() {
	"use strict";
	return {
		newTask : function(title, isComplete) {
			return {
				title : title,
				isComplete : !!isComplete
			}
		}
	}
});