angular.module('todo').factory('taskFactory', function() {
	"use strict";
	return {
		newTask : function(title, isComplete, sysId) {
			return {
				title : title,
				isComplete : !!isComplete,
				sysId : sysId
			}
		}
	}
});